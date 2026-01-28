"use client";

export default function ThemeErrorScreen({ storeId, error }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  const handleClearCache = () => {
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
            className="text-orange-500"
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
              d="M30 45L40 35L50 45M40 35V55"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="28" r="2" fill="currentColor" />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-foreground mb-3 text-2xl font-bold">
          Store Configuration Error
        </h1>
        <p className="text-muted-foreground mb-6">
          Unable to load your store's theme. This may be a temporary issue or a
          configuration problem.
        </p>

        {/* Store ID Info */}
        <div className="bg-muted mb-6 rounded-lg p-4">
          <p className="text-muted-foreground mb-1 text-sm">Store ID:</p>
          <p className="text-foreground font-mono text-sm font-medium">
            {storeId}
          </p>
        </div>

        {/* Error Details */}
        {error && (
          <div className="mb-6 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-900 dark:bg-orange-950/20">
            <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
              {error}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={handleRefresh}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-6 py-2.5 font-medium transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={handleClearCache}
            className="border-border text-foreground hover:bg-accent rounded-md border px-6 py-2.5 font-medium transition-colors"
          >
            Clear Cache
          </button>
        </div>

        {/* Help Text */}
        <p className="text-muted-foreground mt-8 text-xs">
          If the problem persists, please contact support with your Store ID.
        </p>
      </div>
    </div>
  );
}
