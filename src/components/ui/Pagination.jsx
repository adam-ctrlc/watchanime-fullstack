'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className='flex items-center justify-center my-12'>
      <nav className='flex items-center gap-2 bg-[#121212]/60 backdrop-blur-xl p-2 rounded-2xl border border-white/10'>
        {/* Previous page button */}
        {hasPreviousPage ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white"
          >
            <Link href={createPageURL(currentPage - 1)}>
              <ChevronLeft className='h-5 w-5' />
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl opacity-20 cursor-not-allowed"
          >
            <ChevronLeft className='h-5 w-5' />
          </Button>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((pageNumber, index) =>
            pageNumber === '...' ? (
              <span key={`ellipsis-${index}`} className='w-10 text-center text-gray-500'>
                ...
              </span>
            ) : currentPage === pageNumber ? (
              <Button
                key={pageNumber}
                className='h-10 w-10 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-900/20'
              >
                {pageNumber}
              </Button>
            ) : (
              <Button
                key={pageNumber}
                asChild
                variant="ghost"
                className='h-10 w-10 rounded-xl text-gray-400 hover:text-white hover:bg-white/5'
              >
                <Link href={createPageURL(pageNumber)}>
                  {pageNumber}
                </Link>
              </Button>
            )
          )}
        </div>

        {/* Next page button */}
        {hasNextPage ? (
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white"
          >
            <Link href={createPageURL(currentPage + 1)}>
              <ChevronRight className='h-5 w-5' />
            </Link>
          </Button>
        ) : (
          <Button
            disabled
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl opacity-20 cursor-not-allowed"
          >
            <ChevronRight className='h-5 w-5' />
          </Button>
        )}
      </nav>
    </div>
  );
}
