export default function Loading() {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Loading Spinner */}
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-500 dark:border-gray-600 dark:border-t-white" />
          {/* Loading Text */}
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }