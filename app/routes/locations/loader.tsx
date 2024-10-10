import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const campus = params?.campus;
  return { campus };
}
