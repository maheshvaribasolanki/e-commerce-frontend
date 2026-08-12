import { useState } from "react";
import { Outlet } from "react-router-dom";
import { AdminSidebar, SidebarNav } from "../admin/common/sidebar";
import { UserButton } from "@clerk/react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Store } from "lucide-react";

export function AdminLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/45">
      <div className="flex min-h-screen">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur lg:px-6">
            <div className="lg:hidden">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Admin Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] p-0">
                  <SheetHeader className="border-b border-border px-5 py-4 text-left">
                    <SheetTitle className="flex items-center gap-3">
                      <Store className="h-7 w-7 text-primary" />
                      <span className="text-xl font-semibold">E-Shopify</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <SidebarNav onSelect={() => setOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <UserButton />
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
