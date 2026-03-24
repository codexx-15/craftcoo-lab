import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your craftco.lab assistant. How can I help you today?",
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle global open event from other components
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  const getAIResponse = (userText: string) => {
    const text = userText.toLowerCase();
    
    if (text.includes('shipping') || text.includes('delivery')) {
      return "We offer free shipping on orders above ₹999. Orders are usually delivered within 5-7 business days across India.";
    }
    if (text.includes('custom') || text.includes('build')) {
      return "Yes! We specialize in custom paintings. You can head over to our 'Build Custom Painting' section to start your own masterpiece.";
    }
    if (text.includes('return') || text.includes('exchange')) {
      return "We have a 7-day return policy for regular products. Custom items cannot be returned unless damaged during transit.";
    }
    if (text.includes('contact') || text.includes('email') || text.includes('phone')) {
      return "You can email us at craftcoo.lab@gmail.com. We respond to all inquiries within 24 hours.";
    }
    if (text.includes('order') || text.includes('track')) {
      return "You can track your order in the 'My Orders' section once you are logged in.";
    }
    if (text.includes('hi') || text.includes('hello') || text.includes('hey')) {
      return "Hello! Hope you're having a creative day. Do you have questions about our art collections or custom orders?";
    }
    if (text.includes('price') || text.includes('cost')) {
      return "Our product prices vary by collection. Paintings start from ₹499, while postcards and decor start even lower. Check our store for details!";
    }

    return "That's interesting! Could you tell me more about that? Or you can ask me about shipping, custom orders, or how to contact our team.";
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: getAIResponse(userMessage.text),
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full bg-[#D85C63] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
        aria-label="Chat with AI"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-6 z-[100] w-[350px] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#D85C63] p-6 text-white flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">craftco.lab AI</h3>
                <p className="text-xs text-white/80">Always active for you</p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-[#D85C63] text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                    <div
                      className={`text-[10px] mt-2 ${
                        msg.sender === 'user' ? 'text-white/60' : 'text-gray-400'
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl border border-gray-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#D85C63] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#D85C63] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#D85C63] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-[#D85C63]/30 transition-all text-sm"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 p-2 bg-[#D85C63] text-white rounded-full hover:bg-[#c44d53] disabled:bg-gray-300 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
