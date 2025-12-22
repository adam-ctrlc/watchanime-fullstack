"use client";
import { Suspense } from "react";
import AnimePaginatedList from "@/components/features/anime/AnimePaginatedList";
import LoadingSpinner from "@/components/status/LoadingSpinner";

export default function UpcomingAnimePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <AnimePaginatedList
        title="Upcoming Anime"
        endpoint="/upcoming"
        apiParams={{}}
        itemsPerPage={24}
      />
    </Suspense>
  );
}
