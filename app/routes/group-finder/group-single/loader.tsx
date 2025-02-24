import { LoaderFunctionArgs } from "react-router";

export async function loader({ params }: LoaderFunctionArgs) {
  const { path } = params;
  //   const group = await getGroupByPath(path);
  return path;
}
