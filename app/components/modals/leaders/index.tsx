import { cn } from '~/lib/utils';
import { HTMLRenderer } from '~/primitives/html-renderer/html-renderer.component';
import * as Avatar from '@radix-ui/react-avatar';
import { CircleLoader } from '~/primitives/loading-states/circle-loader.primitive';
import type { LeaderProfile } from '~/routes/about/components/leaders-data';

export const LeadersModal = ({ leader }: { leader: LeaderProfile }) => {
  return (
    <div
      className={cn(
        'overflow-hidden',
        'max-w-screen-content',
        'max-h-[85vh]',
        'overflow-y-auto',
        'xl:!w-6xl',
        'lg:w-4xl',
        'md:w-2xl',
        'sm:w-lg',
        'w-[350px]'
      )}
    >
      <div className="h-full flex flex-col w-full rounded-xl">
        <div className="w-full p-4 md:p-10 md:pt-8 flex-shrink-0 pb-12">
          <div className="flex flex-col gap-5 md:gap-8 font-light text-neutral-700 w-full">
            {/* Desktop layout */}
            <div className="hidden md:flex flex-col gap-5">
              <Avatar.Root>
                <Avatar.Image
                  className="size-32 object-cover object-center rounded-[32px]"
                  src={leader.profilePhoto}
                  alt={leader.fullName}
                />
                <Avatar.Fallback className="flex size-full">
                  <CircleLoader size={32} />
                </Avatar.Fallback>
              </Avatar.Root>
              <div>
                <h2 className="text-2xl font-semibold">{leader.fullName}</h2>
                {leader.jobTitle && <h3 className="text-lg">{leader.jobTitle}</h3>}
              </div>
              {leader.bio && <HTMLRenderer html={leader.bio} />}
            </div>

            {/* Mobile layout */}
            <div className="flex md:hidden flex-col gap-4 w-full">
              <div className="flex gap-4 items-center">
                <Avatar.Root>
                  <Avatar.Image
                    className="w-full h-auto min-w-20 max-w-32 object-cover object-center rounded-[32px]"
                    src={leader.profilePhoto}
                    alt={leader.fullName}
                  />
                  <Avatar.Fallback className="flex size-full">
                    <CircleLoader size={20} />
                  </Avatar.Fallback>
                </Avatar.Root>
                <div>
                  <h2 className="text-2xl font-semibold">{leader.fullName}</h2>
                  {leader.jobTitle && <h3 className="text-lg">{leader.jobTitle}</h3>}
                </div>
              </div>
              {leader.bio && (
                <p>
                  <HTMLRenderer html={leader.bio} />
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
