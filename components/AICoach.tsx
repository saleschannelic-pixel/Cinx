import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, X } from 'lucide-react';
import { ChatMessage, AppView } from '../types';
import { sendMessageToCoach } from '../services/geminiService';

interface Props {
  onClose: () => void;
}

const AICoach: React.FC<Props> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '0', role: 'model', text: 'Hi there! I’m your personal coach. Feeling a craving or just want to chat?', timestamp: Date.now() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToCoach(userMsg.text);
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
        console.error("Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-surface/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
                <div className="w-full h-full bg-background rounded-full flex items-center justify-center overflow-hidden">
                    <span className="text-xl">🤖</span>
                </div>
            </div>
            <div>
                <h3 className="font-bold text-white">AI Coach</h3>
                <p className="text-xs text-secondary flex items-center gap-1">
                    <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span> Online
                </p>
            </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <X size={24} className="text-gray-400" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user' 
                    ? 'bg-primary text-black rounded-br-none' 
                    : 'bg-surface text-gray-200 rounded-bl-none border border-gray-800'
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
             <div className="flex justify-start">
                <div className="bg-surface border border-gray-800 p-4 rounded-2xl rounded-bl-none flex gap-2 items-center">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                </div>
             </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-gray-800">
        <div className="flex items-center gap-2">
            <button className="p-3 rounded-full bg-gray-800 text-primary hover:bg-gray-700 transition-colors">
                <Mic size={20} />
            </button>
            <input
                type="text"
                className="flex-1 bg-[#121212] text-white border border-gray-700 rounded-full px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="p-3 rounded-full bg-primary text-black hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Send size={20} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default AICoach;