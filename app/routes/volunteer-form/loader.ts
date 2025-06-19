import { LoaderFunctionArgs } from "react-router-dom";

export async function loader({ request }: LoaderFunctionArgs) {
  return Response.json({});
}
