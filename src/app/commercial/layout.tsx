"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { 
    LayoutDashboard, 
    Users, 
    BookOpen, 
    LogOut,
    PlayCircle,
    User
} from "lucide-react";

export default function CommercialLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    // Do not show sidebar on login page
    if (pathname === "/commercial/login") {
        return <>{children}</>;
    }

    const navItems = [
        { name: "Dashboard", href: "/commercial", icon: LayoutDashboard },
        { name: "Prospects", href: "/commercial/prospects", icon: Users },
        { name: "Démonstration", href: "/commercial/demo", icon: PlayCircle },
        { name: "Mon Profil", href: "/commercial/profile", icon: User },
        { name: "Ressources", href: "/commercial/resources", icon: BookOpen },
    ];

    const handleLogout = async () => {
        // Appeler la route de déconnexion si elle existe, ou effacer le cookie côté client (bien que le cookie soit HTTP-only).
        // En l'absence de route de déconnexion dédiée, on peut faire un fetch vers un endpoint logout qui clear le cookie.
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push("/commercial/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-slate-800">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span className="bg-blue-600 text-white p-1.5 rounded-lg text-sm">CRM</span>
                        Gainable.fr
                    </h2>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== "/commercial" && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                    isActive 
                                    ? "bg-blue-600 text-white" 
                                    : "hover:bg-slate-800 hover:text-white"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl transition-colors hover:bg-slate-800 text-red-400 hover:text-red-300"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
