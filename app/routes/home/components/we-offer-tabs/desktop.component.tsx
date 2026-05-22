import { useState } from 'react';
import { Link } from 'react-router';
import * as Tabs from '@radix-ui/react-tabs';
import { SectionTitle } from '~/components';
import { cn } from '~/lib/utils';
import { button } from '~/primitives/button/button.primitive';
import {
  whatWeOfferData,
  type WhatWeOfferCardItem,
} from './what-we-offer.data';

export const WhatWeOfferCard = ({
  content,
  middleCard,
}: {
  content: WhatWeOfferCardItem;
  middleCard: boolean;
}) => {
  return (
    <Link
      to={content.url}
      prefetch='intent'
      className='flex flex-col rounded-[36px] overflow-hidden w-full max-w-[405px] h-full hover:translate-y-[-4px] transition-all duration-300'
    >
      <img
        className={cn(
          'w-full object-cover object-center',
          middleCard ? 'h-[220px]' : 'h-[164px]',
        )}
        src={content.image}
        alt={content.name}
      />
      <div className='flex flex-col gap-4 p-6 pb-8 bg-white size-full'>
        <div className='flex items-center justify-center bg-ocean-subdued rounded-full w-fit px-3 py-1'>
          <p className='text-xs font-bold text-[#1C697E]'>{content.tag}</p>
        </div>
        <h2 className='text-navy text-xl font-extrabold leading-none'>
          {content.name}
        </h2>
        <p className='text-[#3F484C] text-sm'>{content.description}</p>
      </div>
    </Link>
  );
};

export const WhatWeOfferDesktop = () => {
  const [activeTab, setActiveTab] = useState(
    () => whatWeOfferData[0]?.value ?? 'family',
  );

  const activeTabData = whatWeOfferData.find((tab) => tab.value === activeTab);

  return (
    <div className='flex flex-col gap-8 lg:gap-12'>
      <div className='flex flex-col gap-4 content-padding'>
        <div className='w-full items-center justify-center gap-5 flex'>
          <SectionTitle sectionTitle='what we offer.' color='#56CAEB' />
          <div className='w-6 bg-[#56CAEB] h-1' />
        </div>
        <h2 className='text-white text-center font-extrabold text-[52px] leading-tight'>
          Something For Everyone
        </h2>
      </div>

      <div className='w-full'>
        <Tabs.Root
          value={activeTab}
          className='w-full flex flex-col gap-12'
          onValueChange={setActiveTab}
        >
          <Tabs.List className='flex justify-center gap-4 max-w-none mx-auto'>
            {whatWeOfferData.map((tab) => (
              <Tabs.Trigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  button({ intent: 'secondary' }),
                  'rounded-full border-transparent text-white hover:border-ocean py-3 px-6',
                  'data-[state=active]:text-white data-[state=active]:bg-ocean border-white data-[state=active]:border-ocean',
                )}
                data-tab={tab.value}
              >
                <p>{tab.label}</p>
              </Tabs.Trigger>
            ))}
          </Tabs.List>

          {whatWeOfferData.map((tab) => (
            <Tabs.Content
              key={tab.value}
              value={tab.value}
              className={cn(
                'flex flex-col gap-4 w-full',
                'overflow-x-visible pb-2',
                'data-[state=active]:animate-in data-[state=active]:fade-in data-[state=active]:zoom-in-95 data-[state=active]:duration-300',
              )}
            >
              <div
                className={cn(
                  'flex gap-4 lg:gap-8 flex-nowrap overflow-x-visible mx-auto md:min-h-[520px] lg:min-h-[600px]',
                  'items-center',
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
                        'lg:rotate-0': index === 1,
                      },
                    )}
                    data-card-title={content.name}
                    data-tab-context={tab.value}
                  >
                    <WhatWeOfferCard
                      content={content}
                      middleCard={index === 1 && tab.content.length === 3}
                    />
                  </div>
                ))}
              </div>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>

      <div>
        <p className='text-white text-center max-w-[630px] mx-auto'>
          {activeTabData?.footerSummary}
        </p>
      </div>
    </div>
  );
};
