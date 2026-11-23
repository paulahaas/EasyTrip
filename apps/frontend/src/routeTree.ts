import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  redirect,
} from '@tanstack/react-router'
import { NotFound } from './components/NotFound'
import { RootLayout } from './components/RootLayout'
import { AboutPage } from './routes/about'
import { LandingPage } from './routes/landing'
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

const rootRoute = createRootRoute({ component: RootLayout, notFoundComponent: NotFound })

// A landing page é a tela inicial; a busca fica em /buscar.
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
})

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/buscar',
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

// Endereço antigo da landing page.
const legacyLandingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/conheca',
  beforeLoad: () => {
    throw redirect({ to: '/', replace: true })
  },
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
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
  searchRoute,
  loginRoute,
  registerRoute,
  legacyLandingRoute,
  aboutRoute,
  profileRoute,
  publicProfileRoute,
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
