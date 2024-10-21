import { LoaderFunctionArgs } from "@remix-run/node";

// https://remix.run/docs/en/1.19.3/route/should-revalidate
export async function loader({ params }: LoaderFunctionArgs) {
  const address = params;
  return { address };
}
