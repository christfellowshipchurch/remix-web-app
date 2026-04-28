import { HowItWorksCard } from '../components/cards/how-it-works-card.component';
import {
  Carousel,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from '~/primitives/shadcn-primitives/carousel';

const steps = [
  { label: 'Pick an interest', dotClass: 'bg-dark-navy' },
  { label: 'Get matched', dotClass: 'bg-navy' },
  { label: 'Start serving', dotClass: 'bg-ocean' },
];

const cards = [
  {
    title: 'At Church',
    subtitle: 'Sunday teams & campus life',
    href: '#church',
    iconName: 'church' as const,
    image: 'https://rock.christfellowship.church/GetImage.ashx?id=3160918',
    alt: 'Volunteers serving at a church event',
  },
  {
    title: 'In Our Community',
    subtitle: 'Local outreach & non-profits',
    href: '#community',
    iconName: 'group' as const,
    image: 'https://rock.christfellowship.church/GetImage.ashx?id=3160919',
    alt: 'Volunteers working in the local community',
  },
  {
    title: 'Around The Globe',
    subtitle: 'International trips',
    href: '#globe',
    iconName: 'world' as const,
    image: 'https://rock.christfellowship.church/GetImage.ashx?id=3160920',
    alt: 'A scenic view representing international volunteer trips',
  },
];

export function VolunteerHowItWorks() {
  return (
    <section
      id='how-it-works'
      className='w-full bg-[#F1F4F5] py-12 md:py-16 lg:py-20'
    >
      {/* ── MOBILE HEADER ─────────────────────────────────────────── */}
      <div className='md:hidden content-padding'>
        <p className='text-[12px] font-semibold tracking-wider text-navy'>
          START VOLUNTEERING
        </p>
        <h2 className='text-[30px] font-bold leading-none text-primary'>
          How It Works
        </h2>

        {/* Dot-bullet steps */}
        <div className='flex flex-wrap items-center gap-x-5 gap-y-2 mt-4'>
          {steps.map((step, index) => (
            <div key={index} className='flex items-center gap-2'>
              <span
                className={`${step.dotClass} size-3 rounded-full shrink-0`}
              />
              <span className='text-[13px] font-semibold text-navy whitespace-nowrap'>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DESKTOP HEADER ────────────────────────────────────────── */}
      <div className='hidden md:block max-w-screen-content mx-auto content-padding'>
        <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 lg:gap-8'>
          {/* Left: heading */}
          <div className='flex flex-col gap-2'>
            <p className='text-[12px] font-semibold tracking-wider text-navy'>
              START YOUR JOURNEY
            </p>
            <h2 className='text-4xl font-bold leading-none text-primary'>
              How It Works
            </h2>
          </div>

          {/* Right: numbered step pills */}
          <div className='flex items-center gap-12 lg:pt-2'>
            {steps.map((step, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div
                  className={`${step.dotClass} flex items-center justify-center size-7 rounded-full shrink-0`}
                >
                  <span className='text-xs font-bold text-white'>
                    {index + 1}
                  </span>
                </div>
                <span className='text-sm font-semibold text-navy whitespace-nowrap'>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE CAROUSEL ───────────────────────────────────────── */}
      <div className='md:hidden mt-8'>
        <Carousel opts={{ align: 'start' }} className='w-full min-w-0'>
          <CarouselContent className='pl-5 gap-4'>
            {cards.map((card, index) => (
              <CarouselItem
                key={card.href}
                className={`basis-[82%] shrink-0${index === cards.length - 1 ? ' mr-5' : ''}`}
              >
                <HowItWorksCard {...card} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className='flex justify-center mt-6 pb-4'>
            <CarouselDots
              activeClassName='bg-ocean'
              inactiveClassName='bg-neutral-lighter'
            />
          </div>
        </Carousel>
      </div>

      {/* ── DESKTOP GRID ──────────────────────────────────────────── */}
      <div className='hidden md:grid md:grid-cols-3 gap-5 max-w-screen-content mx-auto content-padding mt-10 lg:mt-12'>
        {cards.map((card) => (
          <HowItWorksCard key={card.href} {...card} />
        ))}
      </div>
    </section>
  );
}
