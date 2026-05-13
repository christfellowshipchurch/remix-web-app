import { GroupConnectModal } from '~/components/modals/group-connect/group-connect-modal';
import { Button } from '~/primitives/button/button.primitive';

export function GroupSingleInterestCta({ groupId }: { groupId: string }) {
  return (
    <div className='hidden md:flex w-full content-padding pt-10 lg:pt-16 justify-center'>
      <div className='w-full max-w-screen-content'>
        <div className='flex items-center gap-6 rounded-2xl border border-neutral-lighter bg-white p-8 lg:p-12 shadow-[0_2px_8px_rgba(0,0,0,0.04)]'>
          <div className='flex flex-1 flex-col gap-2'>
            <h3 className='text-xl lg:text-[32px] font-extrabold mb-2'>
              Interested In This Group?
            </h3>
            <p className='text-text-secondary md:text-base lg:text-lg max-w-3xl'>
              Want to learn more or see if this group is a good fit for you? Let
              the group leaders know you're interested and they'll reach out
              with more details, answer questions, and help you get connected.
            </p>
          </div>

          <GroupConnectModal
            groupId={groupId}
            buttonText="I'm Interested"
            ModalButton={(props) => (
              <Button
                intent='primary'
                className='shrink-0 min-w-0 px-5 lg:px-6 min-h-0 py-3 text-base lg:text-lg'
                {...props}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
}
