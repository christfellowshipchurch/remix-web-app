import { ComponentType, Fragment, useMemo } from 'react';
import { cn } from '~/lib/utils';
import {
  englishTabData,
  onlineTabsData,
  spanishTabData,
} from '../../location-single-data';

type TabData = {
  label: string;
  mobileLabel: string;
  value: string;
};

interface TabComponentProps {
  setReminderVideo?: string;
  isOnline?: boolean;
  isSpanish?: boolean;
}

interface CampusTabsProps {
  tabs: Array<ComponentType<TabComponentProps>>;
  tabData?: TabData[];
  setReminderVideo?: string;
  isOnline?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSpanish?: boolean;
}
const tasListStyle =
  'absolute z-1 top-[-2rem] left-1/2 -translate-x-1/2 items-center justify-center rounded-[1rem] bg-white';

export const CampusTabs = ({
  activeTab = 'sunday-details',
  setActiveTab,
  tabs,
  tabData,
  setReminderVideo,
  isOnline,
  isSpanish,
}: CampusTabsProps) => {
  const defaultData = isOnline
    ? onlineTabsData
    : isSpanish
      ? spanishTabData
      : englishTabData;
  const data = tabData ?? defaultData;

  const activeIndex = useMemo(() => {
    const index = data.findIndex((t) => t.value === activeTab);
    return index >= 0 ? index : 0;
  }, [activeTab, data]);

  const activeTabValue = data[activeIndex]?.value ?? data[0]?.value ?? activeTab;
  const ActiveTabComponent = tabs[activeIndex];

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const isHorizontal = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const isHomeEnd = event.key === 'Home' || event.key === 'End';
    if (!isHorizontal && !isHomeEnd) return;

    event.preventDefault();

    const lastIndex = data.length - 1;
    const nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? lastIndex
          : event.key === 'ArrowLeft'
            ? activeIndex - 1
            : activeIndex + 1;

    const wrappedIndex =
      nextIndex < 0 ? lastIndex : nextIndex > lastIndex ? 0 : nextIndex;

    const nextValue = data[wrappedIndex]?.value;
    if (nextValue) setActiveTab(nextValue);
  };

  return (
    <div className={cn('w-full flex flex-col justify-center items-center')}>
      {/* Desktop Tabs */}
      <div
        role='tablist'
        aria-orientation='horizontal'
        className={cn(
          'flex max-w-[90vw] md:max-w-none lg:w-auto md:gap-4 md:border border-neutral-lighter px-3 py-2 md:py-4 relative mt-15 md:mt-0',
          isSpanish ? 'gap-0 text-[14.5px] sm:text-base' : 'gap-2',
          tasListStyle,
          activeTab === 'sunday-details' && 'absolute! -top-9 left-1/2',
        )}
        onKeyDown={handleKeyDown}
      >
        {data.map((tab, index) => (
          <Fragment key={`${tab.value}-${index}`}>
            {(() => {
              const isActive = tab.value === activeTabValue;
              const desktopTabId = `campus-tab-${tab.value}-desktop`;
              const mobileTabId = `campus-tab-${tab.value}-mobile`;
              const panelId = `campus-tabpanel-${tab.value}`;

              return (
                <>
            {/* Desktop Tabs */}
            <button
              id={desktopTabId}
              role='tab'
              type='button'
              aria-selected={isActive}
              aria-controls={panelId}
              data-state={isActive ? 'active' : 'inactive'}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.value)}
              className='hidden lg:flex px-6 py-2 text-text-secondary font-bold data-[state=active]:bg-ocean data-[state=active]:text-white rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer'
            >
              {tab.label}
            </button>

            {/* Mobile Tabs */}
            <button
              id={mobileTabId}
              role='tab'
              type='button'
              aria-selected={isActive}
              aria-controls={panelId}
              data-state={isActive ? 'active' : 'inactive'}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveTab(tab.value)}
              className='lg:hidden px-4 md:px-6 py-2 font-bold data-[state=active]:bg-navy-subdued rounded-[12px] transition-all duration-300 hover:bg-neutral-lightest cursor-pointer'
            >
              {tab.mobileLabel}
            </button>
                </>
              );
            })()}
          </Fragment>
        ))}
      </div>

      <div className='w-full flex flex-col justify-center items-center'>
        <div
          id={`campus-tabpanel-${activeTabValue}`}
          role='tabpanel'
          aria-labelledby={`campus-tab-${activeTabValue}-desktop`}
          data-state='active'
          className='w-full data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300'
        >
          {ActiveTabComponent && (
            <ActiveTabComponent
              setReminderVideo={setReminderVideo}
              isOnline={isOnline}
              isSpanish={isSpanish}
            />
          )}
        </div>
      </div>
    </div>
  );
};
