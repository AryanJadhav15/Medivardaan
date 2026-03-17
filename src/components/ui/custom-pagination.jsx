import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomPagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // If no pages or just 1, we can optionally hide it or show simplified view
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-sm text-gray-500 dark:text-white/60 mr-4">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-8 w-8 p-0 bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-[#393053] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {/* Simple Page Numbers logic - Can be expanded */}
      <div className="flex gap-1">
        {[...Array(totalPages)].map((_, i) => {
          const page = i + 1;
          // Show first, last, current, and adjacent
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-8 w-8 p-0 transition-colors ${
                  currentPage === page
                    ? "bg-primary hover:bg-[#0b5c7a] dark:bg-medivardaan-purple dark:hover:bg-medivardaan-purple-dark text-white"
                    : "bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-[#393053]"
                }`}
              >
                {page}
              </Button>
            );
          }
          if (
            (page === currentPage - 2 && page > 2) ||
            (page === currentPage + 2 && page < totalPages - 1)
          ) {
            return (
              <span key={page} className="px-1 text-gray-400">
                ...
              </span>
            );
          }
          return null;
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-8 w-8 p-0 bg-white dark:bg-[#18122B] border-gray-300 dark:border-[#635985]/40 text-gray-700 dark:text-white/80 hover:bg-gray-100 dark:hover:bg-[#393053] transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
