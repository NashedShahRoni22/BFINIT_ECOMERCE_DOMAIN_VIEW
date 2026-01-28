"use client";

export default function DomainErrorScreen({ domain, error }) {
  const handleRefresh = () => {
    localStorage.removeItem("storeId");
    localStorage.removeItem("storeDomain");
    window.location.reload();
  };

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6 flex justify-center">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="text-destructive"
          >
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M40 25V45M40 55V55.1"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-foreground mb-3 text-2xl font-bold">
          Domain Not Recognized
        </h1>
        <p className="text-muted-foreground mb-6">
          This domain is not registered in our system. Please verify your DNS
          configuration or contact support.
        </p>

        {/* Domain Info */}
        <div className="bg-muted mb-6 rounded-lg p-4">
          <p className="text-muted-foreground mb-1 text-sm">Current Domain:</p>
          <p className="text-foreground font-mono text-sm font-medium break-all">
            {domain || "Unable to detect domain"}
          </p>
        </div>

        {/* Error Details */}
        {error && (
          <div className="bg-destructive/10 border-destructive/20 mb-6 rounded-lg border p-3">
            <p className="text-destructive text-xs font-medium">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleRefresh}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2.5 font-medium transition-colors"
          >
            Refresh Page
          </button>
          <a
            href="mailto:support@yourcompany.com"
            className="border-border text-foreground hover:bg-accent rounded-md border px-6 py-2.5 font-medium transition-colors"
          >
            Contact Support
          </a>
        </div>

        {/* Help Text */}
        <p className="text-muted-foreground mt-8 text-xs">
          If you&apos;re the store owner, ensure your domain is properly
          configured in your store settings.
        </p>
      </div>
    </div>
  );
}
