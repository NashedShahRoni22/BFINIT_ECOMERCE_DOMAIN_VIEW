import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

export default function MobileNav({ content, navLinks, setMobileMenuOpen }) {
  const { customer, handleLogout } = useAuth();

  return (
    <>
      {/* Backdrop */}
      <div
        className="bg-background/80 fixed inset-0 z-50 backdrop-blur-sm lg:hidden"
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Drawer */}
      <div className="bg-background border-border fixed inset-y-0 left-0 z-50 w-64 border-r shadow-lg lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <span className="text-lg font-bold">{content.logoText}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </Button>
        </div>

        <Separator />

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:bg-accent rounded-md px-3 py-2 text-sm font-medium transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <Separator />

        {/* User Section */}
        <div className="p-4">
          {customer ? (
            <>
              <div className="bg-muted mb-3 rounded-md p-3">
                <p className="text-sm font-medium">{customer.data.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {customer.data.email}
                </p>
              </div>
              <Link
                href="/orders"
                className="hover:bg-accent mb-2 block rounded-md px-3 py-2 text-sm font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start text-sm"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <div className="flex flex-col gap-2">
              <Button variant="default" asChild className="w-full">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  Sign In
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  Create Account
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
