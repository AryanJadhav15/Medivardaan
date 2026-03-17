import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) {
  // Memoize pages array to prevent recalculation
  const pages = useMemo(() => Array.from({ length: totalPages }, (_, i) => i + 1), [totalPages]);

  // Memoize getVisiblePages to prevent recalculation
  const visiblePages = useMemo(() => {
    const getVisiblePages = () => {
      if (totalPages <= 7) return pages;
      if (currentPage <= 4) return [...pages.slice(0, 5), "...", totalPages];
      if (currentPage >= totalPages - 3)
        return [1, "...", ...pages.slice(totalPages - 5)];
      return [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages,
      ];
    };
    return getVisiblePages();
  }, [currentPage, totalPages, pages]);

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-lg border-gray-300 text-gray-700 hover:text-medivardaan-teal hover:bg-medivardaan-teal/5 hover:border-medivardaan-teal/30 transition-colors duration-150 dark:text-white/75 dark:border-[#443C68]/50 dark:hover:text-white/90 dark:hover:bg-white/30"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {visiblePages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className="px-2 text-gray-500 dark:text-white/50">...</span>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 p-0 rounded-lg text-sm font-medium transition-colors duration-150 ${currentPage === page
                  ? "bg-medivardaan-teal hover:bg-medivardaan-teal/80 text-white border-medivardaan-teal dark:bg-medivardaan-purple dark:hover:bg-medivardaan-purple/80"
                  : "bg-white hover:bg-medivardaan-teal/5 hover:text-medivardaan-teal dark:hover:bg-white/30 dark:bg-[#393053] text-gray-700 dark:text-white/75 border-gray-300 dark:border-[#443C68]/50 dark:hover:text-white/90"
                }`}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-9 h-9 rounded-lg border-gray-300 text-gray-700 hover:text-medivardaan-teal hover:bg-medivardaan-teal/5 hover:border-medivardaan-teal/30 transition-colors duration-150 dark:text-white/75 dark:border-[#443C68]/50 dark:hover:text-white/90 dark:hover:bg-white/30"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
