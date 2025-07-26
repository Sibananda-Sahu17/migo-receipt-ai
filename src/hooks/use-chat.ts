import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  createWebSocketConnection, 
  WebSocketMessage, 
  WebSocketResponse,
  ChatSession,
  ChatMessage,
  getChatSessions,
  getSessionMessages,
  deleteChatSession,
  getChatSession
} from '../api/chat';

interface UseChatOptions {
  email: string;
  onError?: (error: string) => void;
}

interface UseChatReturn {
  // WebSocket state
  isConnected: boolean;
  isConnecting: boolean;
  
  // Chat sessions
  sessions: ChatSession[];
  currentSession: ChatSession | null;
  messages: ChatMessage[];
  
  // Actions
  sendMessage: (content: string, sessionId?: string) => void;
  createSession: (title?: string) => Promise<string>;
  loadSession: (sessionId: string) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  loadSessions: () => Promise<void>;
  
  // State setters
  setCurrentSession: (session: ChatSession | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  
  // Connection management
  connect: () => void;
  disconnect: () => void;
}

export const useChat = ({ email, onError }: UseChatOptions): UseChatReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentSessionRef = useRef<ChatSession | null>(null);
  const onErrorRef = useRef(onError);
  const isLoadingSessionsRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Update refs when props change
  useEffect(() => {
    currentSessionRef.current = currentSession;
  }, [currentSession]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Load chat sessions
  const loadSessions = useCallback(async () => {
    if (!email || isLoadingSessionsRef.current) return;
    
    isLoadingSessionsRef.current = true;
    try {
      const response = await getChatSessions();
      setSessions(response.data);
    } catch (error) {
      console.error('Error loading sessions:', error);
      onErrorRef.current?.('Failed to load chat sessions');
    } finally {
      isLoadingSessionsRef.current = false;
    }
  }, [email]);

  // WebSocket connection management
  const connect = useCallback(() => {
    if (!email || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    
    try {
      const ws = createWebSocketConnection(email);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketResponse = JSON.parse(event.data);
          
          if (data.heartbeat) {
            return; // Ignore heartbeat messages
          }

          // Handle new session creation or session title update
          if (data.session_title && data.session_id) {
            const currentSessionId = currentSessionRef.current?.id;
            
            if (!currentSessionRef.current) {
              // New session creation - this happens when first message is sent
              const newSession: ChatSession = {
                id: data.session_id,
                title: data.session_title,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              };
              setCurrentSession(newSession);
              setSessions(prev => [newSession, ...prev]);
            } else if (currentSessionId === data.session_id) {
              // Update current session title
              setCurrentSession(prev => prev ? { ...prev, title: data.session_title } : null);
              setSessions(prev => prev.map(session => 
                session.id === data.session_id 
                  ? { ...session, title: data.session_title }
                  : session
              ));
            } else {
              // Session title update for a different session (shouldn't happen in normal flow)
              setSessions(prev => prev.map(session => 
                session.id === data.session_id 
                  ? { ...session, title: data.session_title }
                  : session
              ));
            }
          }

          // Handle streaming AI responses
          if (data.response && data.session_id) {
            const currentSessionId = currentSessionRef.current?.id;
            
            // Only process if it belongs to the currently active session
            if (currentSessionId === data.session_id || !currentSessionId) {
              
              if (data.is_final) {
                // Final response - replace streaming message with final content
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  
                  // If last message is a streaming AI message, replace it with final content
                  if (lastMessage && lastMessage.role === 'ai' && lastMessage.session_id === data.session_id) {
                    return prev.map((msg, index) => 
                      index === prev.length - 1 
                        ? { ...msg, content: data.response, id: `final_${Date.now()}_${Math.random()}` }
                        : msg
                    );
                  } else {
                    // No streaming message found, add final message
                    const aiMessage: ChatMessage = {
                      id: `final_${Date.now()}_${Math.random()}`,
                      session_id: data.session_id,
                      user_id: email,
                      content: data.response,
                      role: 'ai',
                      created_at: new Date().toISOString()
                    };
                    return [...prev, aiMessage];
                  }
                });
                
                // Update the user message with the correct session ID if this is a new session
                if (!currentSessionId) {
                  setMessages(prev => prev.map(msg => 
                    msg.role === 'user' && msg.session_id === 'temp' 
                      ? { ...msg, session_id: data.session_id }
                      : msg
                  ));
                }
              } else {
                // Streaming chunk - update or create streaming message
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  
                  // If last message is a streaming AI message, update it
                  if (lastMessage && lastMessage.role === 'ai' && lastMessage.session_id === data.session_id) {
                    return prev.map((msg, index) => 
                      index === prev.length - 1 
                        ? { ...msg, content: msg.content + data.response }
                        : msg
                    );
                  } else {
                    // Create new streaming AI message
                    const streamingMessage: ChatMessage = {
                      id: `streaming_${Date.now()}_${Math.random()}`,
                      session_id: data.session_id,
                      user_id: email,
                      content: data.response,
                      role: 'ai',
                      created_at: new Date().toISOString()
                    };
                    return [...prev, streamingMessage];
                  }
                });
              }
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          onErrorRef.current?.('Failed to parse message from server');
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        console.log('WebSocket disconnected');
        
        // Only attempt to reconnect if we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(`Reconnection attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (email && !wsRef.current) {
              connect();
            }
          }, 3000);
        } else {
          console.log('Max reconnection attempts reached');
          onErrorRef.current?.('WebSocket connection failed after multiple attempts');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnecting(false);
        onErrorRef.current?.('WebSocket connection failed');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setIsConnecting(false);
      onErrorRef.current?.('Failed to create WebSocket connection');
    }
  }, [email]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    // Reset reconnection attempts when manually disconnecting
    reconnectAttemptsRef.current = 0;
    
    setIsConnected(false);
    setIsConnecting(false);
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((content: string, sessionId?: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      onErrorRef.current?.('WebSocket is not connected');
      return;
    }

    const currentSessionId = sessionId || currentSessionRef.current?.id || '';

    // Add user message to UI immediately (will be updated when session is created)
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      session_id: currentSessionId || 'temp',
      user_id: email,
      content,
      role: 'user',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);

    // Send message through WebSocket
    const message: WebSocketMessage = {
      prompt: content,
      session_id: currentSessionId
    };

    wsRef.current.send(JSON.stringify(message));
  }, [email]);

  // Create new chat session - now handled by WebSocket
  const createSession = useCallback(async (title?: string): Promise<string> => {
    // Don't create session via REST API anymore
    // Session will be created by WebSocket when first message is sent
    return '';
  }, []);

  // Load specific session and its messages
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      // Load session details
      const sessionResponse = await getChatSession(sessionId);
      setCurrentSession(sessionResponse.data);
      
      // Load session messages
      const messagesResponse = await getSessionMessages(sessionId);
      
      // Sort messages by creation time to ensure proper order
      const sortedMessages = messagesResponse.data.sort((a, b) => 
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error loading session:', error);
      onErrorRef.current?.('Failed to load chat session');
    }
  }, []);

  // Delete chat session
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await deleteChatSession(sessionId);
      
      // Remove from sessions list
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Clear current session if it's the one being deleted
      setCurrentSession(prev => {
        if (prev?.id === sessionId) {
          setMessages([]);
          return null;
        }
        return prev;
      });
    } catch (error) {
      console.error('Error deleting session:', error);
      onErrorRef.current?.('Failed to delete chat session');
    }
  }, []);

  // Auto-connect when email changes
  useEffect(() => {
    if (email && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      reconnectAttemptsRef.current = 0; // Reset attempts on new connection
      connect();
      loadSessions();
    } else if (!email) {
      hasInitializedRef.current = false;
      disconnect();
    }

    return () => {
      if (!email) {
        disconnect();
      }
    };
  }, [email]); // Only depend on email

  return {
    isConnected,
    isConnecting,
    sessions,
    currentSession,
    messages,
    sendMessage,
    createSession,
    loadSession,
    deleteSession,
    loadSessions,
    setCurrentSession,
    setMessages,
    connect,
    disconnect
  };
}; 