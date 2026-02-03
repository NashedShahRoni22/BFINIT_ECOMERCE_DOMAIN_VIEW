"use client";
import { useEffect, useState } from "react";
import { Search, ShoppingCart, User, Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";
import MobileNav from "./MobileNav";
import SearchOverlay from "./SearchOverlay";
import useStoreId from "@/hooks/useStoreId";
import { useQuery } from "@tanstack/react-query";

const fetchStorePreference = async (storeId) => {
  const response = await fetch(
    `https://ecomback.bfinit.com/store/preference/?storeId=${storeId}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function NavbarSimple({ content }) {
  const { customer, handleLogout } = useAuth();
  const { totalItems } = useCart();

  const { storeId } = useStoreId();

  const { data } = useQuery({
    queryFn: () => fetchStorePreference(storeId),
    queryKey: ["storePreference", storeId],
    enabled: !!storeId,
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu or search is open
  useEffect(() => {
    if (mobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen, searchOpen]);

  return (
    <>
      <nav className="bg-background border-border sticky top-0 z-50 border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Mobile: Hamburger Menu (Left) */}
            <div className="flex lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu size={20} />
              </Button>
            </div>

            {/* Logo - Centered on mobile, left on desktop */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <Link href="/" className="text-xl font-bold sm:text-2xl">
                {data?.storeName}
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden flex-1 justify-center lg:flex lg:items-center lg:space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="hover:text-primary text-sm font-medium transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-1">
              {/* Search - Icon only on mobile, expandable on desktop */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="h-9 w-9"
              >
                <Search size={18} />
              </Button>

              {/* Account Popover */}
              <Popover
                open={accountDropdownOpen}
                onOpenChange={setAccountDropdownOpen}
              >
                <PopoverTrigger asChild className="hidden lg:flex">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Account"
                    className="h-9 w-9"
                  >
                    <User size={18} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  {customer ? (
                    <>
                      <div className="px-2 py-2">
                        <p className="text-sm font-medium">
                          {customer.data.name}
                        </p>
                        <p className="text-muted-foreground truncate text-xs">
                          {customer.data.email}
                        </p>
                      </div>
                      <Separator className="my-2" />
                      <Link
                        href="/orders"
                        className="hover:bg-accent block rounded-sm px-2 py-2 text-sm transition-colors"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Orders
                      </Link>
                      <Separator className="my-2" />
                      <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="h-auto w-full justify-start px-2 py-2 text-sm font-normal"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="hover:bg-accent block rounded-sm px-2 py-2 text-sm transition-colors"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/signup"
                        className="hover:bg-accent block rounded-sm px-2 py-2 text-sm transition-colors"
                        onClick={() => setAccountDropdownOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </PopoverContent>
              </Popover>

              {/* Cart with Badge */}
              <Button
                variant="ghost"
                size="icon"
                asChild
                className="relative h-9 w-9"
              >
                <Link href="/cart" aria-label="Shopping cart">
                  <ShoppingCart size={18} />
                  {totalItems > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs"
                    >
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <MobileNav
          data={data}
          content={content}
          navLinks={navLinks}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      {/* Full-Screen Search Overlay */}
      {searchOpen && <SearchOverlay setSearchOpen={setSearchOpen} />}
    </>
  );
}
