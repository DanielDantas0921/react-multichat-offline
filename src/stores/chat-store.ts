import { create } from 'zustand'
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware'
import type { Message } from '../types/message'

export type Conversation = {
  id: string
  messages: Message[]
}

type PersistedChatState = Pick<ChatStore, 'conversations'>

type ChatStore = {
  conversations: Conversation[]
  activeConversationId: string | null
  createConversation: () => string
  selectConversation: (id: string | null) => void
  addMessageToActiveConversation: (message: Message) => void
}

const storage: StateStorage = {
  getItem: (name) => window.localStorage.getItem(name),
  setItem: (name, value) => {
    try {
      window.localStorage.setItem(name, value)
    } catch (error) {
      console.error('Não foi possível salvar as conversas no armazenamento local.', error)
      throw error
    }
  },
  removeItem: (name) => {
    try {
      window.localStorage.removeItem(name)
    } catch (error) {
      console.error('Não foi possível remover as conversas do armazenamento local.', error)
      throw error
    }
  },
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      createConversation: () => {
        const id = crypto.randomUUID()
        set((state) => ({
          conversations: [...state.conversations, { id, messages: [] }],
          activeConversationId: id,
        }))
        return id
      },
      selectConversation: (id) => {
        if (id !== null && !get().conversations.some((conversation) => conversation.id === id)) {
          throw new Error(`A conversa "${id}" não existe.`)
        }
        set({ activeConversationId: id })
      },
      addMessageToActiveConversation: (message) => {
        const { activeConversationId, conversations } = get()
        if (activeConversationId === null) {
          throw new Error('Não é possível adicionar uma mensagem sem uma conversa ativa.')
        }

        const conversationExists = conversations.some(
          (conversation) => conversation.id === activeConversationId,
        )
        if (!conversationExists) {
          throw new Error(`A conversa ativa "${activeConversationId}" não existe.`)
        }

        set((state) => ({
          conversations: state.conversations.map((conversation) =>
            conversation.id === activeConversationId
              ? { ...conversation, messages: [...conversation.messages, message] }
              : conversation,
          ),
        }))
      },
    }),
    {
      name: 'multichat-conversations',
      storage: createJSONStorage<PersistedChatState>(() => storage),
      partialize: (state) => ({ conversations: state.conversations }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<PersistedChatState>),
        activeConversationId: null,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error('Não foi possível restaurar as conversas do armazenamento local.', error)
        }
      },
    },
  ),
)
