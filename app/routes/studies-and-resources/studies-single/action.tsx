import { ActionFunctionArgs } from "react-router-dom";

export async function action({ params }: ActionFunctionArgs) {
  const { path } = params;
  //   const group = await getGroupByPath(path);
  return path;
}
