'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, MessageSquare } from 'lucide-react';
import { ChatMessage } from '@/types';

interface ChatPanelProps {
  isOpen: boolean;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

export default function ChatPanel({ isOpen, messages, onSendMessage, onClose }: ChatPanelProps) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 top-4 bottom-24 w-80 bg-vibe-dark rounded-lg shadow-2xl flex flex-col z-30 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-vibe-gray">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-5 h-5 text-vibe-blue" />
          <h3 className="font-semibold text-white">Chat</h3>
        </div>
        <button
          onClick={onClose}
          className="text-vibe-gray-light hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-vibe-gray-light py-8">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No messages yet</p>
            <p className="text-sm">Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="chat-message">
              <div className="flex items-start justify-between mb-1">
                <span className="font-medium text-vibe-blue text-sm">
                  {message.userName}
                </span>
                <span className="text-xs text-vibe-gray-light">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <p className="text-white text-sm leading-relaxed break-words">
                {message.message}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-vibe-gray">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1 text-sm"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary p-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-xs text-vibe-gray-light mt-2">
          {newMessage.length}/500
        </div>
      </div>
    </div>
  );
}
