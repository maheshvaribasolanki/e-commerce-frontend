import { Commonloader } from "@/components/common/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminDashboardLiteStore } from "@/features/admin/dashboard/store";
import { formatPrice } from "@/lib/utils";
import {
  Boxes,
  IndianRupee,
  Layers3,
  PackageCheck,
  RotateCcw,
} from "lucide-react";
import { useEffect } from "react";

const statsItems = [
  {
    key: "totalProducts",
    label: "Total products",
    icon: Boxes,
  },
  {
    key: "totalCategories",
    label: "Total categories",
    icon: Layers3,
  },
  {
    key: "totalSales",
    label: "Total sales",
    icon: IndianRupee,
  },
  {
    key: "totalOrders",
    label: "Total orders",
    icon: PackageCheck,
  },
  {
    key: "totalReturnedOrders",
    label: "Returned orders",
    icon: RotateCcw,
  },
] as const;

const pageWrapClass = "min-h-screen bg-background/50";
const contentWrapClass = "mx-auto max-w-7xl px-4 py-8 space-y-8";
const headerCardClass = "rounded-3xl border border-border/60 bg-card/80 shadow-xs backdrop-blur p-6";
const titleClass = "text-3xl font-bold tracking-tight text-foreground";
const subtitleClass = "text-sm text-muted-foreground mt-1";

const gridClass = "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";
const statCardClass = "group relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-1 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg";
const statContentClass = "flex items-center gap-5 p-6 rounded-[1.4rem] bg-gradient-to-br from-background/40 to-muted/20";
const iconWrapClass =
  "flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform group-hover:scale-110";
const iconClass = "h-7 w-7 text-primary";
const statLabelClass = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
const statValueClass = "mt-1 text-3xl font-bold tracking-tight text-foreground";

function AdminDashboard() {
  const { loading, fetchDashboard, stats, hasLoaded } =
    useAdminDashboardLiteStore((state) => state);

  useEffect(() => {
    if (!hasLoaded) {
      void fetchDashboard();
    }
  }, [fetchDashboard, hasLoaded]);

  return (
    <div className={pageWrapClass}>
      <div className={contentWrapClass}>
        <div className={headerCardClass}>
          <h1 className={titleClass}>Admin Dashboard</h1>
          <p className={subtitleClass}>Overview of store performance, products, orders, and sales metrics.</p>
        </div>

        {loading ? (
          <Commonloader />
        ) : (
          <div className={gridClass}>
            {statsItems.map((item) => {
              const Icon = item.icon;
              const value = stats[item.key];
              return (
                <Card key={item.key} className={statCardClass}>
                  <CardContent className={statContentClass}>
                    <div className={iconWrapClass}>
                      <Icon className={iconClass} />
                    </div>
                    <div>
                      <p className={statLabelClass}>{item.label}</p>
                      <p className={statValueClass}>
                        {item.key === "totalSales" ? formatPrice(value) : value}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
