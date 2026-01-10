"use client";

import { useState } from "react";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import useCart from "@/hooks/useCart";
import useAuth from "@/hooks/useAuth";
import Link from "next/link";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function NavbarSimple({ content }) {
  const { customer, handleLogout } = useAuth();
  const { totalItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  return (
    <nav className="bg-background border-border sticky top-0 z-50 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link href="/" className="text-2xl font-bold">
              {content.logoText}
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden flex-1 justify-center lg:flex lg:items-center lg:space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                href={`${link.href}`}
                className="hover:text-primary flex items-center gap-1 text-sm font-medium transition-colors duration-200"
              >
                {link.name}
                {link.hasDropdown && <ChevronDown size={16} />}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    autoFocus
                    className="h-9 w-48 text-sm sm:w-64"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchOpen(false)}
                    className="h-9 w-9"
                  >
                    <X size={18} />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search"
                >
                  <Search size={20} />
                </Button>
              )}
            </div>

            {/* Account Popover */}
            <Popover
              open={accountDropdownOpen}
              onOpenChange={setAccountDropdownOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48 p-2" align="end">
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
                      href="/account"
                      className="hover:bg-accent block rounded-sm px-2 py-2 text-sm transition-colors"
                      onClick={() => setAccountDropdownOpen(false)}
                    >
                      My Account
                    </Link>
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

            {/* Cart */}
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full px-1 text-xs"
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
  );
}
