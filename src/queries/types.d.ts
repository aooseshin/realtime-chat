type WithData<T> = {
  data: T;
};

namespace API {
  interface User {
    id: number;
    name: string;
    avatar: string;
  }
  interface Conversation {
    id: number;
    timestamp: string;
    lastMessage: string;
    lastMessageTimestamp: string;
    participants: {
      userId: number;
      user: string;
      avatar: string;
    }[];
  }
  interface Message {
    id: number;
    conversationId: number;
    userId: number;
    user: string;
    avatar: string;
    messageType: 'text' | 'image' | 'system';
    message: string;
    reactions: {
      like: number;
      love: number;
      laugh: number;
    };
    reactionUsers: {
      like: number[];
      love: number[];
      laugh: number[];
    };
    timestamp: string;
  }
  interface SimpleMessage {
    id: number;
    conversationId: number;
    userId: number;
    messageType: 'text' | 'image' | 'system';
    message: string;
    timestamp: string;
  }
}
