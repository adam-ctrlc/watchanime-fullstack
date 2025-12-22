'use client';
import { Suspense } from 'react';
import AnimePaginatedList from '@/app/components/AnimePaginatedList';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function TrendingAnimePage() {
  return (
    <Suspense
      fallback={
        <div className='flex justify-center items-center min-h-[50vh]'>
          <LoadingSpinner size='large' />
        </div>
      }
    >
      <AnimePaginatedList
        title='Trending Anime'
        endpoint='/trending/anime'
        itemsPerPage={24}
      />
    </Suspense>
  );
}
