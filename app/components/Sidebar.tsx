"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    BarChart3,
    LogOut,
    Cloud,
    Menu,
    X,
    ChevronRight,
    ChevronLeft,
    ClipboardList,
    Table,
    Database
} from "lucide-react";
import { useState, useEffect } from "react";
import { logout } from "@/app/actions/auth";

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    const handleOverlayClick = () => setIsOpen(false);

    const menuItems = [
        { name: "Grafik", icon: BarChart3, path: "/grafik" },
        { name: "Tabulasi", icon: ClipboardList, path: "/tabulasi" },
        { name: "Aktivitas", icon: Table, path: "/activity" },
        { name: "Aktivitas (All)", icon: Database, path: "/all-activity" },
    ];

    const NavButton = ({ item }: { item: { name: string; icon: any; path: string } }) => {
        const active = pathname === item.path;
        return (
            <Link
                href={item.path}
                title={collapsed ? item.name : undefined}
                className={`group w-full flex items-center gap-3 rounded-xl transition-all duration-200 text-left ${collapsed ? 'px-0 py-2.5 justify-center' : 'px-3.5 py-2.5'
                    } ${active
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 cursor-pointer'
                        : 'text-blue-900/60 hover:bg-blue-50/80 hover:text-blue-700 cursor-pointer'
                    }`}
            >
                <item.icon className={`h-[18px] w-[18px] flex-shrink-0 transition-transform duration-200 ${active ? 'text-white' : 'group-hover:scale-110'}`} />
                {!collapsed && <span className="text-[13px] font-semibold tracking-tight flex-1">{item.name}</span>}
                {!collapsed && active && <ChevronRight className="h-3.5 w-3.5 text-white/60" />}
            </Link>
        );
    };

    const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
        const isCollapsed = isMobile ? false : collapsed;

        return (
            <div className="flex flex-col h-full overflow-hidden">
                {/* Brand */}
                <div className={`flex items-center border-b border-blue-100/80 ${isCollapsed ? 'px-2 py-5 justify-center' : 'px-5 py-5 gap-3'}`}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-md"></div>
                        <div className="relative p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-lg shadow-blue-600/30 flex-shrink-0">
                            <Cloud className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-base font-bold tracking-tight text-blue-950 uppercase leading-none">Drive Monitor</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className={`flex-1 overflow-y-auto py-4 space-y-5 min-h-0 ${isCollapsed ? 'px-1.5' : 'px-3'}`}>
                    {menuItems.length > 0 && (
                        <div className="space-y-1">
                            {!isCollapsed && <label className="px-3 text-[9px] font-bold text-blue-800/30 uppercase tracking-[0.2em]">Menu Utama</label>}
                            <div className="space-y-0.5 mt-1.5">
                                {menuItems.map((item) => <NavButton key={item.path} item={item} />)}
                            </div>
                        </div>
                    )}
                </nav>

                {/* Logout */}
                <div className={`border-t border-blue-100/80 ${isCollapsed ? 'p-1.5' : 'p-3'}`}>
                    <form action={logout}>
                        <button
                            type="submit"
                            title={isCollapsed ? 'Logout' : undefined}
                            className={`w-full flex items-center gap-3 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group cursor-pointer ${isCollapsed ? 'px-0 py-2.5 justify-center' : 'px-3.5 py-2.5'
                                }`}
                        >
                            <LogOut className="h-[18px] w-[18px] group-hover:scale-110 group-hover:-translate-x-0.5 transition-all flex-shrink-0" />
                            {!isCollapsed && <span className="text-[13px] font-semibold tracking-tight">Logout</span>}
                        </button>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className={`hidden md:flex sticky top-0 h-[100dvh] bg-white/95 backdrop-blur-xl border-r border-blue-100/80 flex-col z-[100] shadow-xl shadow-blue-900/5 transition-all duration-300 ${collapsed ? 'w-[60px] min-w-[60px]' : 'w-64 min-w-[16rem]'
                }`}>
                <SidebarContent />

                {/* Toggle button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-white border border-blue-200 shadow-md flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:scale-110 transition-all z-[110] cursor-pointer"
                    title={collapsed ? "Perluas sidebar" : "Perkecil sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="h-3.5 w-3.5" />
                    ) : (
                        <ChevronLeft className="h-3.5 w-3.5" />
                    )}
                </button>
            </aside>

            {/* MOBILE: Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-4 left-4 z-[200] p-2.5 bg-white/90 backdrop-blur-lg border border-blue-200/60 rounded-xl shadow-lg shadow-blue-900/10 text-blue-600 hover:bg-blue-50 transition-all active:scale-95 outline-none cursor-pointer"
                aria-label="Buka menu"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* MOBILE: Overlay backdrop */}
            {isOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[150] animate-fade-in"
                    onClick={handleOverlayClick}
                />
            )}

            {/* MOBILE: Slide-in Sidebar */}
            <aside
                className={`md:hidden fixed left-0 top-0 h-[100dvh] w-72 bg-white z-[200] shadow-2xl transform transition-transform duration-200 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all z-10 outline-none cursor-pointer"
                    aria-label="Tutup menu"
                >
                    <X className="h-5 w-5" />
                </button>

                <SidebarContent isMobile={true} />
            </aside>
        </>
    );
}
