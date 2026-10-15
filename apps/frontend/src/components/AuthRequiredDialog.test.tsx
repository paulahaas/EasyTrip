import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { AuthRequiredDialog } from './AuthRequiredDialog'

function renderDialog(onOpenChange = vi.fn()) {
  const rootRoute = createRootRoute({
    component: () => (
      <AuthRequiredDialog open={true} onOpenChange={onOpenChange} />
    ),
  })
  const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/login',
    component: () => <div>login-page</div>,
  })
  const registerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/register',
    component: () => <div>register-page</div>,
  })
  const router = createRouter({
    routeTree: rootRoute.addChildren([loginRoute, registerRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  return { ...render(<RouterProvider router={router} />), router, onOpenChange }
}

describe('AuthRequiredDialog', () => {
  it('renderiza título + descrição + dois CTAs', async () => {
    renderDialog()
    expect(
      await screen.findByText(/Conteúdo exclusivo para membros/i),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: /Já tenho conta/i }),
    ).toBeInTheDocument()
    expect(
      await screen.findByRole('button', { name: /Criar conta grátis/i }),
    ).toBeInTheDocument()
  })

  it('navega para /register ao clicar CTA primário', async () => {
    const { router } = renderDialog()
    const btn = await screen.findByRole('button', {
      name: /Criar conta grátis/i,
    })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/register')
    })
  })

  it('navega para /login ao clicar CTA secundário', async () => {
    const { router } = renderDialog()
    const btn = await screen.findByRole('button', { name: /Já tenho conta/i })
    fireEvent.click(btn)
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/login')
    })
  })
})
