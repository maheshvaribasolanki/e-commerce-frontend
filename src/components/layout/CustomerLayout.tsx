import { Outlet } from "react-router-dom";
import { CustomerNavbar } from "../customer/common/desktop-navbar";
import { CustomerFooter } from "../customer/common/footer";

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* navbar */}
      <CustomerNavbar />
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8">
        <Outlet />
      </main>
      <CustomerFooter />
    </div>
  );
}
