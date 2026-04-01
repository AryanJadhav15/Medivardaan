import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function CustomPagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  // Build the page numbers to display with ellipsis
  const getPageNumbers = () => {
    const delta = 1; // pages on each side of current
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Always include first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    // Always include last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  const btnBase =
    "h-8 min-w-[2rem] px-2 text-xs font-medium transition-colors rounded";
  const btnActive =
    "bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-medivardaan-purple-dark text-white border-transparent";
  const btnInactive =
    "bg-white dark:bg-[#18122B] border border-gray-300 dark:border-[#635985]/40 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-[#393053]";
  const btnNav =
    "h-8 w-8 p-0 bg-white dark:bg-[#18122B] border border-gray-300 dark:border-[#635985]/40 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-[#393053] transition-colors rounded";

  return (
    <div className="flex items-center justify-end gap-1 py-4 flex-wrap">
      {/* Page info */}
      <span className="text-xs text-gray-500 dark:text-white/60 mr-2 whitespace-nowrap">
        Page {currentPage} of {totalPages.toLocaleString()}
      </span>

      {/* First page */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${btnNav} disabled:opacity-40 disabled:cursor-not-allowed`}
        title="First page"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>

      {/* Previous page */}
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className={`${btnNav} disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, i) =>
        page === "..." ? (
          <span
            key={`dots-${i}`}
            className="h-8 min-w-[2rem] flex items-center justify-center text-xs text-gray-400 dark:text-white/40 select-none"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`${btnBase} ${currentPage === page ? btnActive : btnInactive} disabled:cursor-not-allowed`}
          >
            {page}
          </button>
        )
      )}

      {/* Next page */}
      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className={`${btnNav} disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Last page */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${btnNav} disabled:opacity-40 disabled:cursor-not-allowed`}
        title="Last page"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
}
