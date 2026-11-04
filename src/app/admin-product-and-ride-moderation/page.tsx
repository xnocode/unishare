import { DesignPage } from "@/components/design/design-page";
import content from "@/design-content/admin-product-and-ride-moderation";

export const metadata = { title: content.title };

export default function Page() {
  return <DesignPage content={content} />;
}
