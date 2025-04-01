import React, { useState } from 'react';
import { X, Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
}

interface Chat {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  lastMessage: string;
  unread: number;
}

const dummyChats: Chat[] = [
  {
    id: '1',
    userId: 'user1',
    username: 'Александр Петров',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    lastMessage: 'Отличная работа! Спасибо за быструю реализацию.',
    unread: 2
  },
  {
    id: '2',
    userId: 'user2',
    username: 'Елена Соколова',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    lastMessage: 'Когда сможете приступить к проекту?',
    unread: 0
  },
  {
    id: '3',
    userId: 'user3',
    username: 'Михаил Волков',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    lastMessage: 'Проект успешно завершен!',
    unread: 1
  }
];

const dummyMessages: Record<string, Message[]> = {
  'user1': [
    {
      id: '1',
      senderId: 'user1',
      receiverId: 'currentUser',
      content: 'Здравствуйте! Я просмотрел ваше портфолио.',
      timestamp: '10:30'
    },
    {
      id: '2',
      senderId: 'currentUser',
      receiverId: 'user1',
      content: 'Спасибо! Какой проект вас интересует?',
      timestamp: '10:32'
    },
    {
      id: '3',
      senderId: 'user1',
      receiverId: 'currentUser',
      content: 'Отличная работа! Спасибо за быструю реализацию.',
      timestamp: '10:35'
    }
  ]
};

export function Messenger({ isOpen, onClose, initialChat = null }: { isOpen: boolean; onClose: () => void; initialChat?: string | null }) {
  const [selectedChat, setSelectedChat] = useState<string | null>(initialChat);
  const [newMessage, setNewMessage] = useState('');
  
  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    setNewMessage('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 w-full max-w-4xl h-[600px] rounded-xl shadow-2xl flex overflow-hidden">
        {/* Chats List */}
        <div className="w-1/3 border-r border-slate-700 flex flex-col">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Сообщения</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="overflow-y-auto flex-1">
            {dummyChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.userId)}
                className={`p-4 hover:bg-slate-800 cursor-pointer flex items-center space-x-3 ${
                  selectedChat === chat.userId ? 'bg-slate-800' : ''
                }`}
              >
                <img src={chat.avatar} alt={chat.username} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate">{chat.username}</h3>
                    {chat.unread > 0 && (
                      <span className="bg-blue-500 text-xs px-2 py-1 rounded-full">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-slate-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={dummyChats.find(c => c.userId === selectedChat)?.avatar}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <h3 className="font-medium">
                    {dummyChats.find(c => c.userId === selectedChat)?.username}
                  </h3>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {dummyMessages[selectedChat]?.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.senderId === 'currentUser'
                          ? 'bg-blue-600'
                          : 'bg-slate-700'
                      }`}
                    >
                      <p>{message.content}</p>
                      <span className="text-xs text-gray-300 mt-1 block">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="flex-1 bg-slate-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 rounded-full p-2 transition-colors"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageCircle size={48} className="mx-auto mb-4" />
                <p>Выберите чат для начала общения</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MessengerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 rounded-full p-3 shadow-lg transition-colors"
    >
      <MessageCircle size={24} />
    </button>
  );
}