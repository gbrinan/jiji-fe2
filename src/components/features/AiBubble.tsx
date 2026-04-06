interface AiBubbleProps {
  children: React.ReactNode;
  showAvatar?: boolean;
}

export default function AiBubble({ children, showAvatar = true }: AiBubbleProps) {
  return (
    <div className="flex gap-2 items-start">
      {showAvatar && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center mt-1">
          <span className="text-sm">🧠</span>
        </div>
      )}
      <div className={`${showAvatar ? "" : "ml-10"}`}>
        {showAvatar && <p className="text-xs text-gray-500 mb-1">JIJI AI</p>}
        <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 text-sm text-gray-800 leading-relaxed shadow-sm max-w-[280px]">
          {children}
        </div>
      </div>
    </div>
  );
}
