import {
  BadgePercent,
  BarChart3,
  LayoutDashboard,
  Package,
  Settings2,
  Store,
  type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const items: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Coupons", href: "/admin/coupons", icon: BadgePercent },
  { label: "Users", href: "/admin/users", icon: BarChart3 },
  { label: "Orders", href: "/admin/orders", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings2 },
];

const sidebarRoot =
  "hidden w-[300px] shrink-0 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col";

const brandRow =
  "flex h-[72px] items-center border-b border-sidebar-border px-5";
const navWrap = "space-y-2";
const navItemBase =
  "flex h-11 items-center gap-3 px-4 text-[15px] font-medium transition-colors";

const navItemDesktop = `${navItemBase} rounded-none`;
const navItemMobile = navItemBase;

const activeItem = "bg-sidebar-primary text-sidebar-primary-foreground";
const idleItem =
  "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";

export function SidebarNav({ onSelect }: { onSelect?: () => void }) {
  return (
    <nav className={navWrap}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.label}
            to={item.href}
            end={item.href === "/admin"}
            onClick={onSelect}
            className={({ isActive }) =>
              `${navItemDesktop} ${isActive ? activeItem : idleItem}`
            }
          >
            <Icon className="h-[18px] w-[18px]" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export function AdminSidebar() {
  return (
    <aside className={sidebarRoot}>
      <div className={brandRow}>
          <div className="flex items-center gap-3">
          <Store className="w-10 h-10" />
          <span className="text-[25px] font-semibold text-foreground">
            StoreHub
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>
    </aside>
  );
}
