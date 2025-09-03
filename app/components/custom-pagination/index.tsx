import { usePagination, UsePaginationProps } from "react-instantsearch";
import { Icon } from "~/primitives/icon/icon";

export const CustomPagination = (props: UsePaginationProps) => {
  const { currentRefinement, isFirstPage, isLastPage, refine, createURL } =
    usePagination(props);

  // Ensure to add "pagination-scroll-to" class to the element you want to scroll to
  const handlePageChange = (newPage: number) => {
    refine(newPage);
    // Scroll to the pagination-scroll-to element
    const scrollTarget = document.querySelector(".pagination-scroll-to");
    if (scrollTarget) {
      scrollTarget.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex items-center justify-start gap-4 mt-16">
      {/* Previous Button */}
      <PaginationButton
        isDisabled={isFirstPage}
        onClick={() => handlePageChange(currentRefinement - 1)}
        href={createURL(currentRefinement - 1)}
        className="w-12 h-12"
      >
        <Icon name="chevronLeft" size={24} />
      </PaginationButton>

      {/* Current Page */}
      <PaginationButton
        isActive={true}
        onClick={() => {}}
        href="#"
        className="w-12 h-12 bg-navy text-white"
      >
        {currentRefinement + 1}
      </PaginationButton>

      {/* Next Button */}
      <PaginationButton
        isDisabled={isLastPage}
        onClick={() => handlePageChange(currentRefinement + 1)}
        href={createURL(currentRefinement + 1)}
        className="w-12 h-12"
      >
        <Icon name="chevronRight" size={24} />
      </PaginationButton>
    </div>
  );
};

interface PaginationButtonProps {
  children: React.ReactNode;
  isDisabled?: boolean;
  isActive?: boolean;
  href: string;
  onClick: () => void;
  className?: string;
}

const PaginationButton = ({
  children,
  isDisabled = false,
  isActive = false,
  href,
  onClick,
  className = "",
}: PaginationButtonProps) => {
  if (isDisabled) {
    return (
      <span
        className={`${className} inline-flex items-center justify-center border-2 border-neutral-200 text-neutral-200 cursor-not-allowed`}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      onClick={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`${className} inline-flex items-center justify-center border-2 ${
        isActive
          ? "border-navy bg-navy text-white"
          : "border-navy text-navy hover:bg-navy hover:text-white"
      } transition-colors duration-200 cursor-pointer`}
    >
      {children}
    </a>
  );
};
