import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import TextInput from "./TextInput";
import chatApi from "../api/chatApi";
import { FaUser, FaLeaf, FaPaperPlane } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

const ChatBox = ({ onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRenderingAI, setIsRenderingAI] = useState(false);
  const [renderedMessages, setRenderedMessages] = useState({});
  const [fetchError, setFetchError] = useState(false);
  const messagesEndRef = useRef(null);
  const modalRef = useRef(null);

  const fetchConversation = useCallback(async () => {
    try {
      const response = await chatApi.getConversation(user._id);
      setMessages(response);
      setFetchError(false);
    } catch (error) {
      console.error("Error fetching conversation", error);
      setFetchError(true);
    }
  }, [user._id]);

  const isFreshMessage = (createdAt) => {
    const now = new Date();
    const msgDate = new Date(createdAt);
    return now - msgDate < 5000;
  };

  useEffect(() => {
    fetchConversation();
  }, [fetchConversation]);

  useEffect(() => {
    const latestMsg = messages[messages.length - 1];
    if (
      latestMsg &&
      latestMsg.role === "ai" &&
      isFreshMessage(latestMsg.createdAt)
    ) {
      animateMessage(latestMsg);
    }
  }, [messages]);

  const animateMessage = (message) => {
    setIsRenderingAI(true);
    const fullText = message.text;
    const chunkDelay = 10;
    let index = 0;

    const revealChunk = () => {
      setRenderedMessages((prev) => ({
        ...prev,
        [message._id]: fullText.slice(0, index),
      }));
      index += 1;
      if (index <= fullText.length) {
        setTimeout(revealChunk, chunkDelay);
      } else {
        setIsRenderingAI(false);
      }
    };

    revealChunk();
  };

  const sendMessage = async (question) => {
    if (question.trim()) {
      const messageData = {
        userId: user._id,
        question,
      };

      try {
        setIsTyping(true);
        await chatApi.createConversation(messageData);
        setNewMessage("");
        await fetchConversation();
        setIsTyping(false);
      } catch (error) {
        console.error("Error sending message", error);
        setIsTyping(false);
      }
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, renderedMessages]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div
        ref={modalRef}
        className="bg-white w-[90%] max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-green-700 text-white rounded-t-2xl">
          <div className="flex items-center">
            <FaUser className="mr-2" />
            <span>{user.username}</span>
          </div>
          <div className="flex items-center">
            <FaLeaf className="mr-2" />
            <span>Luntian (AI)</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-green-50">
          {fetchError ? (
            <div className="flex justify-center">
              <div className="max-w-lg p-4 rounded-2xl shadow-sm text-sm bg-yellow-200 text-black">
                <div className="flex items-center space-x-2 mb-1">
                  <FaLeaf className="text-green-500" />
                  <span>Luntian (AI)</span>
                </div>
                <p>
                  Hi, I'm Luntian, your personal AI here to help you optimize
                  plant health! Let me know how I can assist you today. 🌱
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`message flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`max-w-lg p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-green-600 text-white"
                      : "bg-white text-black border border-green-200"
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {message.role === "user" ? (
                      <>
                        <FaUser className="text-white" />
                        <span>{message.senderId.username}</span>
                      </>
                    ) : (
                      <>
                        <FaLeaf className="text-green-500" />
                        <span>{message.senderId.firstName}</span>
                      </>
                    )}
                  </div>
                  <div>
                    {message.role === "ai" && renderedMessages[message._id] ? (
                      <ReactMarkdown>
                        {renderedMessages[message._id]}
                      </ReactMarkdown>
                    ) : (
                      <ReactMarkdown>{message.text}</ReactMarkdown>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="p-4 bg-green-100 rounded-b-2xl">
          <TextInput
            label="Ask luntian"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" &&
              !isRenderingAI &&
              !isTyping &&
              sendMessage(newMessage)
            }
            showToggle={false}
            isArea={true}
          />
          <button
            onClick={() => sendMessage(newMessage)}
            disabled={isRenderingAI || isTyping}
            className={`mt-2 px-4 py-2 rounded-full text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition duration-150 w-28 ${
              isRenderingAI || isTyping
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } text-white`}
          >
            <FaPaperPlane className="text-lg" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
