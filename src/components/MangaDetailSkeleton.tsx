import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function MangaDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb skeleton */}
        <div className="mb-6 flex gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Manga Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* Image skeleton */}
                <Skeleton className="w-full h-64 rounded-lg" />

                {/* Info skeleton */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>

                {/* Tags skeleton */}
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-4 w-20" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & author skeleton */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2 pt-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Chapters skeleton */}
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex-1">
                        <Skeleton className="h-4 w-40 mb-2" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <Skeleton className="h-3 w-16" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export function ChaptersListSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-3 border rounded hover:bg-accent"
        >
          <div className="flex-1">
            <Skeleton className="h-4 w-48 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}
