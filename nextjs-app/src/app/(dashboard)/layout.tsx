// Server Component wrapper that forces dynamic rendering
// This is needed because useSession cannot be used during static prerendering
export const dynamic = 'force-dynamic';

import DashboardLayoutClient from './DashboardLayoutClient';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
