import { useState } from "react";
import { Link } from "react-router-dom";
import { Store, Send, ShieldCheck, Truck, RefreshCw, Headset, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CustomerFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <footer className="mt-20 border-t border-border/60 bg-gradient-to-b from-background via-muted/30 to-muted/60 pt-16 pb-8">
      {/* Feature Badges Banner */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 rounded-3xl border border-border/50 bg-card/60 backdrop-blur p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">Free Global Shipping</h4>
              <p className="text-xs text-muted-foreground mt-0.5">On all orders over $99</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Encrypted payment gateway</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <RefreshCw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">30-Day Easy Returns</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Headset className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm">24/7 Dedicated Support</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Always here to help you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-border/50">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <Store className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">StoreHub</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Discover curated luxury lifestyle, high-tech gadgets, and modern apparel. Elevate your everyday wardrobe with top quality items.
            </p>
            
            {/* Newsletter Form */}
            <div className="pt-2 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                Subscribe to our newsletter
              </p>
              {subscribed ? (
                <p className="text-xs text-emerald-500 font-medium">✓ You're subscribed! Check your inbox for 15% off.</p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2 max-w-sm">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-xl bg-background/80 text-sm"
                  />
                  <Button type="submit" className="rounded-xl px-4 shrink-0 gap-2">
                    <Send className="h-4 w-4" />
                    <span>Join</span>
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Shop</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link to="/collections" className="hover:text-primary transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link to="/collections?sort=recent" className="hover:text-primary transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections?sort=price-low" className="hover:text-primary transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Promotions & Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Support</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Track Your Order</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Returns & Exchanges</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Shipping & Delivery</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">FAQs & Help Center</span>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-foreground">Company</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">About StoreHub</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Sustainability</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and social */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} StoreHub, Inc. Crafted with  for shoppers everywhere.
          </p>

          <div className="flex items-center gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
