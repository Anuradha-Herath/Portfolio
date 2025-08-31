import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function PortfolioLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        text="Preparing your portfolio..."
        className="text-blue-600 dark:text-blue-400"
      />
    </div>
  );
}
