"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  ChevronDown,
} from "lucide-react";
import useCart from "@/hooks/useCart";

export default function NavbarSimple({ content }) {
  const { totalItems } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-background border-border sticky top-0 z-50 border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="hover:bg-accent rounded-md p-2 lg:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

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
                href={link.href}
                className="hover:text-primary flex items-center gap-1 text-sm font-medium transition-colors duration-200"
              >
                {link.name}
                {link.hasDropdown && <ChevronDown size={16} />}
              </Link>
            ))}
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              {searchOpen ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Search products..."
                    autoFocus
                    className="border-input bg-background focus:ring-ring w-48 rounded-lg border px-4 py-2 pr-10 text-sm focus:ring-2 focus:outline-none sm:w-64"
                  />
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="hover:bg-accent absolute right-2 rounded-md p-1"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="hover:bg-accent rounded-md p-2 transition-colors"
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>
              )}
            </div>

            {/* Wishlist - Desktop only */}
            {/* <button
              className="hover:bg-accent  hidden rounded-md p-2 transition-colors sm:block"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </button> */}

            {/* Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                className="hover:bg-accent rounded-md p-2 transition-colors"
                aria-label="Account"
              >
                <User size={20} />
              </button>

              {accountDropdownOpen && (
                <div className="bg-popover border-border absolute right-0 z-50 mt-2 w-48 rounded-lg border py-2 shadow-lg">
                  <Link
                    href="/login"
                    className="text-popover-foreground hover:bg-accent block px-4 py-2 text-sm transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-popover-foreground hover:bg-accent block px-4 py-2 text-sm transition-colors"
                  >
                    Create Account
                  </Link>
                  {/* <hr className="border-border my-2" />
                  <a
                    href="#"
                    className="text-popover-foreground hover:bg-accent block px-4 py-2 text-sm transition-colors"
                  >
                    Orders
                  </a>
                  <a
                    href="#"
                    className="text-popover-foreground hover:bg-accent block px-4 py-2 text-sm transition-colors"
                  >
                    Wishlist
                  </a>
                  <a
                    href="#"
                    className="text-popover-foreground hover:bg-accent block px-4 py-2 text-sm transition-colors"
                  >
                    Settings
                  </a> */}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="hover:bg-accent relative rounded-md p-2 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="bg-destructive text-destructive-foreground absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-border bg-background border-t lg:hidden">
          <div className="space-y-3 px-4 pt-4 pb-6">
            {navigationLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="hover:bg-accent block rounded-md px-3 py-2 text-base font-medium transition-colors"
              >
                {link.name}
              </a>
            ))}

            {/* Mobile-only links */}
            <hr className="border-border my-4" />
            <a
              href="#"
              className="hover:bg-accent block rounded-md px-3 py-2 text-base font-medium transition-colors"
            >
              Wishlist
            </a>
            <a
              href="#"
              className="hover:bg-accent block rounded-md px-3 py-2 text-base font-medium transition-colors"
            >
              My Orders
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
