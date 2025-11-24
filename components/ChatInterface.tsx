import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { useGraphStore } from '../store';
import { generateDmowskiResponse } from '../services/geminiService';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, sender: 'bot', text: "Witam. Nazywam się Roman Dmowski. Służę wyjaśnieniem historii naszego ruchu narodowego i walki o niepodległość. O co chciałby Pan zapytać?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedNode } = useGraphStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Construct context from selected node
    let context = "User is asking generally.";
    if (selectedNode) {
      context = `User has selected the node: ${selectedNode.label} (${selectedNode.type}). Description: ${selectedNode.description}.`;
    }

    const responseText = await generateDmowskiResponse(userMsg.text, context);

    const botMsg: Message = { id: Date.now() + 1, sender: 'bot', text: responseText };
    setMessages(prev => [...prev, botMsg]);
    setIsTyping(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#F0EAD6] border-l-4 border-[#1E3A5F]">
      {/* Header */}
      <div className="bg-[#1E3A5F] text-[#D4AF37] p-4 border-b-4 border-[#DC143C] flex items-center justify-center gap-2 shadow-md">
        <Bot size={24} />
        <h2 className="text-xl font-serif font-bold tracking-wider">Roman Dmowski</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F5DC]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg shadow-sm border text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] rounded-br-none'
                  : 'bg-[#FFFFF0] text-gray-800 border-[#D4AF37] rounded-bl-none font-serif'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-[#FFFFF0] p-3 rounded-lg border border-[#D4AF37] rounded-bl-none">
              <span className="animate-pulse text-gray-500 text-xs">Piszę...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-[#E8DCC0] border-t-2 border-[#D4AF37]">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Zadaj pytanie..."
            className="flex-1 px-4 py-2 rounded border-2 border-[#1E3A5F] bg-[#FBFBF8] text-[#1E3A5F] focus:outline-none focus:border-[#DC143C] font-serif placeholder-gray-500"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="bg-[#DC143C] text-white p-2 rounded hover:bg-[#B01030] transition-colors disabled:opacity-50 border-2 border-[#DC143C]"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};