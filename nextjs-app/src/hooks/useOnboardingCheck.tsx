'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface OnboardingStatus {
    userStatus: string | null;
    hasKyc: boolean;
    hasInvestorProfile: boolean;
    kycStatus: string | null;
    isLoading: boolean;
}

export function useOnboardingCheck() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session } = useSession();
    const [status, setStatus] = useState<OnboardingStatus>({
        userStatus: null,
        hasKyc: false,
        hasInvestorProfile: false,
        kycStatus: null,
        isLoading: true,
    });

    useEffect(() => {
        const checkOnboarding = async () => {
            try {
                // Skip onboarding check for admin users
                const userRole = session?.user?.role;
                if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
                    setStatus({
                        userStatus: 'ACTIVE',
                        hasKyc: true,
                        hasInvestorProfile: true,
                        kycStatus: 'APPROVED',
                        isLoading: false,
                    });
                    return;
                }

                const response = await fetch('/api/user/onboarding-status');

                if (!response.ok) {
                    // If user is not found or unauthorized, force logout/redirect
                    if (response.status === 404 || response.status === 401) {
                        console.error('User not found or unauthorized, redirecting to login');
                        router.push('/login');
                        return;
                    }
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                setStatus({
                    userStatus: data.userStatus,
                    hasKyc: data.hasKyc,
                    hasInvestorProfile: data.hasInvestorProfile,
                    kycStatus: data.kycStatus,
                    isLoading: false,
                });

                // Redirect based on onboarding status
                const onboardingPaths = [
                    '/kyc-upload',
                    '/kyc-success',
                    '/investor-quiz',
                    '/investor-quiz-results'
                ];
                const isOnboardingPath = onboardingPaths.some(p => pathname.startsWith(p));

                if (!isOnboardingPath) {
                    // Step 1: If no KYC submitted at all, redirect to upload
                    if (!data.hasKyc) {
                        router.push('/kyc-upload');
                        return;
                    }

                    // Step 2: Only after KYC is APPROVED, check for investor profile
                    // If KYC is pending/in review, don't force the questionnaire yet
                    if (data.kycStatus === 'APPROVED' && !data.hasInvestorProfile) {
                        router.push('/investor-quiz');
                        return;
                    }
                }
            } catch (error) {
                console.error('Error checking onboarding status:', error);
                setStatus(prev => ({ ...prev, isLoading: false }));
            }
        };

        checkOnboarding();
    }, [pathname, router, session?.user?.role]);

    return status;
}

// HOC for pages that require completed onboarding
export function withOnboardingCheck<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function OnboardingCheckWrapper(props: P) {
        const { isLoading, hasKyc, hasInvestorProfile, kycStatus } = useOnboardingCheck();

        if (isLoading) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-slate-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">Verificando tu cuenta...</p>
                    </div>
                </div>
            );
        }

        // Block only if: no KYC, OR (KYC approved but no investor profile)
        const needsOnboarding = !hasKyc || (kycStatus === 'APPROVED' && !hasInvestorProfile);

        if (needsOnboarding) {
            // Will be redirected by the hook
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
