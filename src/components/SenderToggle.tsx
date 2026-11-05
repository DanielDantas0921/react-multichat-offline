import type { Sender } from '../types/message'

type SenderToggleProps = {
  sender: Sender
  disabled: boolean
  onToggle: () => void
}

function UserIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function RobotIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2zm-4.5 11a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5zm9 0a2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 0-5z" />
    </svg>
  )
}

export default function SenderToggle({ sender, disabled, onToggle }: SenderToggleProps) {
  const isUser = sender === 'user'

  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-2 transition-colors disabled:cursor-not-allowed ${
        isUser ? 'text-stone-700 hover:bg-stone-100' : 'text-purple-700 hover:bg-purple-50'
      }`}
      aria-label={isUser ? 'Enviar como usuário' : 'Enviar como robô'}
    >
      {isUser ? <UserIcon /> : <RobotIcon />}
    </button>
  )
}
