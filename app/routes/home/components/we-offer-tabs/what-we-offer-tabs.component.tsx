import { useEffect, useRef, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { SectionTitle } from '~/components';
import { cn } from '~/lib/utils';
import { button } from '~/primitives/button/button.primitive';
import { IconButton } from '~/primitives/button/icon-button.primitive';
import { whatWeOfferData } from './what-we-offer.data';
import { WhatWeOfferCard } from './what-we-offer-card.component';

const tabListClassName =
  'flex justify-between gap-2 rounded-full bg-white/10 border border-white/10 p-2 mx-auto';

const tabTriggerClassName = cn(
  button({ intent: 'secondary' }),
  'rounded-full border-transparent text-white hover:border-ocean py-1',
  'data-[state=active]:text-black data-[state=active]:bg-white',
  'data-[state=active]:shadow-[0px_2.416px_2.416px_0px_rgba(0,0,0,0.25)]',
  'data-[state=active]:py-2 data-[state=active]:mb-[2px]',
);

export const WhatWeOfferTabs = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(
    () => whatWeOfferData[0]?.value ?? 'family',
  );

  const activeTabData = whatWeOfferData.find((tab) => tab.value === activeTab);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const cards = container.querySelectorAll('[data-card]');
    if (cards.length === 0) return;

    const targetIndex = cards.length === 2 ? 0 : Math.floor(cards.length / 2);
    const targetCard = cards[targetIndex] as HTMLElement;
    if (!targetCard) return;

    const containerWidth = container.clientWidth;
    const cardWidth = targetCard.offsetWidth;
    const cardOffset = targetCard.offsetLeft;
    const scrollPosition = cardOffset - (containerWidth - cardWidth) / 2;

    container.scrollTo({
      left: scrollPosition,
      behavior: 'auto',
    });
  }, [activeTab]);

  return (
    <div className='flex flex-col gap-8 lg:gap-12'>
      <div className='flex flex-col gap-2 md:gap-4 content-padding'>
        <div className='w-full items-center md:justify-center md:gap-5 md:flex'>
          <SectionTitle sectionTitle='what we offer.' color='#56CAEB' />
          <div className='hidden md:block w-6 bg-[#56CAEB] h-1' />
        </div>
        <h2 className='text-white font-extrabold text-[32px] md:text-center md:text-[52px] leading-tight'>
          Something For Everyone
        </h2>
      </div>

      <div className='w-full'>
        <Tabs.Root
          value={activeTab}
          className='w-full flex flex-col'
          onValueChange={setActiveTab}
        >
          <Tabs.List className={tabListClassName}>
            {whatWeOfferData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={tabTriggerClassName}
                data-tab={tab.value}
              >
                <p className='text-base font-bold tracking-wider px-4'>
                  {tab.mobileLabel}
                </p>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {whatWeOfferData.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                'flex flex-col w-full',
                'data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300',
              )}
            >
              <div
                ref={containerRef}
                className={cn(
                  'md:hidden flex flex-nowrap overflow-x-auto min-h-[400px] pt-2 pb-2 max-w-[100vw] mx-auto',
                  'snap-x snap-mandatory scroll-smooth',
                  tab.content.length === 2 ? 'items-stretch' : 'items-center',
                )}
                style={{
                  paddingLeft: 'calc(50vw - 36vw)',
                  paddingRight: 'calc(50vw - 36vw)',
                }}
              >
                {tab.content.map((content, index) => (
                  <div
                    key={index}
                    data-card
                    className='snap-center snap-always'
                    data-card-title={content.name}
                    data-tab-context={tab.value}
                  >
                    <WhatWeOfferCard content={content} />
                  </div>
                ))}
              </div>

              <div
                className={cn(
                  'hidden gap-2 md:flex flex-nowrap overflow-x-visible pb-2 mx-auto md:min-h-[520px] lg:min-h-[600px] items-center',
                )}
              >
                {tab.content.map((content, index) => (
                  <div
                    key={index}
                    className={cn(
                      'min-w-[230px] lg:min-w-[300px] xl:min-w-[340px]',
                      tab.content.length === 2 && {
                        'lg:-rotate-1': index === 0,
                        'lg:rotate-1': index === 1,
                      },
                      tab.content.length === 3 && {
                        'lg:-rotate-3': index === 0,
                        'lg:rotate-3': index === 2,
                        'lg:rotate-0 mb-4': index === 1,
                      },
                    )}
                    data-card-title={content.name}
                    data-tab-context={tab.value}
                  >
                    <WhatWeOfferCard content={content} />
                  </div>
                ))}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>

      <div className='md:hidden'>
        <IconButton
          to='/ministries'
          iconName='arrowBack'
          className='rounded-full border-white text-white'
          style={{
            margin: '0 auto',
            width: 'fit-content',
          }}
          withRotatingArrow
        >
          View All Ministries
        </IconButton>
      </div>

      <div className='hidden md:block'>
        <p className='text-white text-center max-w-[630px] mx-auto'>
          {activeTabData?.footerSummary}
        </p>
      </div>
    </div>
  );
};
