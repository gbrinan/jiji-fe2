"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, MessageCircle, HelpCircle, User } from "lucide-react";

const tabs = [
  { href: "/home", label: "홈", icon: Home, match: "/home" },
  { href: "/survey/mrs", label: "진단", icon: ClipboardList, match: "/survey" },
  { href: "/chat", label: "채팅", icon: MessageCircle, match: "/chat" },
  { href: "/faq", label: "FAQ", icon: HelpCircle, match: "/faq" },
  { href: "/profile", label: "프로필", icon: User, match: "/profile" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/90 backdrop-blur-sm border-t border-gray-100 z-50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.match);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-2.5 min-w-[64px] transition-colors ${
                active ? "text-primary-500" : "text-gray-400"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
