'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface OnboardingStatus {
    userStatus: string | null;
    hasKyc: boolean;
    hasInvestorProfile: boolean;
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
                        isLoading: false,
                    });
                    return;
                }

                const response = await fetch('/api/user/onboarding-status');
                if (response.ok) {
                    const data = await response.json();
                    setStatus({
                        userStatus: data.userStatus,
                        hasKyc: data.hasKyc,
                        hasInvestorProfile: data.hasInvestorProfile,
                        isLoading: false,
                    });

                    // Redirect based on onboarding status
                    const onboardingPaths = [
                        '/kyc-upload',
                        '/kyc-success',
                        '/investor-profile',
                        '/investor-profile-success',
                        '/investor-quiz',
                        '/investor-quiz-results'
                    ];
                    const isOnboardingPath = onboardingPaths.some(p => pathname.startsWith(p));

                    if (!isOnboardingPath) {
                        // User is trying to access dashboard but hasn't completed onboarding
                        if (!data.hasKyc) {
                            router.push('/kyc-upload');
                            return;
                        }
                        if (!data.hasInvestorProfile) {
                            router.push('/investor-profile');
                            return;
                        }
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
        const { isLoading, hasKyc, hasInvestorProfile } = useOnboardingCheck();

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

        if (!hasKyc || !hasInvestorProfile) {
            // Will be redirected by the hook
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}
