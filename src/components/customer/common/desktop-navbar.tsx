import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@clerk/react";
import {
  Heart,
  LogIn,
  LogOut,
  Search,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Store,
  User,
  type LucideIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CustomerMobileNavbar } from "./mobile-navbar";
import { useAuthStore } from "@/features/auth/store";
import { useCustomerWishlistStore } from "@/features/customer/wishlist/store";
import { useEffect, useState } from "react";
import CustomerWishlistDialog from "../wishlist/customer-wishlist-dialog";
import { useCustomerProfileStore } from "@/features/customer/profile/store";
import CustomerProfileDialog from "../profile/customer-profile-dialog";
import { useCustomerCartAndCheckoutStore } from "@/features/customer/cart-and-checkout/store";
import CustomerCartAndCheckoutDrawer from "../cart-and-checkout/customer-cart-and-checkout-drawer";
import { useCustomerOrdersStore } from "@/features/customer/orders/store";
import CustomerOrdersDialog from "../orders/customer-orders-dialog";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const collectionsPage: NavItem = {
  label: "Collections",
  href: "/collections",
  icon: ShoppingBag,
};

const shell =
  "mx-auto flex h-[72px] max-w-[1600px] items-center gap-3 px-4 sm:px-6 lg:px-8";

const headerClass =
  "sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl shadow-xs";

const textLink =
  "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-[15px] font-medium text-foreground/90 transition hover:bg-muted hover:text-foreground";

const iconLink =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-xl text-foreground/90 transition hover:bg-muted hover:text-foreground";

const brandWrap = "flex shrink-0 items-center gap-3";

const brandTitle =
  "text-[23px] font-bold tracking-tight text-foreground";

const desktopCollectionsWrap = "ml-4 hidden lg:block";

const desktopNav = "ml-auto hidden items-center gap-2 lg:flex";

const dropdownButton =
  "h-10 rounded-xl px-3 text-[15px] font-medium text-foreground/90 hover:bg-white/5 hover:text-foreground cursor-pointer";

const dropdownContent =
  "mt-3 rounded-2xl border-border bg-popover/95 p-2 backdrop-blur";

const accountDropdownContent = `${dropdownContent} w-56`;

const dropdownItemLink =
  "flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5";

const cartBadge =
  "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";

const wishlistBadge =
  "absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-amber-400 px-1.5 text-[11px] font-semibold leading-5 text-black";

function NavTextLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <Link to={href} className={textLink}>
      <Icon className="h-[18px] w-[18px]" />
      <span>{label}</span>
    </Link>
  );
}

export function CustomerNavbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { isSignedIn, signOut, isLoaded } = useAuth();
  const { isBootstrapped } = useAuthStore();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collections?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const {
    items: wishlistItems,
    loadWishlist,
    clear: clearWishlist,
    setOpen: setWishlistOpen,
  } = useCustomerWishlistStore((state) => state);

  const { openProfile, clear: clearProfile } = useCustomerProfileStore(
    (state) => state,
  );

  const { setOpen, cart, loadCart } = useCustomerCartAndCheckoutStore(
    (state) => state,
  );

  const { openOrders } = useCustomerOrdersStore((state) => state);

  useEffect(() => {
    if (!isLoaded || !isBootstrapped) return;

    void loadCart(Boolean(isSignedIn));

    if (!isSignedIn) {
      clearWishlist();
      clearProfile();
      return;
    }

    void loadWishlist();
  }, [
    clearWishlist,
    isBootstrapped,
    clearProfile,
    isSignedIn,
    isLoaded,
    loadWishlist,
    loadCart,
  ]);

  const showSignInUi = isLoaded && isBootstrapped && isSignedIn;
  const wishlistCount = wishlistItems.length;

  return (
    <header className={headerClass}>
      <div className={shell}>
        <Link to={"/"} className={brandWrap}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Store className="h-6 w-6" />
          </div>
          <span className={brandTitle}>StoreHub</span>
        </Link>

        <div className={desktopCollectionsWrap}>
          <NavTextLink
            href={collectionsPage.href}
            label={collectionsPage.label}
            icon={collectionsPage.icon}
          />
        </div>

        {/* Quick Search Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative hidden md:flex items-center max-w-xs flex-1 ml-4"
        >
          <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-xl border border-border/80 bg-muted/40 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </form>

        <nav className={desktopNav}>
          {showSignInUi ? (
            <button
              type="button"
              className={iconLink}
              onClick={() => setWishlistOpen(true)}
            >
              <Heart className="w-[20px] h-[20px]" />
              <span className={wishlistBadge}>{wishlistCount}</span>
            </button>
          ) : null}

          {isSignedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} className={dropdownButton}>
                  <User className="h-4.5 w-4.5" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className={accountDropdownContent}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => void openProfile()}
                    className={dropdownItemLink}
                  >
                    <User className="h-4 w-4" />
                    <span>My Account</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => void openOrders()}
                    className={dropdownItemLink}
                  >
                    <ShoppingBasket className="h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className={dropdownItemLink}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <NavTextLink href="/sign-in" label="Login" icon={LogIn} />
          )}

          <button type="button" onClick={() => setOpen(true)} className={`${iconLink} cursor-pointer`}>
            <ShoppingCart className="h-4.5 w-4.5" />
            <span className={cartBadge}>{cart?.items?.length || 0}</span>
          </button>
        </nav>

        <CustomerMobileNavbar isSignedIn={!!isSignedIn} />

        {showSignInUi ? <CustomerWishlistDialog /> : null}
        {showSignInUi ? <CustomerProfileDialog /> : null}
        {showSignInUi ? <CustomerOrdersDialog /> : null}
        <CustomerCartAndCheckoutDrawer />
      </div>
    </header>
  );
}
