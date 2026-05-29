import { useLoaderData } from 'react-router-dom';
import { RockProxyEmbed } from '~/components/rock-embed';
import { loader } from './loader';
import { meta } from './meta';

export { meta };
export { loader };

export default function RockPage() {
  const { url } = useLoaderData<typeof loader>();
  return (
    <div className='w-full max-w-screen-content mx-auto px-4 py-8'>
      <RockProxyEmbed url={url} height={800} showLoading />
    </div>
  );
}
