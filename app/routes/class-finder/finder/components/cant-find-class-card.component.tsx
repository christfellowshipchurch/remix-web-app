/**
 * "Can't find a class?" CTA card shown in the class finder results.
 * - `gridCell`: occupies one cell in the results grid (matches `ClassHitComponent`).
 * - `empty`: centered, wider block shown alone when a search/filter returns no results.
 *
 * The "Let Us Know" button opens the shared "I'm interested" flow.
 */
import { ClassInterestModal } from '~/components/modals/class-interest';
import { cn } from '~/lib/utils';
import { Button } from '~/primitives/button/button.primitive';

export function CantFindClassCard({
  variant = 'gridCell',
}: {
  variant?: 'gridCell' | 'empty';
}) {
  const isEmpty = variant === 'empty';

  return (
    <div
      className={cn(
        'flex h-full w-full flex-col justify-center gap-4 rounded-lg bg-white',
        isEmpty
          ? 'mx-auto max-w-[600px] items-center p-8 text-center md:p-12'
          : 'mx-auto max-w-[360px] items-start p-6 md:max-w-[300px] lg:max-w-[333px] xl:max-w-[300px]',
      )}
      style={{
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <p className='w-fit rounded-sm bg-[#F59E0B]/10 px-2 py-1 text-xs font-semibold uppercase text-[#F59E0B]'>
        Can&apos;t Find a Class?
      </p>

      <div className='flex flex-col gap-2'>
        <h3 className='text-lg font-bold leading-tight'>
          Tell Us What You&apos;re Looking For
        </h3>
        <p className='text-sm text-black'>
          If enough people are interested, we may offer this class in a future
          season. Let us know and we&apos;ll keep you posted.
        </p>
      </div>

      <ClassInterestModal>
        <Button intent='primary' size='md' className={`bg-[#F59E0B] border-[#F59E0B] hover:bg-[#F59E0B]/90 ${isEmpty ? '' : 'w-full'}`}>
          Let Us Know
        </Button>
      </ClassInterestModal>
    </div>
  );
}
