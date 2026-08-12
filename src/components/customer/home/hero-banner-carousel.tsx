import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BannerItem = {
  _id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
};

type HeroBannerProps = {
  banners?: BannerItem[];
};

export function HeroBannerCarousel({ banners = [] }: HeroBannerProps) {
  const mainBanner = banners[0];

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition-all">
      <div className="grid lg:grid-cols-2 items-center min-h-[380px] lg:min-h-[440px]">
        {/* Left Side: Clean Typography */}
        <div className="p-8 sm:p-12 lg:p-14 space-y-4">
          <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            New Arrival
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
            {mainBanner?.title || "Discover Modern Everyday Essentials"}
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg">
            {mainBanner?.subtitle || "Explore top quality clothing, footwear, and accessories with fast checkout and easy returns."}
          </p>
          <div className="pt-2">
            <Link to="/collections">
              <Button className="h-11 rounded-xl px-6 text-sm font-semibold shadow-sm gap-2">
                <ShoppingBag className="h-4 w-4" />
                <span>Shop Collection</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Clean Featured Banner Image */}
        <div className="h-[300px] sm:h-[380px] lg:h-full w-full overflow-hidden bg-muted">
          <img
            src={
              mainBanner?.imageUrl ||
              "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80"
            }
            alt="Hero Banner"
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}
