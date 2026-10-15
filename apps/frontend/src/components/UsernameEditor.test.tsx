import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { UsernameEditor } from './UsernameEditor'
import { renderWithProviders } from '@/test/renderWithProviders'
import { mockFetch } from '@/test/mockFetch'

const USER = {
  id: 'u1',
  email: 'a@b.com',
  username: 'novo.nome',
  role: 'USER',
  createdAt: '2026-04-23T00:00:00Z',
}

describe('UsernameEditor', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('mostra o nome e envia PATCH /api/auth/me com o novo nome', async () => {
    const { calls } = mockFetch({ 'PATCH /api/auth/me': { body: USER } })
    renderWithProviders(<UsernameEditor username="maria" />)

    expect(screen.getByText('@maria')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /Editar nome de usuário/i }))
    fireEvent.change(screen.getByLabelText(/Novo nome de usuário/i), {
      target: { value: 'Novo.Nome' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Salvar nome de usuário/i }))

    await waitFor(() =>
      expect(calls.find((c) => c.url === '/api/auth/me')).toBeTruthy(),
    )
    const call = calls.find((c) => c.url === '/api/auth/me')!
    expect(call.init.method).toBe('PATCH')
    expect(JSON.parse(call.init.body as string)).toEqual({ username: 'novo.nome' })
  })

  it('mostra erro de nome inválido sem chamar a API', async () => {
    const { calls } = mockFetch({})
    renderWithProviders(<UsernameEditor username="maria" />)
    fireEvent.click(screen.getByRole('button', { name: /Editar nome de usuário/i }))
    fireEvent.change(screen.getByLabelText(/Novo nome de usuário/i), {
      target: { value: 'ab' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Salvar nome de usuário/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/3 a 20 caracteres/)
    expect(calls.find((c) => c.url === '/api/auth/me')).toBeUndefined()
  })

  it('mostra o erro da API quando o nome já está em uso', async () => {
    mockFetch({
      'PATCH /api/auth/me': {
        status: 409,
        body: { message: 'Nome de usuário já está em uso' },
      },
    })
    renderWithProviders(<UsernameEditor username="maria" />)
    fireEvent.click(screen.getByRole('button', { name: /Editar nome de usuário/i }))
    fireEvent.change(screen.getByLabelText(/Novo nome de usuário/i), {
      target: { value: 'ocupado' },
    })
    fireEvent.click(screen.getByRole('button', { name: /Salvar nome de usuário/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Nome de usuário já está em uso',
    )
  })
})
