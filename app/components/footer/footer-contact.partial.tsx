import Icon from '~/primitives/icon';

const linkStyle =
  'font-bold text-xl text-white hover:text-white/50 transition-colors md:heading-h5';
const SideDivider = () => (
  <div className='hidden lg:block w-px h-18 bg-white/30' />
);

export const ContactInfo = () => {
  return (
    <div className='flex flex-col items-center lg:flex-row py-12 lg:gap-4 xl:gap-10'>
      {/* Call */}
      <div className='flex items-center justify-start md:justify-center w-full pb-6 lg:pb-0 gap-4 '>
        <div className='min-w-12 text-coconut'>
          <Icon name='call' size={42} />
        </div>
        <div className='flex flex-col h-full justify-center'>
          <p className='text-sm md:text-lg font-medium text-coconut'>Call Us</p>
          <a className={linkStyle} href='tel:5617997600'>
            (561) 799-7600
          </a>
        </div>
      </div>
      <SideDivider />
      {/* Email */}
      <div className='flex items-center justify-start md:justify-center w-full gap-4 border-y py-6 lg:py-0 lg:border-y-0 border-[#D9D9D9]/30'>
        <div className='min-w-12 text-coconut'>
          <Icon name='envelope' size={42} />
        </div>
        <div className='flex flex-col h-full justify-center'>
          <p className='text-sm md:text-lg font-medium text-coconut'>
            Email Us
          </p>
          <a
            href='mailto:hello@christfellowship.church'
            className={`${linkStyle} w-full`}
          >
            hello@christfellowship.church
          </a>
        </div>
      </div>
      <SideDivider />
      {/* Location */}
      <div className='flex items-center justify-start md:justify-center w-full gap-4 pt-6 lg:pt-0 lg:w-full lg:min-w-[320px] '>
        <div className='min-w-12 text-coconut'>
          <Icon name='map' size={42} />
        </div>
        <div className='flex flex-col h-full justify-center'>
          <p className='text-sm md:text-lg font-medium text-coconut'>Find Us</p>
          <a href='/locations' className={linkStyle}>
            View Locations
          </a>
        </div>
      </div>
    </div>
  );
};
