"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationBlockProps {
  id?: string;
  total_page: number;
}

const PaginationBlock = ({ id, total_page }: PaginationBlockProps) => {
  const currentPage = Number(id) || 1;

  return (
    <div className="my-20">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage !== 1 && (
              <PaginationPrevious
                href={`/blog/page/${currentPage === 1 ? 1 : currentPage - 1}`}
              />
            )}
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href={`/blog/page/${currentPage}`}
              className={`${currentPage && "bg-gray-200 dark:text-black"}`}
            >
              {id ? id : currentPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          {currentPage < total_page && (
            <PaginationItem>
              <PaginationNext
                href={`/blog/page/${
                  currentPage < total_page ? currentPage + 1 : total_page
                }`}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default PaginationBlock;
