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
      { id: "m1", text: "Hi! I saw your listing in Indiranagar. Is the master bedroom still available?", sender: "me", time: "10:30 AM" },
      { id: "m2", text: "Yes, it is! We love the vibe of your profile. Would you like to schedule a visit?", sender: "them", time: "10:45 AM" },
      { id: "m3", text: "The flat is available for viewing this weekend Saturday afternoon.", sender: "them", time: "10:46 AM" },
    ]
  },
  {
    id: "2",
    name: "Arjun Mehta",
    lastMessage: "Sure, I can share the WiFi speed test results",
    timestamp: "1h ago",
    unread: 0,
    messages: [
      { id: "m4", text: "Hey Arjun, what is the internet speed at the flat? I work remotely full time.", sender: "me", time: "9:00 AM" },
      { id: "m5", text: "Sure! We have a 300 Mbps fiber connection with dual-band routers.", sender: "them", time: "9:30 AM" },
    ]
  },
  {
    id: "3",
    name: "Kavitha Rajan",
    lastMessage: "The deposit is negotiable for longer stays",
    timestamp: "3h ago",
    unread: 1,
    messages: [
      { id: "m6", text: "Hi Kavitha, is the security deposit amount fixed or negotiable?", sender: "me", time: "7:00 AM" },
      { id: "m7", text: "The deposit is negotiable for stays of 12 months or longer!", sender: "them", time: "8:15 AM" },
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
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: newMsg.text, timestamp: "Just now" }
          : c
      )
    );
    setInputValue("");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 font-sans text-stone-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-coral-100 text-coral-600 font-bold">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900">Direct Messages</h1>
            <p className="text-xs text-stone-500">Connect with verified flatmates and hosts</p>
          </div>
        </div>
        <Link href="/browse" className="text-xs font-semibold text-stone-500 hover:text-coral-600 transition">
          Back to Explore
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-[calc(100vh-210px)] bento-card overflow-hidden shadow-warm-lg">
        {/* Conversation List */}
        <div className={`lg:col-span-4 border-r border-stone-200 overflow-y-auto bg-white ${showSidebar ? "block" : "hidden lg:block"}`}>
          <div className="p-3.5 border-b border-stone-100 bg-[#fcfbf9]">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Conversations ({conversations.length})</span>
          </div>
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => { setActiveId(conv.id); setShowSidebar(false); }}
              className={`w-full text-left p-4 border-b border-stone-100 transition hover:bg-stone-50 ${
                activeId === conv.id ? "bg-coral-50/50 border-l-4 border-l-coral-500" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-bold text-sm ${
                  activeId === conv.id
                    ? "bg-coral-500 text-white"
                    : "bg-stone-100 text-stone-700"
                }`}>
                  {conv.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm truncate flex items-center gap-1">
                      {conv.name}
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    </span>
                    <span className="text-[11px] text-stone-400 shrink-0 ml-2">{conv.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-stone-500 truncate text-xs">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                      <span className="ml-2 shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-coral-500 text-white text-[10px] font-bold">
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
        <div className={`lg:col-span-8 flex flex-col bg-[#faf9f6] ${!showSidebar ? "block" : "hidden lg:flex"}`}>
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowSidebar(true)}
                    className="lg:hidden text-stone-500 hover:text-stone-800"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral-100 text-coral-600 font-bold text-sm">
                    {activeConversation.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-stone-900 text-sm flex items-center gap-1">
                      {activeConversation.name}
                      <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    </p>
                    <p className="text-xs text-stone-400 flex items-center gap-1">
                      <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Active Now • Verified Resident
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {activeConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl p-3.5 shadow-sm text-xs leading-relaxed ${
                        msg.sender === "me"
                          ? "bg-coral-500 text-white rounded-br-none"
                          : "bg-white text-stone-800 border border-stone-200/80 rounded-bl-none"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 text-right ${msg.sender === "me" ? "text-coral-100" : "text-stone-400"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-stone-200 bg-white">
                <div className="flex items-center gap-2">
                  <input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type your message..."
                    className="neo-input flex-1 px-4 py-3 text-xs"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputValue.trim()}
                    className="neo-button px-5 py-3 flex items-center gap-1.5 text-xs font-bold disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-stone-400 text-sm">
              <p>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
