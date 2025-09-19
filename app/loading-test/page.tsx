'use client';

import { useState } from 'react';
import { LoadingSpinner, PageLoading, SkeletonLoader } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/Button';

export default function LoadingTestPage() {
  const [showPageLoading, setShowPageLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold gradient-text">Premium Loading Animations</h1>
          <p className="text-lg text-slate-400">
            Test the premium loading system with your design system colors
          </p>
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={() => setShowPageLoading(true)}
            className="btn-premium"
          >
            Show Page Loading
          </Button>
          <Button
            onClick={() => setShowSpinner(!showSpinner)}
            className="btn-premium"
          >
            {showSpinner ? 'Hide' : 'Show'} Spinner
          </Button>
          <Button
            onClick={() => setShowSkeleton(!showSkeleton)}
            className="btn-premium"
          >
            {showSkeleton ? 'Hide' : 'Show'} Skeleton
          </Button>
        </div>

        {/* Different Spinner Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card-premium p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-white">Small Spinner</h3>
            <LoadingSpinner size="sm" text="Loading..." />
          </div>

          <div className="card-premium p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-white">Medium Spinner</h3>
            <LoadingSpinner size="md" text="Processing..." />
          </div>

          <div className="card-premium p-6 text-center space-y-4">
            <h3 className="text-xl font-semibold text-white">Large Spinner</h3>
            <LoadingSpinner size="lg" text="Preparing..." />
          </div>
        </div>

        {/* Conditional Loading States */}
        {showSpinner && (
          <div className="card-premium p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Interactive Loading</h3>
            <LoadingSpinner
              size="lg"
              text="Dynamic loading state..."
              className="mb-4"
            />
            <Button
              onClick={() => setShowSpinner(false)}
              className="mt-4"
            >
              Stop Loading
            </Button>
          </div>
        )}

        {/* Skeleton Loading */}
        {showSkeleton && (
          <div className="card-premium p-8">
            <h3 className="text-2xl font-bold text-white mb-6">Skeleton Loading</h3>
            <div className="space-y-4">
              <SkeletonLoader className="h-4 w-full" />
              <SkeletonLoader className="h-4 w-3/4" />
              <SkeletonLoader className="h-4 w-1/2" />
              <SkeletonLoader className="h-32 w-full" />
            </div>
          </div>
        )}

        {/* Page Loading Overlay */}
        {showPageLoading && (
          <PageLoading text="Testing full page loading..." />
        )}

        {/* Instructions */}
        <div className="card-premium p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
          <ul className="space-y-2 text-slate-400">
            <li>• Premium multi-ring spinner with floating particles</li>
            <li>• Gradient text effects with shimmer animation</li>
            <li>• Glass morphism overlay for page loading</li>
            <li>• Responsive design for all screen sizes</li>
            <li>• Custom animations using your design system colors</li>
            <li>• Skeleton loading for content placeholders</li>
          </ul>
        </div>
      </div>

      {/* Hidden close button for page loading */}
      {showPageLoading && (
        <button
          onClick={() => setShowPageLoading(false)}
          className="fixed top-4 right-4 z-[60] bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Close Loading
        </button>
      )}
    </div>
  );
}
