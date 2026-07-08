"use client";

import Link from "next/link";
import { BedDouble, Bot, Map, MessageCircle, Send, X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  handleGenerateContent,
  type AiRecommendation,
} from "@/lib/actions/ai/gemini-action";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
  recommendations?: AiRecommendation[];
};

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hi, I am your Yeti Trek assistant. Ask me about trails, stays, bookings, packing, or trek planning.",
  },
];

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(starterMessages);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chatHistory, isOpen, isSending]);

  const handlePromptChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isSending) {
      return;
    }

    setPrompt("");
    setIsSending(true);
    setChatHistory((previousHistory) => [
      ...previousHistory,
      {
        id: Date.now(),
        role: "user",
        content: trimmedPrompt,
      },
    ]);

    const result = await handleGenerateContent(trimmedPrompt);
    const message = result.success ? result.answer : result.message;

    setChatHistory((previousHistory) => [
      ...previousHistory,
      {
        id: Date.now() + 1,
        role: "assistant",
        content: message,
        recommendations: result.success ? result.recommendations : [],
      },
    ]);
    setIsSending(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 max-sm:bottom-4 max-sm:right-4 max-sm:left-4">
      {isOpen ? (
        <section className="flex h-[560px] w-[380px] max-w-full flex-col overflow-hidden rounded-lg border border-[#e9a127]/30 bg-[#07101b] text-[#f8fafc] shadow-2xl shadow-black/40 max-sm:h-[70vh] max-sm:w-full">
          <header className="flex items-center justify-between border-b border-white/10 bg-[#090f19] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e9a127] text-[#14100a]">
                <Bot size={19} />
              </span>
              <div>
                <p className="text-sm font-black text-white">Yeti Trek AI</p>
                <p className="text-xs text-[#9aa8b8]">Trails, stays, and trek help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI chat"
              title="Close AI chat"
              className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#cbd5e1] transition hover:border-white/25 hover:bg-white/5"
            >
              <X size={18} />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {chatHistory.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[86%] rounded-lg border px-3 py-2.5 text-sm leading-6 ${
                      message.role === "user"
                        ? "border-[#e9a127]/35 bg-[#e9a127] text-[#17100a]"
                        : "border-white/10 bg-[#101822] text-[#dbe4ef]"
                    }`}
                  >
                    <p className="mb-1 text-[11px] font-black opacity-70">
                      {message.role === "user" ? "You" : "Assistant"}
                    </p>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.recommendations && message.recommendations.length > 0 ? (
                      <div className="mt-3 space-y-2">
                        {message.recommendations.map((item) => (
                          <div
                            key={`${item.type}-${item.slug}`}
                            className="rounded-lg border border-white/10 bg-[#07101b] p-2"
                          >
                            <div className="flex items-start gap-2">
                              <span className="mt-0.5 text-[#e9a127]">
                                {item.type === "stay" ? <BedDouble size={15} /> : <Map size={15} />}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-black text-white">{item.title}</p>
                                <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-[#aeb9c7]">
                                  {item.reason}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                  <Link
                                    href={item.detailHref}
                                    className="rounded-md border border-[#e9a127]/40 px-2.5 py-1 text-xs font-black text-[#f5c978] transition hover:bg-[#e9a127]/10"
                                  >
                                    View details
                                  </Link>
                                  {item.bookingHref ? (
                                    <Link
                                      href={item.bookingHref}
                                      className="rounded-md bg-[#e9a127] px-2.5 py-1 text-xs font-black text-[#17100a] transition hover:bg-[#f2b440]"
                                    >
                                      Book
                                    </Link>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}

              {isSending ? (
                <div className="flex justify-start">
                  <div className="rounded-lg border border-white/10 bg-[#101822] px-3 py-2 text-sm text-[#9aa8b8]">
                    Yeti Trek AI is typing...
                  </div>
                </div>
              ) : null}

              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-[#090f19] p-3">
            <label className="sr-only" htmlFor="yeti-ai-prompt">
              Ask Yeti Trek AI
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id="yeti-ai-prompt"
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Everest Base Camp, stays, bookings..."
                rows={2}
                className="min-h-12 flex-1 resize-none rounded-lg border border-white/10 bg-[#060b13] px-3 py-2 text-sm text-white outline-none placeholder:text-[#718096] focus:border-[#e9a127]/70"
              />
              <button
                type="submit"
                disabled={isSending || !prompt.trim()}
                aria-label="Send message"
                title="Send message"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#e9a127] text-[#14100a] transition hover:bg-[#f2b440] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        title={isOpen ? "Close AI chat" : "Open AI chat"}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#e9a127] text-[#14100a] shadow-xl shadow-black/35 transition hover:bg-[#f2b440]"
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
