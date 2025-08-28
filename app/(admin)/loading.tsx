import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        text="Loading admin panel..."
        className="text-gray-600 dark:text-gray-400"
      />
    </div>
  );
}
