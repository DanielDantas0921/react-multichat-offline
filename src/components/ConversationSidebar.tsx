import type { Conversation } from '../stores/chat-store'

type ConversationSidebarProps = {
  conversations: Conversation[]
  activeConversationId: string | null
  isOpen: boolean
  onClose: () => void
  onCreateConversation: () => void
  onSelectConversation: (id: string) => void
}

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  isOpen,
  onClose,
  onCreateConversation,
  onSelectConversation,
}: ConversationSidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Fechar menu de conversas"
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
        />
      )}
      <aside
        id="conversation-sidebar"
        className={`fixed inset-y-0 left-0 z-30 flex h-dvh w-64 shrink-0 flex-col gap-4 overflow-hidden bg-stone-900 p-4 pt-16 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:translate-x-0 lg:pt-4 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={onCreateConversation}
          className="rounded-lg bg-stone-700 px-4 py-3 text-left font-medium transition-colors hover:bg-stone-600"
        >
          + Nova conversa
        </button>

        <nav aria-label="Conversas" className="flex flex-col gap-2 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              aria-current={conversation.id === activeConversationId ? 'page' : undefined}
              className={`break-all rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                conversation.id === activeConversationId
                  ? 'bg-stone-700'
                  : 'hover:bg-stone-800'
              }`}
            >
              {conversation.id}
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
