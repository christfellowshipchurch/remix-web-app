import { usePagination, UsePaginationProps } from "react-instantsearch";

export const CustomPagination = (props: UsePaginationProps) => {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination(props);
  const firstPageIndex = 0;
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;
  const lastPageIndex = nbPages - 1;

  return (
    <div className="flex gap-2">
      <PaginationItem
        isDisabled={isFirstPage}
        href={createURL(previousPageIndex)}
        onClick={() => refine(previousPageIndex)}
      >
        {"<"}
      </PaginationItem>
      <p>
        {currentRefinement} of {nbPages}
      </p>
      <PaginationItem
        isDisabled={isLastPage}
        href={createURL(nextPageIndex)}
        onClick={() => refine(nextPageIndex)}
      >
        {">"}
      </PaginationItem>
    </div>
  );
};

type PaginationItemProps = Omit<React.ComponentProps<"a">, "onClick"> & {
  onClick: NonNullable<React.ComponentProps<"a">["onClick"]>;
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

function isModifierClick(event: React.MouseEvent) {
  const isMiddleClick = event.button === 1;

  return Boolean(
    isMiddleClick ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
  );
}
