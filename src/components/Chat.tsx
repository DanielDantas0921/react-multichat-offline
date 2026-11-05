import { useState } from 'react'
import type { Sender } from '../types/message'
import { useChatStore } from '../stores/chat-store'
import ChatInput from './ChatInput'
import ConversationSidebar from './ConversationSidebar'
import MessageList from './MessageList'

export default function Chat() {
  const [sender, setSender] = useState<Sender>('user')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const conversations = useChatStore((state) => state.conversations)
  const activeConversationId = useChatStore((state) => state.activeConversationId)
  const createConversation = useChatStore((state) => state.createConversation)
  const selectConversation = useChatStore((state) => state.selectConversation)
  const addMessageToActiveConversation = useChatStore(
    (state) => state.addMessageToActiveConversation,
  )

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  )

  function handleSend(text: string) {
    if (!activeConversation || !text.trim()) return

    addMessageToActiveConversation({
      id: crypto.randomUUID(),
      text,
      sender,
    })
  }

  function handleToggleSender() {
    setSender((currentSender) => (currentSender === 'user' ? 'robot' : 'user'))
  }

  function handleCreateConversation() {
    createConversation()
    setIsSidebarOpen(false)
  }

  function handleSelectConversation(id: string) {
    selectConversation(id)
    setIsSidebarOpen(false)
  }

  return (
    <div className="flex min-h-dvh overflow-hidden bg-stone-200">
      <ConversationSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onCreateConversation={handleCreateConversation}
        onSelectConversation={handleSelectConversation}
      />
      <main className="flex min-h-dvh min-w-0 flex-1 flex-col items-center">
        <header className="flex h-14 w-full items-center px-4 lg:hidden">
          <button
            type="button"
            onClick={() => setIsSidebarOpen((isOpen) => !isOpen)}
            aria-label={isSidebarOpen ? 'Recolher menu de conversas' : 'Abrir menu de conversas'}
            aria-expanded={isSidebarOpen}
            aria-controls="conversation-sidebar"
            className="fixed left-4 top-3 z-40 rounded-lg bg-stone-800 p-2 text-white shadow-md"
          >
            {isSidebarOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </header>
        <div className="flex min-h-0 w-full max-w-2xl flex-1 flex-col">
          <MessageList
            messages={activeConversation?.messages ?? []}
            hasActiveConversation={activeConversation !== undefined}
          />
          <ChatInput
            key={activeConversationId ?? 'no-active-conversation'}
            sender={sender}
            disabled={!activeConversation}
            onToggleSender={handleToggleSender}
            onSend={handleSend}
          />
        </div>
      </main>
    </div>
  )
}
