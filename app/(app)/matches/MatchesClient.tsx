"use client";

import { useEffect, useRef, useState } from "react";
import {
  X,
  Send,
  ArrowLeft,
  Loader2,
} from "lucide-react";

import { socket } from "@/lib/socket";

type MatchedUser = {
  matchId: string;
  id: string;
  name: string;
  age: number | null;
  occupation: string | null;
  location: string | null;
  images: {
    id: string;
    url: string;
    position: number;
  }[];
};

type Message = {
  id: string;
  content: string;
  createdAt: string | Date;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
  };
};

type MatchesClientProps = {
  matchedUsers?: MatchedUser[];
};

export default function MatchesClient({
  matchedUsers = [],
}: MatchesClientProps) {
  const [selectedUser, setSelectedUser] =
    useState<MatchedUser | null>(null);

  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [messageInput, setMessageInput] =
    useState("");

  const [loadingChat, setLoadingChat] =
    useState(false);

  const [sendingMessage, setSendingMessage] =
    useState(false);

  const [error, setError] = useState("");

  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleNewMessage(
      message: Message
    ) {
      console.log(
        "REAL-TIME MESSAGE RECEIVED:",
        message
      );

      if (
        message.conversationId !==
        conversationId
      ) {
        return;
      }

      setMessages((currentMessages) => {
        if (
          currentMessages.some(
            (existingMessage) =>
              existingMessage.id === message.id
          )
        ) {
          return currentMessages;
        }

        return [
          ...currentMessages,
          message,
        ];
      });
    }

    socket.on(
      "new-message",
      handleNewMessage
    );

    return () => {
      socket.off(
        "new-message",
        handleNewMessage
      );
    };
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUser) {
      setConversationId(null);
      setMessages([]);
      setMessageInput("");
      setError("");
      return;
    }

    async function loadConversation() {
      try {
        setLoadingChat(true);
        setError("");
        setMessages([]);
        setMessageInput("");
        setConversationId(null);

        if (!socket.connected) {
          socket.connect();
        }

        const conversationResponse =
          await fetch(
            "/api/conversations/create",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                userId: selectedUser.id,
              }),
            }
          );

        const conversationData =
          await conversationResponse.json();

        if (!conversationResponse.ok) {
          throw new Error(
            conversationData.error ||
              "Failed to create conversation"
          );
        }

        const id = conversationData.id;

        if (!id) {
          throw new Error(
            "Conversation ID was not returned"
          );
        }

        setConversationId(id);

        const messagesResponse =
          await fetch(
            `/api/conversations/${id}/messages`
          );

        const messagesData =
          await messagesResponse.json();

        if (!messagesResponse.ok) {
          throw new Error(
            messagesData.error ||
              "Failed to load messages"
          );
        }

        setMessages(
          Array.isArray(messagesData)
            ? messagesData
            : []
        );
      } catch (error) {
        console.error(
          "LOAD CHAT ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load chat"
        );

        setConversationId(null);
        setMessages([]);
      } finally {
        setLoadingChat(false);
      }
    }

    loadConversation();
  }, [selectedUser]);

  function sendMessage() {
    const content =
      messageInput.trim();

    if (!content) {
      return;
    }

    if (!conversationId) {
      setError(
        "Conversation is not ready yet."
      );
      return;
    }

    if (!socket.connected) {
      setError(
        "Socket is not connected."
      );
      return;
    }

    setSendingMessage(true);
    setError("");

    socket.emit(
      "send-message",
      {
        conversationId,
        content,
      },
      (response: {
        success: boolean;
        error?: string;
      }) => {
        if (!response.success) {
          setError(
            response.error ||
              "Failed to send message"
          );

          setSendingMessage(false);
          return;
        }

        setMessageInput("");
        setSendingMessage(false);
      }
    );
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();

      if (!sendingMessage) {
        sendMessage();
      }
    }
  }

  function closeChat() {
    setSelectedUser(null);
    setConversationId(null);
    setMessages([]);
    setMessageInput("");
    setError("");
  }

  return (
    <div className="min-h-screen bg-[#080808] px-6 py-8 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            Matches
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            People you've matched with.
          </p>
        </div>

        {matchedUsers.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#252525] bg-[#111111]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10">
                <span className="text-2xl">
                  ♡
                </span>
              </div>

              <h2 className="text-lg font-medium">
                No matches yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Keep discovering people and
                your matches will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {matchedUsers.map((user) => {
              const image =
                user.images?.[0]?.url;

              return (
                <button
                  key={user.matchId}
                  onClick={() =>
                    setSelectedUser(user)
                  }
                  className="group w-full overflow-hidden rounded-2xl border border-[#252525] bg-[#111111] text-left transition hover:border-pink-500/30"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-[#181818]">
                      {image ? (
                        <img
                          src={image}
                          alt={user.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-600">
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-medium">
                        {user.name}

                        {user.age !== null && (
                          <span className="ml-2 font-normal text-gray-400">
                            {user.age}
                          </span>
                        )}
                      </h2>

                      {user.occupation && (
                        <p className="mt-1 truncate text-sm text-gray-500">
                          {user.occupation}
                        </p>
                      )}

                      {user.location && (
                        <p className="mt-1 truncate text-xs text-gray-600">
                          {user.location}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-6">
          <div className="flex h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-[#292929] bg-[#101010] shadow-2xl sm:h-[700px] sm:rounded-3xl">
            <div className="flex items-center gap-3 border-b border-[#252525] px-4 py-4">
              <button
                onClick={closeChat}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-[#1c1c1c] hover:text-white sm:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="h-10 w-10 overflow-hidden rounded-full bg-[#181818]">
                {selectedUser.images?.[0]?.url && (
                  <img
                    src={
                      selectedUser.images[0].url
                    }
                    alt={selectedUser.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-sm font-semibold">
                  {selectedUser.name}

                  {selectedUser.age !== null && (
                    <span className="ml-1 font-normal text-gray-400">
                      {selectedUser.age}
                    </span>
                  )}
                </h2>

                <p className="text-xs text-gray-500">
                  Matched
                </p>
              </div>

              <button
                onClick={closeChat}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 hover:bg-[#1c1c1c] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5">
              {loadingChat ? (
                <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-pink-400" />
                </div>
              ) : error ? (
                <div className="flex h-full items-center justify-center text-center">
                  <p className="text-sm text-red-400">
                    {error}
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center">
                  <div>
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10">
                      <Send className="h-6 w-6 text-pink-400" />
                    </div>

                    <h3 className="text-sm font-medium">
                      Start a conversation
                    </h3>

                    <p className="mt-1 text-xs text-gray-600">
                      Send the first message.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isMine =
                      message.senderId !==
                      selectedUser.id;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${
                          isMine
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div className="max-w-[78%]">
                          {!isMine && (
                            <p className="mb-1 ml-2 text-[11px] text-gray-500">
                              {message.sender.name}
                            </p>
                          )}

                          <div
                            className={`px-4 py-2.5 text-sm ${
                              isMine
                                ? "rounded-2xl rounded-br-md bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                                : "rounded-2xl rounded-bl-md bg-[#1c1c1c] text-gray-200"
                            }`}
                          >
                            {message.content}
                          </div>

                          <p
                            className={`mt-1 text-[10px] text-gray-600 ${
                              isMine
                                ? "text-right"
                                : "text-left"
                            }`}
                          >
                            {new Date(
                              message.createdAt
                            ).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="border-t border-[#252525] bg-[#101010] p-4">
              <div className="flex items-center gap-2">
                <input
                  value={messageInput}
                  onChange={(event) =>
                    setMessageInput(
                      event.target.value
                    )
                  }
                  onKeyDown={handleKeyDown}
                  disabled={
                    loadingChat ||
                    sendingMessage ||
                    !conversationId
                  }
                  placeholder={
                    loadingChat
                      ? "Loading chat..."
                      : "Type a message..."
                  }
                  className="h-11 flex-1 rounded-full border border-[#292929] bg-[#181818] px-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-pink-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                />

                <button
                  onClick={sendMessage}
                  disabled={
                    loadingChat ||
                    sendingMessage ||
                    !conversationId ||
                    !messageInput.trim()
                  }
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}