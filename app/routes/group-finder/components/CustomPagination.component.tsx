import { usePagination, UsePaginationProps } from "react-instantsearch";
import Icon from "~/primitives/icon";

export const CustomPagination = (props: UsePaginationProps) => {
  const {
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination(props);
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;

  // TODO: Update the < and > to be icons
  return (
    <div className="flex items-center justify-center gap-2">
      <PaginationItem
        isDisabled={isFirstPage}
        href={createURL(previousPageIndex)}
        onClick={() => refine(previousPageIndex)}
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
        onClick={() => refine(nextPageIndex)}
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
