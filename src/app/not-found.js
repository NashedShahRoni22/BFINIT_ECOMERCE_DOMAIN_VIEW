"use client";

import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function NotFound() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleNavigate = (path) => {
    window.location.href = path;
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-lg text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-primary text-9xl font-bold">404</h1>
          <div className="bg-primary mx-auto mt-2 h-1 w-24 rounded-full"></div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-foreground mb-3 text-2xl font-semibold">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-sm">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. It
            might have been moved, deleted, or the URL might be incorrect.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={handleGoBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => handleNavigate("/")}
            variant="secondary"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>

          <Button
            onClick={() => handleNavigate("/search")}
            variant="outline"
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Optional: Popular Links */}
        <div className="mt-12">
          <Separator className="mb-8" />
          <p className="text-muted-foreground mb-4 text-xs">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Shop", "About", "Contact", "FAQ"].map((link) => (
              <Button
                key={link}
                onClick={() => handleNavigate(`/${link.toLowerCase()}`)}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {link}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
