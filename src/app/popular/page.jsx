"use client";
import { Suspense } from "react";
import AnimePaginatedList from "@/components/features/anime/AnimePaginatedList";
import LoadingSpinner from "@/components/status/LoadingSpinner";

export default function PopularAnimePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <AnimePaginatedList
        title="Most Popular Anime"
        endpoint="/popular"
        apiParams={{}}
        itemsPerPage={24}
      />
    </Suspense>
  );
}
