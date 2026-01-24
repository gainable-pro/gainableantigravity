"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    UserCircle,
    Activity,
    Building2,
    Image as ImageIcon,
    CreditCard,
    Search,
    LogOut,
    FileText,
    Inbox,
    Shield,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet";
import { useState, useEffect } from "react";

const sidebarItems = [
    { label: "Mon Profil", icon: UserCircle, href: "/dashboard" },
    { label: "Demandes / Leads", icon: Inbox, href: "/dashboard/leads" },
    { label: "Mes Médias", icon: ImageIcon, href: "/dashboard/media" },
    { label: "Articles SEO", icon: FileText, href: "/dashboard/articles" },
    { label: "Factures", icon: CreditCard, href: "/dashboard/factures" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetch('/api/dashboard/profile')
            .then(res => res.json())
            .then(data => {
                if (data?.user?.role === 'admin') {
                    setIsAdmin(true);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const NavigationContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b border-slate-100">
                <h1 className="text-xl font-bold text-[#1F2D3D]">Espace Pro</h1>
                <p className="text-xs text-slate-500 mt-1">Gérez votre visibilité</p>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                {isAdmin && (
                    <Link href="/admin" onClick={() => setOpen(false)}>
                        <span className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors mb-4">
                            <Shield className="w-4 h-4" />
                            Administration
                        </span>
                    </Link>
                )}
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                            <span className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                                ? "bg-[#1F2D3D]/5 text-[#1F2D3D]"
                                : "text-slate-600 hover:bg-slate-50 hover:text-[#1F2D3D]"
                                }`}>
                                <item.icon className={`w-4 h-4 ${isActive ? "text-[#D59B2B]" : "text-slate-400"}`} />
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Mobile Header */}
            <div className="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-[#1F2D3D]">Espace Pro</h1>
                </div>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6 text-[#1F2D3D]" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-[300px]">
                        <NavigationContent />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-1">
                {/* Desktop Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full sticky top-0">
                    <NavigationContent />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
