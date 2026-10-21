import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
} from '@tanstack/react-router'
import { RootLayout } from './components/RootLayout'
import { HomePage } from './routes/index'
import { LoginPage } from './routes/login'
import { RegisterPage } from './routes/register'

// As páginas de perfil carregam os gráficos e o mapa (recharts,
// react-simple-maps), as bibliotecas mais pesadas do site. Elas só são
// baixadas quando a pessoa abre um perfil, deixando a página inicial leve.
const ProfilePage = lazyRouteComponent(() => import('./routes/profile'), 'ProfilePage')
const PublicProfilePage = lazyRouteComponent(
  () => import('./routes/public-profile'),
  'PublicProfilePage',
)

const rootRoute = createRootRoute({ component: RootLayout })

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
})

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
})

const publicProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$id',
  component: PublicProfilePage,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  profileRoute,
  publicProfileRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
