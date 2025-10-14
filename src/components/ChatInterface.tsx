import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowLeft } from 'lucide-react';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatInterfaceProps {
  carInfo: {
    carMake: string;
    carModel: string;
    carYear: number;
    partName: string;
    partArticle?: string;
    isCustomPart: boolean;
  };
  onBack: () => void;
}

export function ChatInterface({ carInfo, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false); // ✅ Prevents double-call in StrictMode

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getInitialHelp();
    }
  }, []);

  const getInitialHelp = async () => {
    setIsLoading(true);

    let initialUserMessageContent: string;
    if (carInfo.isCustomPart) {
      initialUserMessageContent = `I need help installing this part: ${carInfo.partName} on my ${carInfo.carYear} ${carInfo.carMake} ${carInfo.carModel}.`;
    } else {
      const article = carInfo.partArticle ? `${carInfo.partArticle} ` : '';
      initialUserMessageContent = `I need help installing ${article}${carInfo.partName} on my ${carInfo.carYear} ${carInfo.carMake} ${carInfo.carModel}.`;
    }

    const initialUserMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: initialUserMessageContent,
    };

    setMessages([initialUserMessage]);

    console.log('Supabase URL from env:', import.meta.env.VITE_SUPABASE_URL);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-installation-help`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carMake: carInfo.carMake,
            carModel: carInfo.carModel,
            carYear: carInfo.carYear,
            partName: carInfo.partName,
            conversationHistory: [],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to get installation help');
      }

      const data = await response.json();
      
      // ✅ Handle the new API response structure
      if (!data.newMessages || !Array.isArray(data.newMessages)) {
          throw new Error("Invalid API response format. Expected 'newMessages' array.");
      }

      // ✅ Map ALL new messages from the server to the state
      const newMessagesToAdd: Message[] = data.newMessages.map((msg: any, index: number) => ({
        id: (Date.now() + 1 + index).toString(), // Unique ID for each new message
        role: 'assistant', // Server only sends assistant messages
        content: msg.content,
      }));

      // ✅ Append all new messages to the chat
      setMessages((prev) => [...prev, ...newMessagesToAdd]);

    } catch (error) {
      console.error('Error fetching initial help:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Send the full conversation history for context
      const conversationHistory = newMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-installation-help`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carMake: carInfo.carMake,
            carModel: carInfo.carModel,
            carYear: carInfo.carYear,
            partName: carInfo.partName,
            conversationHistory, // Send the updated history
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to send message');
      }

      const data = await response.json();

      // ✅ Handle the new API response structure for follow-up messages as well
      if (!data.newMessages || !Array.isArray(data.newMessages)) {
          throw new Error("Invalid API response format. Expected 'newMessages' array.");
      }
      
      const newMessagesToAdd: Message[] = data.newMessages.map((msg: any, index: number) => ({
        id: (Date.now() + 1 + index).toString(),
        role: 'assistant',
        content: msg.content,
      }));

      setMessages((prev) => [...prev, ...newMessagesToAdd]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {carInfo.carYear} {carInfo.carMake} {carInfo.carModel}
          </h2>
          <p className="text-sm text-gray-600">Installing: {carInfo.partName}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} role={message.role} content={message.content} />
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            </div>
            <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-3">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t border-gray-200 px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
