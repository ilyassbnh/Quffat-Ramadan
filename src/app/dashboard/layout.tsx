import { ReactNode } from "react"
import {
    LayoutDashboard,
    HandHeart,
    Users,
    FileBarChart,
    Settings,
    LogOut
} from "lucide-react"
import { cn } from "@/lib/utils"

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
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Sidebar (Fixed Left) */}
            <aside className="z-10 hidden w-20 flex-col items-center border-r border-casa-emerald/20 bg-casa-white/80 py-6 backdrop-blur-md sm:flex">
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-casa-emerald text-white shadow-lg shadow-casa-emerald/30">
                    <span className="text-xl font-bold">A</span>
                </div>

                <nav className="flex flex-1 flex-col gap-6 px-2">
                    <NavIcon icon={LayoutDashboard} label="Dashboard" active />
                    <NavIcon icon={HandHeart} label="Donations" />
                    <NavIcon icon={Users} label="Families" />
                    <NavIcon icon={FileBarChart} label="Reports" />
                    <NavIcon icon={Settings} label="Settings" />
                </nav>

                <div className="mt-auto flex flex-col gap-4">
                    <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-casa-gold">
                        {/* Avatar Placeholder */}
                        <div className="h-full w-full bg-gray-200" />
                    </div>
                </div>
            </aside>

            {/* Main Content: Stacked on mobile, side-by-side on larger screens */}
            <main className="flex flex-1 flex-col overflow-hidden lg:grid lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]">

                {/* Chat Slot (Top on mobile, Left on desktop) */}
                <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-casa-white/50 backdrop-blur-sm lg:flex-none lg:h-full">
                    {/* Render chat slot predominantly. Children can be used for hidden page content or overlay */}
                    {chat}
                    <div className="hidden">{children}</div>
                </div>

                {/* Explorer Slot (Bottom on mobile, Right on desktop) */}
                <div className="relative flex min-h-0 flex-1 flex-col border-t border-casa-emerald/10 bg-casa-white/30 backdrop-blur-md lg:flex-none lg:h-full lg:border-l lg:border-t-0 overflow-auto">
                    {explorer}
                </div>
            </main>
        </div>
    )
}

function NavIcon({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
    return (
        <div className="group relative flex items-center justify-center">
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:scale-110",
                    active
                        ? "bg-casa-emerald text-white shadow-md shadow-casa-emerald/25"
                        : "text-muted-foreground hover:bg-casa-emerald/10 hover:text-casa-emerald"
                )}
                title={label}
            >
                <Icon className="h-5 w-5" />
            </button>
        </div>
    )
}
