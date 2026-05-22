import { WhatWeOfferTabs } from '../components/we-offer-tabs/what-we-offer-tabs.component';

export function WhatWeOfferSection() {
  return (
    <section className='w-full py-24 md:pt-38 md:pb-23 bg-navy relative z-30'>
      <div className='max-w-screen-content mx-auto flex flex-col items-center gap-12'>
        <WhatWeOfferTabs />
      </div>
    </section>
  );
}
