'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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
    <div className='flex items-center justify-center my-8'>
      <nav className='flex items-center space-x-2'>
        {/* Previous page button */}
        {hasPreviousPage ? (
          <Link
            href={createPageURL(currentPage - 1)}
            className='flex items-center px-3 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700'
            aria-label='Previous page'
          >
            <ChevronLeftIcon className='h-5 w-5' />
          </Link>
        ) : (
          <span
            className='flex items-center px-3 py-2 rounded-md text-gray-400 bg-gray-700 cursor-not-allowed'
            aria-disabled='true'
          >
            <ChevronLeftIcon className='h-5 w-5' />
          </span>
        )}

        {/* Page numbers */}
        {getPageNumbers().map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span key={`ellipsis-${index}`} className='px-3 py-2 text-gray-400'>
              ...
            </span>
          ) : currentPage === pageNumber ? (
            <span
              key={pageNumber}
              className='px-3 py-2 rounded-md bg-purple-600 text-white'
              aria-current='page'
            >
              {pageNumber}
            </span>
          ) : (
            <Link
              key={pageNumber}
              href={createPageURL(pageNumber)}
              className='px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white'
            >
              {pageNumber}
            </Link>
          )
        )}

        {/* Next page button */}
        {hasNextPage ? (
          <Link
            href={createPageURL(currentPage + 1)}
            className='flex items-center px-3 py-2 rounded-md text-white bg-purple-600 hover:bg-purple-700'
            aria-label='Next page'
          >
            <ChevronRightIcon className='h-5 w-5' />
          </Link>
        ) : (
          <span
            className='flex items-center px-3 py-2 rounded-md text-gray-400 bg-gray-700 cursor-not-allowed'
            aria-disabled='true'
          >
            <ChevronRightIcon className='h-5 w-5' />
          </span>
        )}
      </nav>
    </div>
  );
}
