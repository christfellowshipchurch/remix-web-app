import {
  type LoaderFunction,
  data,
  useLoaderData,
  useSearchParams,
} from 'react-router-dom';

const ROCK_PERSON_ID_QUERY_PARAMS = ['rckipid', 'rckpid'];

type LoaderData = {
  rawQueryString: string;
  rawParams: { key: string; value: string }[];
};

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const rawParams = Array.from(url.searchParams.entries()).map(
    ([key, value]) => ({ key, value }),
  );

  console.warn('[testing-rckpid] request received', {
    rawQueryString: url.search,
    rawParams,
  });

  return data<LoaderData>({ rawQueryString: url.search, rawParams });
};

export default function TestingRckpidPage() {
  const { rawQueryString, rawParams } = useLoaderData<LoaderData>();
  const [searchParams] = useSearchParams();

  const rckpidParam = ROCK_PERSON_ID_QUERY_PARAMS.map((name) => ({
    name,
    value: searchParams.get(name),
  })).find((entry) => entry.value);

  return (
    <div className='mx-auto max-w-screen-sm px-6 py-20 text-left'>
      <h1 className='mb-4 text-2xl font-bold'>rckpid Testing Page</h1>

      <section className='mb-6 rounded border border-neutral-light bg-green-50 p-3 text-sm'>
        <p className='font-semibold'>
          Server-side URL params (as received by the loader)
        </p>
        <p>raw query string: {rawQueryString || '(empty)'}</p>
        {rawParams.length === 0 ? (
          <p>none</p>
        ) : (
          rawParams.map(({ key, value }) => (
            <p key={key}>
              {key}: {value || '(empty)'}
            </p>
          ))
        )}
      </section>

      <section className='mb-6 rounded border border-neutral-light bg-gray-50 p-3 text-sm'>
        <p className='font-semibold'>
          Client-side URL params (as received by the browser)
        </p>
        {Array.from(searchParams.entries()).length === 0 ? (
          <p>none</p>
        ) : (
          Array.from(searchParams.entries()).map(([key, value]) => (
            <p key={key}>
              {key}: {value || '(empty)'}
            </p>
          ))
        )}
      </section>

      <section className='rounded border border-neutral-light bg-amber-50 p-3 text-sm'>
        <p className='font-semibold'>rckpid/rckipid detected</p>
        <p>
          {rckpidParam ? `${rckpidParam.name} = ${rckpidParam.value}` : 'none'}
        </p>
      </section>
    </div>
  );
}
