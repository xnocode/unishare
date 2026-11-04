import { DesignPage } from "@/components/design/design-page";
import content from "@/design-content/login-2fa-6-digit-otp";

export const metadata = { title: content.title };

export default function Page() {
  return <DesignPage content={content} />;
}
