"use client";

import { useState, useRef, useEffect } from "react";
import { Send, ShieldCheck, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: Message[];
}

const DEMO_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Priya Sharma",
    lastMessage: "The flat is available for viewing this weekend",
    timestamp: "2m ago",
    unread: 2,
    messages: [
      { id: "m1", text: "Hi, I saw your listing in Indiranagar. Is it still available?", sender: "me", time: "10:30 AM" },
      { id: "m2", text: "Yes, it is! Would you like to schedule a visit?", sender: "them", time: "10:45 AM" },
      { id: "m3", text: "The flat is available for viewing this weekend", sender: "them", time: "10:46 AM" },
    ]
  },
  {
    id: "2",
    name: "Arjun Mehta",
    lastMessage: "Sure, I can share the WiFi speed test results",
    timestamp: "1h ago",
    unread: 0,
    messages: [
      { id: "m4", text: "What is the internet speed at the flat?", sender: "me", time: "9:00 AM" },
      { id: "m5", text: "Sure, I can share the WiFi speed test results", sender: "them", time: "9:30 AM" },
    ]
  },
  {
    id: "3",
    name: "Kavitha Rajan",
    lastMessage: "The deposit is negotiable for longer stays",
    timestamp: "3h ago",
    unread: 1,
    messages: [
      { id: "m6", text: "Is the deposit amount fixed?", sender: "me", time: "7:00 AM" },
      { id: "m7", text: "The deposit is negotiable for longer stays", sender: "them", time: "8:15 AM" },
    ]
  }
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(DEMO_CONVERSATIONS);
  const [activeId, setActiveId] = useState<string>("1");
  const [inputValue, setInputValue] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === activeId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages.length]);

  function sendMessage() {
    if (!inputValue.trim() || !activeId) return;

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      text: inputValue.trim(),
      sender: "me",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, timestamp: "now" }
          : c
      )
    );
    setInputValue("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 font-mono text-xs">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-5 w-5 text-phosphor" />
          <h1 className="text-xl font-black uppercase text-white">COMMS_CENTER</h1>
          <span className="sticker-pill border-phosphor bg-phosphor/10 text-phosphor text-[10px]">
            {conversations.reduce((sum, c) => sum + c.unread, 0)} UNREAD
          </span>
        </div>
        <Link href="/browse" className="text-steel-muted hover:text-phosphor transition text-[11px]">
          [ RETURN_TO_DIRECTORY ]
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-[calc(100vh-200px)] bento-card overflow-hidden">
        {/* Conversation List */}
        <div className={`lg:col-span-4 border-r border-tungsten-border overflow-y-auto ${showSidebar ? "block" : "hidden lg:block"}`}>
          <div className="p-3 border-b border-tungsten-border">
            <span className="text-steel-muted text-[10px] font-bold uppercase">ACTIVE_CHANNELS [{conversations.length}]</span>
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setActiveId(conv.id); setShowSidebar(false); }}
              className={`w-full text-left p-4 border-b border-tungsten-border transition hover:bg-tungsten-card ${
                activeId === conv.id ? "bg-tungsten-card border-l-2 border-l-phosphor" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                  activeId === conv.id
                    ? "bg-phosphor/10 border border-phosphor/30 text-phosphor"
                    : "bg-tungsten border border-tungsten-border text-steel"
                }`}>
                  {conv.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm truncate flex items-center gap-1">
                      {conv.name}
                      <ShieldCheck className="h-3 w-3 text-phosphor shrink-0" />
                    </span>
                    <span className="text-[10px] text-steel-muted shrink-0 ml-2">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-steel-muted truncate text-[11px]">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-phosphor text-obsidian text-[10px] font-black">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Chat View */}
        <div className={`lg:col-span-8 flex flex-col ${!showSidebar ? "block" : "hidden lg:flex"}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-tungsten-border bg-tungsten">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden text-steel-muted hover:text-phosphor"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-phosphor/10 border border-phosphor/30 text-phosphor font-black text-sm">
                    {activeConversation.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm flex items-center gap-1">
                      {activeConversation.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-phosphor" />
                    </p>
                    <p className="text-[10px] text-steel-muted flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-phosphor animate-pulse" />
                      NODE_ACTIVE
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg p-3 ${
                        msg.sender === "me"
                          ? "bg-phosphor/15 border border-phosphor/30 text-slate-100"
                          : "bg-tungsten-card border border-tungsten-border text-slate-200"
                      }`}
                    >
                      <p className="text-xs leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "me" ? "text-phosphor/60" : "text-steel-muted"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-tungsten-border bg-tungsten">
                <div className="flex items-center gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type message..."
                    className="neo-input flex-1 p-3 text-xs"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim()}
                    className="neo-button px-4 py-3 flex items-center gap-1.5 text-xs font-bold disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                    <span className="hidden sm:inline">SEND</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-steel-muted">
              <p>[ SELECT_A_CHANNEL_TO_BEGIN ]</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
