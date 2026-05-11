import { cn } from '~/lib/utils';
import { volunteerCategoryPillClassName } from '../../volunteer-category-pill';

export function OutreachIntro({
  category,
  title,
  spotsLabel,
}: {
  category: string;
  title: string;
  spotsLabel?: string | null;
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-start">
        <span
          className={cn(
            volunteerCategoryPillClassName(category),
            'lg:text-[13px] font-semibold',
          )}
        >
          {category}
        </span>
        {spotsLabel ? (
          <p className="text-sm font-semibold text-ocean lg:hidden">
            {spotsLabel}
          </p>
        ) : null}
      </div>
      <h1 className="text-[28px] font-extrabold leading-tight text-text-primary sm:text-4xl lg:text-[2.5rem]">
        {title}
      </h1>
      {spotsLabel ? (
        <p className="hidden text-sm font-semibold text-ocean lg:block">
          {spotsLabel}
        </p>
      ) : null}
    </div>
  );
}
