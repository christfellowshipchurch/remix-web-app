/**
 * About the program section for internship pages.
 * Reusable with different subheading and description per page (summer, year-round, etc.).
 */

import { Icon } from '~/primitives/icon/icon';

export const InternshipsAbout = ({
  isYearLong = false,
  subheading = 'About the program',
  description,
}: {
  isYearLong?: boolean;
  subheading?: string;
  description: string;
}) => {
  return (
    <section className='w-full content-padding py-12 md:py-16' id='about'>
      <div className='max-w-[1120px] mx-auto w-full'>
        <div className='flex flex-col lg:flex-row gap-8 lg:gap-24'>
          <div className='flex flex-col gap-4 md:gap-6'>
            <p className='text-sm font-medium uppercase tracking-[2px] text-ocean'>
              {subheading}
            </p>
            <p className='text-neutral-dark md:text-lg leading-relaxed'>
              {description}
            </p>
          </div>

          {isYearLong && (
            <div className='w-full lg:max-w-[380px] flex flex-col gap-5 bg-ocean-subdued p-6 md:p-8 rounded-[20px]'>
              <h2 className='text-navy text-[20px] font-bold'>Requirements</h2>
              <div className='flex flex-col gap-4'>
                <YearLongRequirementsItem item='Completed at least Sophomore year (60 credit hours)' />
                <YearLongRequirementsItem item='Full-time college enrollment with 3.0 GPA' />
                <YearLongRequirementsItem item='Available for flexible schedule, including evenings and weekends' />
                <YearLongRequirementsItem item='Believe in a vocational call of ministry on their lives' />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const YearLongRequirementsItem = ({ item }: { item: string }) => {
  return (
    <div className='flex items-start justify-start gap-3'>
      <div className='min-w-5 min-h-5 w-5 h-5 flex items-center justify-center bg-ocean rounded-full mt-1'>
        <Icon name='check' size={16} className='text-white' />
      </div>
      <p className='text-neutral-dark text-sm'>{item}</p>
    </div>
  );
};

export default InternshipsAbout;
