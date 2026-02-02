import { ReactNode } from "react"

export default function DashboardLayout({
    children,
    chat,
    explorer,
}: {
    children: ReactNode
    chat: ReactNode
    explorer: ReactNode
}) {
    return (
        <div className="flex h-screen w-full bg-background">
            {/* Sidebar (Optional) */}
            <aside className="hidden w-16 flex-col border-r bg-muted/10 sm:flex">
                {/* Navigation placeholder */}
                <nav className="flex flex-col items-center gap-4 px-2 py-4">
                    <div className="h-8 w-8 rounded-full bg-primary/20" />
                </nav>
            </aside>

            {/* Main Content Grid */}
            <div className="flex flex-1 flex-col sm:grid sm:grid-cols-[70%_30%]">
                {/* Explorer Panel (70%) */}
                <div className="relative flex h-full min-h-[50vh] flex-col border-r bg-background">
                    {children} {/* Rendering children here as main content */}
                    {explorer}
                </div>

                {/* Chat Panel (30%) */}
                <div className="relative flex h-full min-h-[50vh] flex-col bg-muted/5">
                    {chat}
                </div>
            </div>
        </div>
    )
}
