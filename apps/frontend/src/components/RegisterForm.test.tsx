import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RegisterForm } from './RegisterForm'
import { renderWithProviders } from '@/test/renderWithProviders'
import { mockFetch } from '@/test/mockFetch'

const USER = {
  id: 'u1',
  email: 'a@b.com',
  username: 'maria.silva',
  role: 'USER',
  createdAt: '2026-04-23T00:00:00Z',
}

function fill(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

describe('RegisterForm', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('envia email, nome de usuário (minúsculo) e senha', async () => {
    const onSuccess = vi.fn()
    const { calls } = mockFetch({
      'POST /api/auth/register': {
        status: 201,
        body: { user: USER, tokens: { accessToken: 't' } },
      },
    })
    renderWithProviders(<RegisterForm onSuccess={onSuccess} />)
    fill(/^Email$/i, 'a@b.com')
    fill(/Nome de usuário/i, 'Maria.Silva')
    fill(/^Senha$/i, 'secret123')
    fill(/Confirmar senha/i, 'secret123')
    fireEvent.click(screen.getByRole('button', { name: /Criar conta/i }))

    await waitFor(() => expect(onSuccess).toHaveBeenCalled())
    const call = calls.find((c) => c.url === '/api/auth/register')
    expect(JSON.parse(call!.init.body as string)).toEqual({
      email: 'a@b.com',
      username: 'maria.silva',
      password: 'secret123',
    })
  })

  it('recusa nome de usuário inválido sem chamar a API', async () => {
    const onSuccess = vi.fn()
    const { calls } = mockFetch({})
    renderWithProviders(<RegisterForm onSuccess={onSuccess} />)
    fill(/^Email$/i, 'a@b.com')
    fill(/Nome de usuário/i, 'com espaço')
    fill(/^Senha$/i, 'secret123')
    fill(/Confirmar senha/i, 'secret123')
    fireEvent.submit(
      screen.getByRole('button', { name: /Criar conta/i }).closest('form')!,
    )

    expect(
      await screen.findByText(/Nome de usuário deve ter 3 a 20 caracteres/i),
    ).toBeInTheDocument()
    expect(calls.find((c) => c.url === '/api/auth/register')).toBeUndefined()
    expect(onSuccess).not.toHaveBeenCalled()
  })

  it('mostra o erro da API quando o nome já está em uso', async () => {
    mockFetch({
      'POST /api/auth/register': {
        status: 409,
        body: { message: 'Nome de usuário já está em uso' },
      },
    })
    renderWithProviders(<RegisterForm />)
    fill(/^Email$/i, 'a@b.com')
    fill(/Nome de usuário/i, 'maria')
    fill(/^Senha$/i, 'secret123')
    fill(/Confirmar senha/i, 'secret123')
    fireEvent.click(screen.getByRole('button', { name: /Criar conta/i }))

    expect(
      await screen.findByText(/Nome de usuário já está em uso/i),
    ).toBeInTheDocument()
  })
})
