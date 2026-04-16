import ChatClient from "./ChatClient";

export function generateStaticParams() {
  return [{ sessionId: "_" }];
}

export const dynamicParams = false;

export default function ChatConversationPage() {
  return <ChatClient />;
}
