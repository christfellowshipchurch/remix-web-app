import { getImageUrl } from '~/lib/utils';
import { Button } from '~/primitives/button/button.primitive';

export function VolunteerReadyToMakeADifference() {
  const backgroundImageUrl = getImageUrl('3163916');

  return (
    <section className='relative w-full overflow-hidden content-padding py-20 md:py-28'>
      <div
        className='absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        aria-hidden
      />

      <div className='text-center relative z-10 flex flex-col items-center justify-center gap-6 max-w-[768px] mx-auto text-pretty md:min-h-[36vh]'>
        <h2 className='text-[40px] md:text-[48px] font-extrabold leading-tight text-white'>
          Ready to make a difference?
        </h2>
        <p className='text-lg leading-relaxed text-[#CBD5E1] md:text-xl'>
          Join countless others who are using their talents to serve God and
          care for people. Your journey begins with a single step. If
          you&apos;re still uncertain about your choice, we&apos;re here to
          help!
        </p>
        <Button
          href='/volunteer-form/welcome'
          intent='primary'
          size='lg'
          className='rounded-lg px-14 text-xl font-bold'
        >
          Find Your Fit
        </Button>
      </div>
    </section>
  );
}
