import { AXIOS_INSTANCE } from "./_interceptor/_axios";

// Types for chat functionality
export interface ChatSession {
  id: string;
  title?: string;
  created_at: string;
  updated_at: string;
  is_deleted?: boolean;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  content: string;
  role: 'user' | 'ai';
  created_at: string;
  previous_message_id?: string;
}

// Chat Sessions API
export const getChatSessions = async () => {
  return AXIOS_INSTANCE.get<ChatSession[]>("/chat/sessions");
};

export const createChatSession = async (title?: string) => {
  const params = title ? { title } : {};
  return AXIOS_INSTANCE.post<string>("/chat/sessions", null, { params });
};

export const getChatSession = async (sessionId: string) => {
  return AXIOS_INSTANCE.get<ChatSession>(`/chat/sessions/${sessionId}`);
};

export const deleteChatSession = async (sessionId: string) => {
  return AXIOS_INSTANCE.delete<boolean>(`/chat/sessions/${sessionId}`);
};

// Chat Messages API
export const getSessionMessages = async (sessionId: string) => {
  return AXIOS_INSTANCE.get<ChatMessage[]>(`/chat/sessions/${sessionId}/messages`);
};

// WebSocket connection helper
export const createWebSocketConnection = (email: string) => {
  const wsUrl = `ws://localhost:8000/api/v1/ws/${email}/chat`;
  return new WebSocket(wsUrl);
};

// WebSocket message types
export interface WebSocketMessage {
  prompt: string;
  session_id?: string;
  heartbeat?: boolean;
}

export interface WebSocketResponse {
  response: string;
  session_id: string;
  is_final: boolean;
  heartbeat: boolean;
  session_title?: string;
} 