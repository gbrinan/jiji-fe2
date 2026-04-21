import ChatClient from "./ChatClient";

// With output:"export" + Capacitor, we cannot SSR per-session pages.
// We pre-render a single "_" placeholder and rely on Vercel rewrites
// (vercel.json) to serve this page for every /chat/:uuid URL. The
// ChatClient reads the real sessionId from window.location on the client.
export function generateStaticParams() {
  return [{ sessionId: "_" }];
}

export const dynamicParams = false;

export default function ChatConversationPage() {
  return <ChatClient />;
}
