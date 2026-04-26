"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle, Inbox, ImageIcon, FileText, PlusCircle } from "lucide-react";

export function MobileBottomNav() {
    const pathname = usePathname();

    const navItems = [
        { label: "Profil", icon: UserCircle, href: "/dashboard" },
        { label: "Leads", icon: Inbox, href: "/dashboard/leads" },
        // Middle button reserved for quick action (FAB-like)
        { label: "Nouveau", icon: PlusCircle, href: "/dashboard/articles/new", isMain: true },
        { label: "Articles", icon: FileText, href: "/dashboard/articles" },
        { label: "Médias", icon: ImageIcon, href: "/dashboard/media" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 pb-safe">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item, idx) => {
                    // For the main action button
                    if (item.isMain) {
                        return (
                            <Link key={idx} href={item.href} className="flex flex-col items-center justify-center -mt-6">
                                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-slate-50">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-bold text-blue-600 mt-1">{item.label}</span>
                            </Link>
                        );
                    }

                    // For regular items
                    const isActive = pathname === item.href;
                    return (
                        <Link key={idx} href={item.href} className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? "text-[#D59B2B]" : "text-slate-500"}`}>
                            <item.icon className={`w-6 h-6 ${isActive ? "fill-[#D59B2B]/20" : ""}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
