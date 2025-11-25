import ProductGridSkeleton from "@/components/features/ProductGridSkeleton";

export default function Loading() {
  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="mb-2 h-10 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-6 w-96 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        </div>

        {/* Filters Skeleton */}
        <div className="mb-6 flex gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <ProductGridSkeleton />
      </div>
    </main>
  );
}
