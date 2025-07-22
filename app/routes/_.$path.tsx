import { PageBuilderRoute } from "./page-builder/page-builder-page";
import { NotFound } from "~/components/not-found";

export { loader } from "./page-builder/loader";

export function CatchBoundary() {
  return <NotFound />;
}

export default PageBuilderRoute;
