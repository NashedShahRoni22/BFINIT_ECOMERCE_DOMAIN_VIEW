export default function StorefrontLoader({ canvasHeight }) {
  return (
    <div
      className={`bg-background flex ${canvasHeight ? "h-[calc(100dvh-79px)]" : "min-h-dvh"} items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated Circle with Store Icon */}
        <div className="relative">
          <svg
            width="80"
            height="80"
            viewBox="0 0 80 80"
            fill="none"
            className="transform"
          >
            {/* Background circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="2"
              className="text-border"
              fill="none"
            />

            {/* Animated progress circle */}
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="226.195"
              strokeDashoffset="226.195"
              style={{
                animation:
                  "fillCircle 2s cubic-bezier(0.4, 0, 0.2, 1) infinite",
                transformOrigin: "center",
                transform: "rotate(-90deg)",
              }}
            />

            {/* Store icon in center */}
            <g transform="translate(40, 40)">
              {/* Simple storefront icon */}
              <path
                d="M-12 -8 L-12 -2 L-10 0 L10 0 L12 -2 L12 -8 Z M-10 2 L-10 10 L10 10 L10 2"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
              {/* Door */}
              <rect
                x="-3"
                y="4"
                width="6"
                height="6"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-primary"
              />
            </g>
          </svg>
        </div>

        {/* Loading text with dots animation */}
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm font-medium">
            Loading store
          </p>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="bg-muted-foreground h-1 w-1 rounded-full"
                style={{
                  animation: "dotPulse 1.4s ease-in-out infinite",
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fillCircle {
          0% {
            stroke-dashoffset: 226.195;
          }
          50% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -226.195;
          }
        }
        
        @keyframes dotPulse {
          0%, 80%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          40% {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
