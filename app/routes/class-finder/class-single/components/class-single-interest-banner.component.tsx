/**
 * Shown on a class page in place of the session carousel when the class has zero
 * live sessions AND its Rock "I'm Interested" toggle is on. The button opens the
 * shared "I'm interested" flow (campus → group direct add).
 */
import { ClassInterestModal } from '~/components/modals/class-interest';
import { Button } from '~/primitives/button/button.primitive';

/** Figma-matched full-width ocean banner. Primary design. */
export function ClassSingleInterestBanner({
  classValueGuid,
}: {
  classValueGuid?: string;
}) {
  return (
    <div className='flex w-full flex-col gap-6 bg-ocean px-6 py-8 md:flex-row md:items-center md:justify-between md:px-10 md:py-10'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-2xl font-extrabold leading-tight text-white'>
          No Current Sessions Available
        </h3>
        <p className='text-white/80'>
          Express your interest and we&apos;ll let you know when this class is
          offered at a campus near you or online.
        </p>
      </div>

      <ClassInterestModal classValueGuid={classValueGuid}>
        <Button
          intent='primary'
          className='bg-navy border-navy w-full shrink-0 md:w-auto md:min-w-48'
        >
          I am interested
        </Button>
      </ClassInterestModal>
    </div>
  );
}

/**
 * Alternate card-style design (white card with shadow).
 * Swap this in for ClassSingleInterestBanner in upcoming-sections.partial.tsx
 * if you want the card look instead of the full-width banner.
 */
export function ClassSingleInterestBannerCard() {
  return (
    <div className='flex w-full max-w-[1296px] flex-col gap-6 rounded-lg bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between md:p-8'>
      <div className='flex flex-col gap-2'>
        <h3 className='text-2xl font-extrabold leading-tight'>
          No Current Live Sessions Available
        </h3>
        <p className='text-text-secondary'>
          Express your interest and we&apos;ll let you know when this class is
          offered at a campus near you or online.
        </p>
      </div>

      <ClassInterestModal>
        <Button
          intent='primary'
          className='w-full shrink-0 md:w-auto md:min-w-48'
        >
          I am interested
        </Button>
      </ClassInterestModal>
    </div>
  );
}
