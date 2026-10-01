"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Send,
  Video,
  MoreVertical,
  ArrowLeft,
  Smile,
} from "lucide-react";
import { socket } from "@/lib/socket";

type Conversation = {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  conversationId: string;
  senderId: string;
};

type SendMessageResponse = {
  success: boolean;
  message?: Message;
  error?: string;
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedChat, setSelectedChat] = useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);

  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socketConnected, setSocketConnected] = useState(socket.connected);
  const [sendingMessage, setSendingMessage] = useState(false);

  /*
   * Fetch conversations when page loads.
   */
  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch("/api/conversations");

        if (!response.ok) {
          throw new Error("Failed to fetch conversations");
        }

        const data = await response.json();

        setCurrentUserId(data.userId);
        setConversations(data.conversations);

        /*
         * Automatically select the first conversation.
         */
        if (data.conversations.length > 0) {
          setSelectedChat(data.conversations[0]);
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoadingConversations(false);
      }
    }

    fetchConversations();
  }, []);

  /*
   * Connect to Socket.IO.
   */
  useEffect(() => {
    function handleConnect() {
      console.log("SOCKET CONNECTED:", socket.id);

      setSocketConnected(true);
    }

    function handleDisconnect(reason: string) {
      console.log("SOCKET DISCONNECTED:", reason);

      setSocketConnected(false);
    }

    function handleConnectError(error: Error) {
      console.error("SOCKET CONNECTION ERROR:", error);

      setSocketConnected(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);

    /*
     * Connect if the socket isn't already connected.
     */
    if (!socket.connected) {
      console.log("Connecting to Socket.IO...");
      socket.connect();
    } else {
      setSocketConnected(true);
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, []);

  /*
   * Listen for real-time messages.
   */
  useEffect(() => {
    function handleNewMessage(newMessage: Message) {
      console.log("NEW MESSAGE RECEIVED:", newMessage);

      /*
       * If the message belongs to the currently
       * selected conversation, add it to the chat.
       */
      if (selectedChat && newMessage.conversationId === selectedChat.id) {
        setMessages((prev) => {
          /*
           * Prevent duplicate messages.
           */
          const alreadyExists = prev.some(
            (message) => message.id === newMessage.id,
          );

          if (alreadyExists) {
            return prev;
          }

          return [...prev, newMessage];
        });
      }

      /*
       * Update the conversation sidebar.
       */
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== newMessage.conversationId) {
            return conversation;
          }

          const isCurrentConversation =
            selectedChat?.id === newMessage.conversationId;

          return {
            ...conversation,
            lastMessage: newMessage.content,
            time: newMessage.createdAt,
            unread: isCurrentConversation ? 0 : conversation.unread + 1,
          };
        }),
      );
    }

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [selectedChat]);

  /*
   * Fetch messages whenever the selected
   * conversation changes.
   */
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const conversationId = selectedChat.id;

    async function fetchMessages() {
      setLoadingMessages(true);

      try {
        const response = await fetch(
          `/api/conversations/${conversationId}/messages`,
        );

        if (!response.ok) {
          throw new Error("Failed to fetch messages");
        }

        const data = await response.json();

        setMessages(data.messages);

        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? {
                  ...conversation,
                  unread: 0,
                }
              : conversation,
          ),
        );
      } catch (error) {
        console.error("Failed to load messages:", error);

        setMessages([]);
      } finally {
        setLoadingMessages(false);
      }
    }

    fetchMessages();
  }, [selectedChat]);

  /*
   * Actually emit the message to Socket.IO.
   */
  function emitMessage(conversationId: string, content: string) {
    console.log("EMITTING MESSAGE:", {
      conversationId,
      content,
    });

    socket.emit(
      "send-message",
      {
        conversationId,
        content,
      },
      (response: SendMessageResponse) => {
        console.log("SEND MESSAGE RESPONSE:", response);

        setSendingMessage(false);

        if (!response?.success) {
          console.error("MESSAGE SEND FAILED:", response?.error);

          return;
        }

        console.log("MESSAGE SENT SUCCESSFULLY:", response.message);
      },
    );
  }

  /*
   * Send message.
   */
  function handleSendMessage() {
    const content = message.trim();

    console.log("SEND BUTTON CLICKED");

    if (!content) {
      return;
    }

    if (!selectedChat) {
      console.error("No conversation selected");

      return;
    }

    if (sendingMessage) {
      return;
    }

    const conversationId = selectedChat.id;

    setSendingMessage(true);
    setMessage("");

    /*
     * Socket is already connected.
     */
    if (socket.connected) {
      emitMessage(conversationId, content);

      return;
    }

    /*
     * Socket isn't connected yet.
     *
     * Connect first, then send the message.
     */
    console.log("Socket not connected. Connecting before sending...");

    const handleConnectedAndSend = () => {
      console.log("Socket connected. Sending queued message...");

      socket.off("connect", handleConnectedAndSend);

      emitMessage(conversationId, content);
    };

    socket.once("connect", handleConnectedAndSend);

    socket.connect();

    /*
     * If connection fails, don't leave the UI
     * stuck in the sending state.
     */
    socket.once("connect_error", () => {
      socket.off("connect", handleConnectedAndSend);

      setSendingMessage(false);

      console.error("Unable to connect to messaging server.");
    });
  }

  /*
   * Format message time.
   */
  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  /*
   * Loading state.
   */
  if (loadingConversations) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#080808] text-gray-500">
        Loading conversations...
      </div>
    );
  }

  return (
    <div className="flex h-screen min-h-0 bg-[#080808] text-white">
      {/* Conversations sidebar */}
      <div className="flex w-[360px] shrink-0 flex-col border-r border-[#1f1f1f] bg-[#0b0b0b]">
        {/* Header */}
        <div className="border-b border-[#1f1f1f] px-6 pb-5 pt-7">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                Messages
              </h1>

              <p className="mt-1 text-sm text-gray-500">Your conversations</p>
            </div>

            <div
              className={`h-2.5 w-2.5 rounded-full ${
                socketConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={socketConnected ? "Connected" : "Disconnected"}
            />
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
          {conversations.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              No conversations yet.
            </div>
          ) : (
            conversations.map((conversation) => {
              const active = selectedChat?.id === conversation.id;

              return (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedChat(conversation)}
                  className={`flex w-full items-center gap-3 border-b border-[#171717] px-5 py-4 text-left transition ${
                    active ? "bg-[#171717]" : "hover:bg-[#121212]"
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
                        {formatTime(conversation.time)}
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
            })
          )}
        </div>
      </div>

      {/* Chat section */}
      <div className="flex min-w-0 flex-1 flex-col">
        {!selectedChat ? (
          <div className="flex flex-1 items-center justify-center text-gray-500">
            Select a conversation
          </div>
        ) : (
          <>
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
                  <h2 className="text-sm font-semibold">{selectedChat.name}</h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    {selectedChat.online ? "Online now" : "Offline"}
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

                {loadingMessages ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="py-10 text-center text-sm text-gray-500">
                    No messages yet. Say hello 👋
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
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
                            {msg.content}
                          </div>

                          <span className="mt-1 px-1 text-[10px] text-gray-600">
                            {formatTime(msg.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Message input */}
            <div className="border-t border-[#1f1f1f] bg-[#0b0b0b] px-6 py-4">
              <div className="mx-auto flex max-w-3xl items-center gap-2">
                <div className="flex h-12 flex-1 items-center gap-2 rounded-2xl border border-[#292929] bg-[#151515] px-4 transition focus-within:border-pink-500/40">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={`Message ${selectedChat.name}...`}
                    className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                    disabled={sendingMessage}
                  />

                  <button
                    type="button"
                    className="text-gray-500 transition hover:text-pink-400"
                  >
                    <Smile className="h-5 w-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    console.log("🔥 SEND BUTTON CLICKED");
                    handleSendMessage();
                  }}
                  disabled={!message.trim()}
                  className="..."
                >
                  Send
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
