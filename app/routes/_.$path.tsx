import { PageBuilderRoute } from "./page-builder/page-builder-page";
import { NotFound } from "~/components/not-found";

export { loader } from "./page-builder/loader";
export { meta } from "./page-builder/meta";

//  Added as extra error boundary to catch 404s, might not be needed
export function ErrorBoundary() {
  return <NotFound />;
}

export default PageBuilderRoute;
