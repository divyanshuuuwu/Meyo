
"use client";

import { useState } from "react";
import {
  Search,
  Send,
  Video,
  MoreVertical,
  ArrowLeft,
  Smile,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Sarah",
    image: "https://i.pravatar.cc/150?img=47",
    lastMessage: "That sounds fun 😄",
    time: "10:42 PM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Emily",
    image: "https://i.pravatar.cc/150?img=32",
    lastMessage: "See you tomorrow!",
    time: "8:15 PM",
    unread: 0,
    online: true,
  },
  {
    id: 3,
    name: "Sophie",
    image: "https://i.pravatar.cc/150?img=44",
    lastMessage: "Haha yeah 😂",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 4,
    name: "Mia",
    image: "https://i.pravatar.cc/150?img=45",
    lastMessage: "I love that place!",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
];

const messages = [
  {
    id: 1,
    sender: "them",
    text: "Hey! How's your day going?",
    time: "10:35 PM",
  },
  {
    id: 2,
    sender: "me",
    text: "Pretty good! Just finished some work 😄",
    time: "10:37 PM",
  },
  {
    id: 3,
    sender: "them",
    text: "Nice! What do you do?",
    time: "10:38 PM",
  },
  {
    id: 4,
    sender: "me",
    text: "I'm a software developer.",
    time: "10:39 PM",
  },
  {
    id: 5,
    sender: "them",
    text: "Oh that's cool! I've always wanted to learn coding.",
    time: "10:40 PM",
  },
  {
    id: 6,
    sender: "me",
    text: "I can teach you sometime 😂",
    time: "10:41 PM",
  },
  {
    id: 7,
    sender: "them",
    text: "That sounds fun 😄",
    time: "10:42 PM",
  },
];

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [message, setMessage] = useState("");

  function handleSendMessage() {
    if (!message.trim()) return;

    console.log("Message:", message);

    setMessage("");
  }

  return (
    <div className="flex h-[calc(100vh-0px)] min-h-0 bg-[#080808] text-white">
      {/* Conversations sidebar */}
      <div className="flex w-[360px] shrink-0 flex-col border-r border-[#1f1f1f] bg-[#0b0b0b]">
        {/* Header */}
        <div className="border-b border-[#1f1f1f] px-6 pb-5 pt-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Messages
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Your conversations
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="flex h-11 items-center gap-3 rounded-xl border border-[#242424] bg-[#151515] px-3">
            <Search className="h-4 w-4 text-gray-500" />

            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const active =
              selectedChat.id === conversation.id;

            return (
              <button
                key={conversation.id}
                onClick={() => setSelectedChat(conversation)}
                className={`flex w-full items-center gap-3 border-b border-[#171717] px-5 py-4 text-left transition ${
                  active
                    ? "bg-[#171717]"
                    : "hover:bg-[#121212]"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={conversation.image}
                    alt={conversation.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />

                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0b0b0b] bg-green-500" />
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate text-sm font-medium">
                      {conversation.name}
                    </h3>

                    <span className="shrink-0 text-[11px] text-gray-600">
                      {conversation.time}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-gray-500">
                      {conversation.lastMessage}
                    </p>

                    {conversation.unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-pink-500 px-1.5 text-[10px] font-semibold text-white">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat section */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Chat header */}
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-[#1f1f1f] bg-[#0b0b0b] px-6">
          <div className="flex items-center gap-3">
            {/* Mobile back button */}
            <button className="hidden rounded-lg p-2 text-gray-400 hover:bg-[#181818] hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div className="relative">
              <img
                src={selectedChat.image}
                alt={selectedChat.name}
                className="h-11 w-11 rounded-full object-cover"
              />

              {selectedChat.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0b0b0b] bg-green-500" />
              )}
            </div>

            <div>
              <h2 className="text-sm font-semibold">
                {selectedChat.name}
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                {selectedChat.online
                  ? "Online now"
                  : "Offline"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Video call */}
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#181818] hover:text-pink-400">
              <Video className="h-5 w-5" />
            </button>

            {/* More */}
            <button className="flex h-10 w-10 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#181818] hover:text-white">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            {/* Date */}
            <div className="mb-4 flex items-center justify-center">
              <span className="rounded-full bg-[#151515] px-3 py-1 text-[11px] text-gray-600">
                Today
              </span>
            </div>

            {messages.map((msg) => {
              const isMe = msg.sender === "me";

              return (
                <div
                  key={msg.id}
                  className={`flex ${
                    isMe
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] ${
                      isMe ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                        isMe
                          ? "rounded-br-md bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                          : "rounded-bl-md bg-[#181818] text-gray-200"
                      }`}
                    >
                      {msg.text}
                    </div>

                    <span className="mt-1 px-1 text-[10px] text-gray-600">
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message input */}
        <div className="border-t border-[#1f1f1f] bg-[#0b0b0b] px-6 py-4">
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl border border-[#292929] bg-[#151515] px-4 transition focus-within:border-pink-500/40">
              <input
                type="text"
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                placeholder={`Message ${selectedChat.name}...`}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
              />

              <button className="text-gray-500 transition hover:text-pink-400">
                <Smile className="h-5 w-5" />
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
