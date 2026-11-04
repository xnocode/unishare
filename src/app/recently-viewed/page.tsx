import { DesignPage } from "@/components/design/design-page";
import content from "@/design-content/recently-viewed";

export const metadata = { title: content.title };

export default function Page() {
  return <DesignPage content={content} />;
}
