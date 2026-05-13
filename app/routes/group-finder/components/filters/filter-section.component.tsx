import { finderFilterSectionSubtitleClass } from '~/components/finders/search-filters/filter-section-subtitle';
import { cn } from '~/lib/utils';
import { Icon } from '~/primitives/icon/icon';
import { AllFiltersRefinementContent } from './refinement-content.component';

interface AllFiltersFilterSectionProps {
  title: string;
  attribute: string;
  hideBorder?: boolean;
  isMeetingType?: boolean;
  isWeekdays?: boolean;
  showSection: boolean;
  setShowSection: (show: boolean) => void;
  /**
   * Mobile overflow bottom sheet: always show content, no chevron — section titles
   * match `FilterPopup` subtitles (`uppercase` / `text-xs` / `neutral-default`).
   */
  expandAlways?: boolean;
}

export const AllFiltersFilterSection = ({
  title,
  attribute,
  hideBorder = false,
  isMeetingType = false,
  isWeekdays = false,
  showSection,
  setShowSection,
  expandAlways = false,
}: AllFiltersFilterSectionProps) => {
  const titleStyles =
    'font-semibold text-base group-hover:text-ocean transition-all duration-300';

  const contentVisible = expandAlways || showSection;

  return (
    <div
      className={cn(
        'flex w-full flex-col',
        expandAlways
          ? 'gap-2 border-b border-solid border-[#E5E7EB] pb-4'
          : 'gap-4 border-b border-solid border-[#E5E7EB]',
        !expandAlways && showSection && 'pb-5',
        hideBorder && 'border-b-0',
        expandAlways && hideBorder && 'pb-0',
      )}
    >
      {expandAlways ? (
        <h3 className={finderFilterSectionSubtitleClass}>{title}</h3>
      ) : (
        <div
          className='group flex cursor-pointer items-center justify-between'
          onClick={() => setShowSection(!showSection)}
        >
          <p className={titleStyles}>{title}</p>
          <Icon
            name='chevronDown'
            className={cn(
              'transition-all duration-300 group-hover:text-ocean',
              showSection && 'rotate-180',
            )}
          />
        </div>
      )}
      <AllFiltersRefinementContent
        data={{
          content: {
            attribute,
            isMeetingType,
            isWeekdays,
          },
        }}
        showSection={contentVisible}
      />
    </div>
  );
};
