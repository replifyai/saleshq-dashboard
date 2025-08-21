/**
 * Chat Redux Slice
 * Manages chat interface state and organization integration
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: number;
  sources?: any[];
  organizationContext?: {
    mentionedNodes: string[];
    suggestedActions: Array<{
      type: 'create' | 'update' | 'delete' | 'assign' | 'move';
      description: string;
      data: any;
    }>;
  };
}

interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  
  // Organization integration
  organizationMode: boolean;
  activeOrgContext: string | null;
  suggestedActions: Array<{
    id: string;
    type: 'create' | 'update' | 'delete' | 'assign' | 'move';
    description: string;
    data: any;
    status: 'pending' | 'accepted' | 'rejected';
  }>;
  
  // Chat preferences
  showOrgSuggestions: boolean;
  autoExpandOrgNodes: boolean;
}

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
  organizationMode: false,
  activeOrgContext: null,
  suggestedActions: [],
  showOrgSuggestions: true,
  autoExpandOrgNodes: true,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.unshift(action.payload);
    },
    
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    
    clearMessages: (state) => {
      state.messages = [];
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    
    // Organization integration
    setOrganizationMode: (state, action: PayloadAction<boolean>) => {
      state.organizationMode = action.payload;
    },
    
    setActiveOrgContext: (state, action: PayloadAction<string | null>) => {
      state.activeOrgContext = action.payload;
    },
    
    addSuggestedAction: (state, action: PayloadAction<{
      id: string;
      type: 'create' | 'update' | 'delete' | 'assign' | 'move';
      description: string;
      data: any;
    }>) => {
      state.suggestedActions.push({
        ...action.payload,
        status: 'pending',
      });
    },
    
    updateSuggestedAction: (state, action: PayloadAction<{
      id: string;
      status: 'accepted' | 'rejected';
    }>) => {
      const suggestedAction = state.suggestedActions.find(a => a.id === action.payload.id);
      if (suggestedAction) {
        suggestedAction.status = action.payload.status;
      }
    },
    
    removeSuggestedAction: (state, action: PayloadAction<string>) => {
      const index = state.suggestedActions.findIndex(a => a.id === action.payload);
      if (index > -1) {
        state.suggestedActions.splice(index, 1);
      }
    },
    
    clearSuggestedActions: (state) => {
      state.suggestedActions = [];
    },
    
    // Preferences
    setShowOrgSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showOrgSuggestions = action.payload;
    },
    
    setAutoExpandOrgNodes: (state, action: PayloadAction<boolean>) => {
      state.autoExpandOrgNodes = action.payload;
    },
  },
});

export const {
  addMessage,
  setMessages,
  clearMessages,
  setLoading,
  setError,
  setOrganizationMode,
  setActiveOrgContext,
  addSuggestedAction,
  updateSuggestedAction,
  removeSuggestedAction,
  clearSuggestedActions,
  setShowOrgSuggestions,
  setAutoExpandOrgNodes,
} = chatSlice.actions;

export default chatSlice.reducer;