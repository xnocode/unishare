import { DesignPage } from "@/components/design/design-page";
import content from "@/design-content/my-rentals-empty";

export const metadata = { title: content.title };

export default function Page() {
  return <DesignPage content={content} />;
}
