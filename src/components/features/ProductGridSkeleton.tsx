export default function ProductGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
        >
          {/* Image Skeleton */}
          <div className="aspect-square w-full bg-gray-200 dark:bg-gray-800" />

          {/* Content Skeleton */}
          <div className="p-4">
            <div className="mb-2 h-4 w-20 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="mb-4 space-y-2">
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="mb-4 h-8 w-24 rounded bg-gray-200 dark:bg-gray-800" />
            <div className="h-10 w-full rounded bg-gray-200 dark:bg-gray-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
