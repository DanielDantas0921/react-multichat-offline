import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Chat from './Chat'
import { useChatStore } from '../stores/chat-store'

describe('multichat', () => {
  beforeEach(() => {
    localStorage.clear()
    useChatStore.setState({ conversations: [], activeConversationId: null })
    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    cleanup()
    localStorage.clear()
    useChatStore.setState({ conversations: [], activeConversationId: null })
  })

  it('creates a conversation, displays its ID, and activates it', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))

    const [conversation] = useChatStore.getState().conversations
    expect(conversation).toBeDefined()
    expect(screen.getByRole('button', { name: conversation.id })).toBeDefined()
    expect(useChatStore.getState().activeConversationId).toBe(conversation.id)
    expect(conversation.messages).toEqual([])
  })

  it('keeps histories separate when switching conversations and sending messages', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    const firstId = useChatStore.getState().activeConversationId!
    const input = screen.getByPlaceholderText('Digite uma mensagem...')

    await user.type(input, 'Mensagem da primeira conversa{Enter}')
    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    const secondId = useChatStore.getState().activeConversationId!
    await user.type(screen.getByPlaceholderText('Digite uma mensagem...'), 'Mensagem da segunda conversa{Enter}')

    await user.click(screen.getByRole('button', { name: firstId }))
    expect(screen.getByText('Mensagem da primeira conversa')).toBeDefined()
    expect(screen.queryByText('Mensagem da segunda conversa')).toBeNull()

    await user.type(screen.getByPlaceholderText('Digite uma mensagem...'), 'Outra mensagem da primeira{Enter}')
    await user.click(screen.getByRole('button', { name: secondId }))
    expect(screen.getByText('Mensagem da segunda conversa')).toBeDefined()
    expect(screen.queryByText('Outra mensagem da primeira')).toBeNull()

    const conversations = useChatStore.getState().conversations
    expect(conversations.find(({ id }) => id === firstId)?.messages).toHaveLength(2)
    expect(conversations.find(({ id }) => id === secondId)?.messages).toHaveLength(1)
  })

  it('restores conversations from local storage with no active conversation', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    const conversationId = useChatStore.getState().activeConversationId!
    await user.type(
      screen.getByPlaceholderText('Digite uma mensagem...'),
      'Mensagem persistida{Enter}',
    )
    const persistedValue = localStorage.getItem('multichat-conversations')
    expect(persistedValue).not.toBeNull()

    useChatStore.setState({ conversations: [], activeConversationId: conversationId })
    localStorage.setItem('multichat-conversations', persistedValue!)
    await useChatStore.persist.rehydrate()

    expect(useChatStore.getState().conversations[0]?.messages[0]?.text).toBe('Mensagem persistida')
    expect(useChatStore.getState().activeConversationId).toBeNull()
  })

  it('keeps sender selection across conversations and resets to user in a new UI session', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<Chat />)

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    await user.click(screen.getByRole('button', { name: 'Enviar como usuário' }))
    expect(screen.getByRole('button', { name: 'Enviar como robô' })).toBeDefined()

    await user.click(screen.getByRole('button', { name: '+ Nova conversa' }))
    expect(screen.getByRole('button', { name: 'Enviar como robô' })).toBeDefined()

    unmount()
    render(<Chat />)
    expect(screen.getByRole('button', { name: 'Enviar como usuário' })).toBeDefined()
  })

  it('disables message controls and sender changes without an active conversation', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    const input = screen.getByPlaceholderText('Digite uma mensagem...')
    const senderToggle = screen.getByRole('button', { name: 'Enviar como usuário' })
    const sendButton = screen.getByRole('button', { name: 'Enviar' })
    const inputContainer = input.parentElement?.parentElement?.parentElement

    expect(input).toHaveProperty('disabled', true)
    expect(senderToggle).toHaveProperty('disabled', true)
    expect(sendButton).toHaveProperty('disabled', true)
    expect(inputContainer?.classList.contains('opacity-50')).toBe(true)

    await user.type(input, 'Não deve ser enviada{Enter}')
    await user.click(senderToggle)
    fireEvent.keyDown(input, { key: 'Enter' })
    fireEvent.keyDown(senderToggle, { key: ' ' })
    expect(useChatStore.getState().conversations).toEqual([])
    expect(screen.getByRole('button', { name: 'Enviar como usuário' })).toBeDefined()
  })

  it('opens and closes the mobile sidebar and keeps desktop sidebar visible', async () => {
    const user = userEvent.setup()
    render(<Chat />)

    const sidebar = screen.getByRole('complementary')
    const menuButton = screen.getByRole('button', { name: 'Abrir menu de conversas' })

    expect(sidebar.className).toContain('-translate-x-full')
    expect(sidebar.className).toContain('lg:translate-x-0')
    expect(sidebar.className).toContain('lg:sticky')

    await user.click(menuButton)
    expect(screen.getByRole('button', { name: 'Fechar menu de conversas' })).toBeDefined()
    expect(sidebar.className).toContain('translate-x-0')

    await user.click(screen.getByRole('button', { name: 'Fechar menu de conversas' }))
    expect(sidebar.className).toContain('-translate-x-full')

    const main = screen.getByRole('main')
    expect(main.className).toContain('min-w-0')
    expect(main.className).toContain('flex-1')
    expect(within(sidebar).getByRole('navigation', { name: 'Conversas' })).toBeDefined()
  })
})
