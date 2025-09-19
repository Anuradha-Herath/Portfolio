import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  showDots?: boolean;
}

export function LoadingSpinner({
  size = 'md',
  className,
  text = 'Loading...',
  showDots = true
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4'
  };

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      {/* Premium Multi-Ring Spinner */}
      <div className="relative">
        {/* Outer Ring */}
        <div className={cn(
          "border-slate-700/30 rounded-full animate-loading-ring",
          sizeClasses[size]
        )}>
          <div className={cn(
            "absolute top-0 left-0 border-transparent border-t-[var(--accent)] rounded-full animate-loading-ring",
            sizeClasses[size]
          )}></div>
        </div>

        {/* Inner Ring */}
        <div className={cn(
          "absolute inset-2 border-slate-700/20 rounded-full animate-loading-ring",
          size === 'sm' ? 'border' : 'border-2'
        )}>
          <div className={cn(
            "absolute top-0 left-0 border-transparent border-t-[#5856d6] rounded-full animate-loading-ring",
            size === 'sm' ? 'border' : 'border-2'
          )} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>

        {/* Center Glow */}
        <div className="absolute inset-4 bg-gradient-to-r from-[var(--accent)]/20 via-[#5856d6]/20 to-purple-500/20 rounded-full blur-sm animate-pulse-glow"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-[var(--accent)] rounded-full animate-float opacity-60"></div>
          <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-[#5856d6] rounded-full animate-float opacity-60" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-purple-500 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Premium Loading Text */}
      {text && (
        <div className="text-center space-y-2">
          <p className={cn(
            "font-bold text-white tracking-tight",
            size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-xl'
          )}>
            <span className="bg-gradient-to-r from-[var(--accent)] via-[#5856d6] to-purple-600 bg-clip-text text-transparent animate-shimmer">
              {text}
            </span>
          </p>
          <p className="text-sm text-slate-400 font-medium">
            Please wait while we prepare your experience
          </p>
        </div>
      )}

      {/* Premium Animated Dots */}
      {showDots && (
        <div className="flex space-x-2">
          <div className={cn(
            "bg-gradient-to-r from-[var(--accent)] to-[#5856d6] rounded-full animate-loading-dots shadow-lg",
            dotSizeClasses[size]
          )}></div>
          <div className={cn(
            "bg-gradient-to-r from-[#5856d6] to-purple-600 rounded-full animate-loading-dots shadow-lg",
            dotSizeClasses[size]
          )} style={{ animationDelay: '0.16s' }}></div>
          <div className={cn(
            "bg-gradient-to-r from-purple-600 to-[var(--accent)] rounded-full animate-loading-dots shadow-lg",
            dotSizeClasses[size]
          )} style={{ animationDelay: '0.32s' }}></div>
        </div>
      )}
    </div>
  );
}

// Full Page Loading Overlay
export function PageLoading({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-900/95 backdrop-blur-md flex items-center justify-center z-50">
      <div className="flex flex-col items-center space-y-6 p-8 glass rounded-2xl border border-gray-700/50 shadow-2xl">
        {/* Premium Multi-Ring Spinner */}
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-16 h-16 border-4 border-slate-700/30 rounded-full animate-loading-ring">
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-[var(--accent)] rounded-full animate-loading-ring"></div>
          </div>

          {/* Inner Ring */}
          <div className="absolute inset-2 border-2 border-slate-700/20 rounded-full animate-loading-ring">
            <div className="absolute top-0 left-0 border-2 border-transparent border-t-[#5856d6] rounded-full animate-loading-ring" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>

          {/* Center Glow */}
          <div className="absolute inset-4 bg-gradient-to-r from-[var(--accent)]/20 via-[#5856d6]/20 to-purple-500/20 rounded-full blur-sm animate-pulse-glow"></div>

          {/* Floating Particles */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-[var(--accent)] rounded-full animate-float opacity-60"></div>
            <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-[#5856d6] rounded-full animate-float opacity-60" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/4 right-0 w-1 h-1 bg-purple-500 rounded-full animate-float opacity-60" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>

        {/* Premium Loading Text */}
        <div className="text-center space-y-2">
          <p className="text-xl font-bold text-white tracking-tight">
            <span className="bg-gradient-to-r from-[var(--accent)] via-[#5856d6] to-purple-600 bg-clip-text text-transparent animate-shimmer">
              {text || "Loading your portfolio..."}
            </span>
          </p>
          <p className="text-sm text-slate-400 font-medium">
            Crafting an amazing experience for you
          </p>
        </div>

        {/* Premium Animated Dots */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent)] to-[#5856d6] rounded-full animate-loading-dots shadow-lg"></div>
          <div className="w-3 h-3 bg-gradient-to-r from-[#5856d6] to-purple-600 rounded-full animate-loading-dots shadow-lg" style={{ animationDelay: '0.16s' }}></div>
          <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-[var(--accent)] rounded-full animate-loading-dots shadow-lg" style={{ animationDelay: '0.32s' }}></div>
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading for Content
export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}
