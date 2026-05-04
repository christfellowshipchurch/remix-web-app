import type { ComponentProps, MouseEvent } from "react";
import { usePagination, type UsePaginationProps } from "react-instantsearch";

import Icon from "~/primitives/icon";

export type FindersCustomPaginationProps = UsePaginationProps & {
  /** CSS selector for `scrollIntoView` after page change (default: finder scroll anchor). */
  scrollTargetSelector?: string;
};

export const FindersCustomPagination = ({
  scrollTargetSelector = ".pagination-scroll-to",
  ...paginationProps
}: FindersCustomPaginationProps) => {
  const {
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination(paginationProps);
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;

  const handlePageChange = (newPage: number) => {
    refine(newPage);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        const scrollTarget = document.querySelector(scrollTargetSelector);
        scrollTarget?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <PaginationItem
        isDisabled={isFirstPage}
        href={createURL(previousPageIndex)}
        onClick={() => handlePageChange(previousPageIndex)}
      >
        <Icon
          name="chevronLeft"
          size={32}
          color={isFirstPage ? "#CECECE" : "#0092BC"}
        />
      </PaginationItem>
      <p>
        {currentRefinement + 1} of {nbPages}
      </p>
      <PaginationItem
        isDisabled={isLastPage}
        href={createURL(nextPageIndex)}
        onClick={() => handlePageChange(nextPageIndex)}
      >
        <Icon
          name="chevronRight"
          size={32}
          color={isLastPage ? "#CECECE" : "#0092BC"}
        />
      </PaginationItem>
    </div>
  );
};

type PaginationItemProps = Omit<ComponentProps<"a">, "onClick"> & {
  onClick: NonNullable<ComponentProps<"a">["onClick"]>;
  isDisabled: boolean;
};

function PaginationItem({
  isDisabled,
  href,
  onClick,
  ...props
}: PaginationItemProps) {
  if (isDisabled) {
    return (
      <div>
        <span {...props} />
      </div>
    );
  }

  return (
    <div>
      <a
        href={href}
        onClick={(event) => {
          if (isModifierClick(event)) {
            return;
          }

          event.preventDefault();

          onClick(event);
        }}
        {...props}
      />
    </div>
  );
}

function isModifierClick(event: MouseEvent) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey,
  );
}
