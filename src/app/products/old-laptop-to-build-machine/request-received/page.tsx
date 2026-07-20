import type { Metadata } from "next";
import RequestReceived from "./RequestReceived";

// Confirmation page for a submitted device request. The confirmation details
// come from sessionStorage (written by the form on success) so nothing
// personal ever rides in a URL. Without a stored confirmation, the page says
// so plainly instead of inventing one.

export const metadata: Metadata = {
  title: "Request received",
  description:
    "Your Open Mirror device request was submitted for review. Please do not ship your device yet.",
  robots: { index: false, follow: false },
};

export default function RequestReceivedPage() {
  return <RequestReceived />;
}
