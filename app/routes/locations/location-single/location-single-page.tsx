import { useLoaderData } from 'react-router-dom';

import { LoaderReturnType } from './loader';
import { LocationSingle } from './partials/location-content';

export function LocationSinglePage() {
  const { campusHit } = useLoaderData<LoaderReturnType>();

  return (
    <div className='min-h-screen'>
      {campusHit ? <LocationSingle hit={campusHit} /> : null}
    </div>
  );
}
