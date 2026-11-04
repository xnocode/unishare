import { DesignPage } from "@/components/design/design-page";
import content from "@/design-content/sos-request-failed";

export const metadata = { title: content.title };

export default function Page() {
  return <DesignPage content={content} />;
}
