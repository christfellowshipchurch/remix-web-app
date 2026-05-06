import { useLoaderData, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

import { useCopyPagePath } from '~/hooks/use-copy-page-path';
import { Button } from '~/primitives/button/button.primitive';

import { VolunteerDetailNav } from '../components/volunteer-detail/volunteer-detail-nav.component';
import { VolunteerDetailHero } from '../components/volunteer-detail/volunteer-detail-hero.component';
import { ChurchSidebarShell } from './components/church-sidebar-shell.component';
import { ChurchRoleSelector } from './components/church-role-selector.component';
import {
  ChurchIntro,
  ChurchNotSureLink,
  ChurchMobileContinueBar,
} from './partials/church-serving-area-partials.partial';
import type { LoaderReturnType } from './loader';

export function ChurchServingAreaPage() {
  const { bucket, roles } = useLoaderData<LoaderReturnType>();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const hasSelectedRole = Boolean(selectedRoleId?.trim());

  const { copyPath, copied } = useCopyPagePath();

  const onBack = useCallback(() => {
    navigate('/volunteer#church');
  }, [navigate]);

  const onContinue = useCallback(() => {
    if (!selectedRoleId?.trim()) return;
    navigate('/volunteer#community');
  }, [navigate, selectedRoleId]);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`min-h-screen ${
        isVisible ? 'animate-fadeIn duration-400' : 'opacity-0'
      }`}
    >
      <article className='flex min-h-screen flex-col bg-white'>
        <VolunteerDetailNav
          copied={copied}
          onCopyPath={copyPath}
          onBack={onBack}
        />

        <VolunteerDetailHero
          title={bucket.name}
          coverImage={bucket.image}
          onBack={onBack}
        />

        <div className='min-h-0 flex-1 content-padding w-full pb-0 py-4 md:py-12 lg:mt-6'>
          <div className='grid grid-cols-1 gap-10 md:grid-cols-7 md:items-start md:gap-14 mx-auto max-w-content x-5 lg:px-10 mb-10'>
            <div className='min-w-0 space-y-6 space-x-10 col-span-3'>
              <ChurchIntro
                name={bucket.name}
                tag={bucket.tag}
                description={
                  "Take a look at the options below, pick the one that excites you the most, and then hit 'Continue' to complete your application."
                }
              />
              <div className='hidden md:block'>
                <ChurchNotSureLink />
              </div>

              {/* Role selector — visible below intro on mobile */}
              <div className='md:hidden'>
                <ChurchRoleSelector
                  roles={roles}
                  selectedRoleId={selectedRoleId}
                  onSelect={setSelectedRoleId}
                />
                <ChurchNotSureLink />
              </div>
            </div>

            {/* Desktop role selector + Continue in sidebar */}
            <div className='hidden md:block col-span-4 pl-3'>
              <ChurchSidebarShell>
                <ChurchRoleSelector
                  roles={roles}
                  selectedRoleId={selectedRoleId}
                  onSelect={setSelectedRoleId}
                />
              </ChurchSidebarShell>
            </div>
          </div>
        </div>

        <div className='w-full hidden md:block border-t border-neutral-lighter/50 content-padding pt-6 pb-8'>
          <div className='mx-auto w-full max-w-content flex justify-end px-5 md:px-10'>
            <Button
              intent='primary'
              type='button'
              onClick={onContinue}
              disabled={!hasSelectedRole}
              className='w-[280px] text-white hover:bg-ocean/80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40'
            >
              Continue
            </Button>
          </div>
        </div>

        <ChurchMobileContinueBar
          hasSelectedRole={hasSelectedRole}
          onContinue={onContinue}
        />
      </article>
    </div>
  );
}
