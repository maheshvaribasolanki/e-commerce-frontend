import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Heart,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  ShoppingCart,
  Store,
  User,
  Search,
  Home,
  Flame,
  ChevronRight,
  ShoppingBasket,
  HelpCircle,
  Globe,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import { useAuth } from "@clerk/react";

type CustomerMobileNavbarProps = {
  isSignedIn: boolean;
};

export function CustomerMobileNavbar({ isSignedIn }: CustomerMobileNavbarProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const { setOpen: setCartOpen, cart } = useCustomerCartAndCheckoutStore((state) => state);
  const { items: wishlistItems, setOpen: setWishlistOpen } = useCustomerWishlistStore((state) => state);
  const { openProfile } = useCustomerProfileStore((state) => state);
  const { openOrders } = useCustomerOrdersStore((state) => state);
  const { signOut } = useAuth();

  const cartCount = cart?.items?.length || 0;
  const wishlistCount = wishlistItems.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setOpen(false);
    navigate(`/collections?search=${encodeURIComponent(searchTerm.trim())}`);
    setSearchTerm("");
  };

  return (
    <div className="flex items-center gap-2 lg:hidden">
      {/* Mobile Cart Button */}
      <button
        type="button"
        onClick={() => setCartOpen(true)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-card text-foreground transition-all hover:bg-muted cursor-pointer"
        title="Open Cart"
      >
        <ShoppingCart className="h-5 w-5 text-foreground" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm">
            {cartCount}
          </span>
        )}
      </button>

      {/* Hamburger Sheet Trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/60 bg-card hover:bg-muted cursor-pointer">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-[340px] max-w-[88vw] p-0 border-r border-border/60 bg-background flex flex-col justify-between">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Brand Header */}
            <div className="p-5 border-b border-border/50 bg-muted/20">
              <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
                <Store className="h-10 w-10 text-foreground" />
                <div className="flex flex-col">
                  <span className="text-[25px] font-semibold tracking-[-0.02em] text-foreground">StoreHub</span>
                  <span className="text-[10px] font-semibold text-primary uppercase">Mobile Navigation</span>
                </div>
              </Link>
            </div>

            {/* Mobile Search Bar */}
            <div className="p-4">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search store..."
                  className="w-full rounded-xl border border-border/60 bg-muted/30 pl-9 pr-4 py-2.5 text-xs font-medium outline-none focus:border-primary"
                />
              </form>
            </div>

            <Separator className="my-1" />

            {/* Navigation Section */}
            <div className="p-4 space-y-1">
              <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Menu</p>
              
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-primary" />
                  <span>Home</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                to="/collections"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <span>All Collections</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </Link>

              <Link
                to="/collections?filter=deals"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                <div className="flex items-center gap-3">
                  <Flame className="h-4 w-4 text-amber-500" />
                  <span>Hot Deals & Offers</span>
                </div>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-600">SALE</span>
              </Link>
            </div>

            <Separator className="my-1" />

            {/* Account Actions */}
            <div className="p-4 space-y-1">
              <p className="px-2 pb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">User Services</p>

              {isSignedIn ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      setWishlistOpen(true);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Heart className="h-4 w-4 text-rose-500" />
                      <span>My Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      void openOrders();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBasket className="h-4 w-4 text-primary" />
                      <span>My Orders</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      void openProfile();
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-primary" />
                      <span>My Profile</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      signOut();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 mt-2 cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/sign-in"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In / Register</span>
                </Link>
              )}
            </div>
          </div>

          {/* Footer Currency / Help */}
          <div className="p-4 border-t border-border/50 bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5" /> USD ($)
            </span>
            <span className="flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" /> Support 24/7
            </span>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
