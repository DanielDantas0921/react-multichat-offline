import { useEffect, useRef } from 'react'
import type { Message } from '../types/message'
import MessageBubble from './MessageBubble'

type MessageListProps = {
  messages: Message[]
  hasActiveConversation: boolean
}

export default function MessageList({ messages, hasActiveConversation }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-4 pb-6">
        <p className="text-center text-stone-600">
          {hasActiveConversation
            ? 'Nenhuma mensagem ainda. Envie a primeira!'
            : 'Crie uma conversa ou selecione uma existente para começar.'}
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto p-4 pb-6">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
