import { useCallback, useEffect, useState } from 'react';
import { Button } from '~/primitives/button/button.primitive';
import { cn } from '~/lib/utils';

import { scrollToAnchor } from '~/lib/scroll-to-anchor';
import { useStickyTopBelowNavbarClass } from '~/hooks/use-sticky-top-below-navbar';
import {
  EVENT_SECTION_NAV_ID,
  useEventSectionScrollOffset,
} from '../hooks/use-event-section-scroll-offset';

export const EventBanner = ({
  cta,
  title,
  sections,
}: {
  cta?: { title: string; url: string };
  title: string;
  sections: { id: string; label: string }[];
}) => {
  const [activeSection, setActiveSection] = useState<string>('');
  const stickyTopClass = useStickyTopBelowNavbarClass();
  const getScrollOffset = useEventSectionScrollOffset();

  const buttonStyles =
    'bg-navy hover:!bg-ocean text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0';

  const unselectedStyles =
    'bg-white hover:!bg-navy text-[#585858] hover:text-white text-xs font-semibold rounded-[6px] px-3 py-[6px] min-h-0 min-w-0';

  // Derive active section from scroll position to improve accuracy when scrolling up - this function worked
  //  better than IntersectionObserver alone or other alternatives I tried
  const updateActiveSectionFromOffsets = useCallback(() => {
    const currentY = window.scrollY + getScrollOffset();
    const candidates = sections
      .map(({ id }) => {
        const el = document.getElementById(id);
        return {
          id,
          top: el ? el.offsetTop : Number.POSITIVE_INFINITY,
        };
      })
      .filter((s) => Number.isFinite(s.top))
      .sort((a, b) => a.top - b.top);

    // Find the last section whose top is above or equal to the currentY
    let chosen = candidates[0]?.id || '';
    for (const c of candidates) {
      if (c.top <= currentY) {
        chosen = c.id;
      } else {
        break;
      }
    }
    if (chosen) {
      setActiveSection((prev) => (chosen !== prev ? chosen : prev));
    }
  }, [sections, getScrollOffset]);

  const handleSectionClick = (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    scrollToAnchor(targetId, { offset: getScrollOffset() });
  };

  useEffect(() => {
    const handleScroll = () => {
      updateActiveSectionFromOffsets();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateActiveSectionFromOffsets]);

  // Section detection effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible && mostVisible.target && mostVisible.target.id) {
          setActiveSection(mostVisible.target.id);
        }
      },
      {
        threshold: [0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: `-${getScrollOffset()}px 0px -35% 0px`,
      },
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections, getScrollOffset]);

  return (
    <div
      id={EVENT_SECTION_NAV_ID}
      className={cn(
        'w-full bg-white content-padding py-[15px] shadow-md sticky transition-all duration-300 z-10',
        stickyTopClass,
      )}
    >
      <div className='max-w-screen-content mx-auto w-full flex items-center'>
        <div className='flex-1 flex justify-start'>
          <p className='font-medium'>{title} Event</p>
        </div>

        <div className='hidden md:flex gap-2'>
          {sections.map(({ id, label }) => (
            <Button
              key={id}
              intent='primary'
              onClick={(e) => handleSectionClick(e, id)}
              className={
                activeSection === id || (activeSection === '' && id === 'about')
                  ? buttonStyles
                  : unselectedStyles
              }
            >
              {label}
            </Button>
          ))}
        </div>

        <div className='flex-1 flex justify-end'>
          {cta && (
            <Button
              href={cta.url}
              intent='primary'
              className={`${buttonStyles}`}
            >
              {cta.title}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
