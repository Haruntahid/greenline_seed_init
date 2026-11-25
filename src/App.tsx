import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'

import CustomCursor from './components/ui/CustomCursor'
import ThemeProvider from './components/ui/ThemeProvider'
import SectionRenderer from './components/sections/SectionRenderer'
import HashScroll from './components/ui/HashScroll'

import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

import DashboardPage from './pages/admin/DashboardPage'
import LoginPage from './pages/admin/LoginPage'

import AboutPage from './pages/public/AboutPage'
import WhatWeDoPage from './pages/public/WhatWeDoPage'
import ServicesPage from './pages/public/ServicesPage'
import ServiceDetailsPage from './pages/public/ServiceDetailsPage'
import MissionVisionPage from './pages/public/MissionVisionPage'
import OurTeamPage from './pages/public/OurTeamPage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailsPage from './pages/public/ProductDetailsPage'
import ProjectsPage from './pages/public/ProjectsPage'
import BlogsPage from './pages/public/BlogsPage'
import ContactPage from './pages/public/ContactPage'
import GallaryPage from './pages/public/GallaryPage'

import { siteConfig } from './config'
import { AuthProvider, useAuth } from './auth/AuthContext'
import {
  hasPermission,
  type AdminModule,
} from './auth/permissions.config'
import WebsiteContentPage from './pages/admin/WebsiteContentPage'
import ProductManagementPage from './pages/admin/ProductManagementPage'
import SecurityPage from './pages/admin/SecurityPage'
import MediaLibraryPage from './pages/admin/MediaLibraryPage'
import SmartAssistantPage from './pages/admin/SmartAssistantPage'
import ThemeAppearancePage from './pages/admin/ThemeAppearancePage'

function getRequiredModule(pathname: string): AdminModule | null {
  const moduleRoutes: { path: string; module: AdminModule }[] = [
    { path: '/admin/content', module: 'websiteContent' },
    { path: '/admin/products', module: 'products' },
    { path: '/admin/media', module: 'mediaLibrary' },
    { path: '/admin/assistant', module: 'smartAssistant' },
    { path: '/admin/theme', module: 'themeAppearance' },
    { path: '/admin/settings', module: 'siteSettings' },
    { path: '/admin/security', module: 'security' },
  ]

  const matchedRoute = moduleRoutes.find(
    (route) =>
      pathname === route.path ||
      pathname.startsWith(`${route.path}/`),
  )

  if (matchedRoute) return matchedRoute.module

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return 'dashboard'
  }

  return null
}

function AccessDeniedPage() {
  return (
    <div className="admin-access-denied">
      <div>
        <h1>Access Denied</h1>
        <p>
          You don't have permission to access this section.
          Please contact your administrator if you need access.
        </p>
      </div>
    </div>
  )
}

function ProtectedAdminRoute() {
  const location = useLocation()
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="admin-access-denied">
        <div>
          <p>Verifying session...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  const requiredModule = getRequiredModule(location.pathname)

  if (
    !requiredModule ||
    !hasPermission(session.role, requiredModule)
  ) {
    return (
      <AdminLayout>
        <AccessDeniedPage />
      </AdminLayout>
    )
  }

  const page =
    location.pathname === '/admin/content' ? (
      <WebsiteContentPage />
    ) : location.pathname === '/admin/products' ? (
      <ProductManagementPage />
    ) : location.pathname === '/admin/security' ? (
      <SecurityPage />
    ) : location.pathname === '/admin/media' ? (
      <MediaLibraryPage />
    ) : location.pathname === '/admin/assistant' ? (
      <SmartAssistantPage />
    ) : location.pathname === '/admin/theme' ? (
      <ThemeAppearancePage />
    ) : (
      <DashboardPage />
    )

  return (
    <AdminLayout>
      {page}
    </AdminLayout>
  )
}

function LoginRoute() {
  const { session, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (session) {
    return <Navigate to="/admin" replace />
  }

  return <LoginPage />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HashScroll />

        <ThemeProvider>
          {siteConfig.features.customCursor && <CustomCursor />}

          <Routes>
            {/* Login */}
            <Route path="/login" element={<LoginRoute />} />

            {/* Protected Admin */}
            <Route path="/admin/*" element={<ProtectedAdminRoute />} />

            {/* Public Website */}
            <Route
              path="/*"
              element={
                <PublicLayout>
                  <Routes>
                    <Route path="/" element={<SectionRenderer />} />
                    <Route path="/home" element={<SectionRenderer />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/what-we-do" element={<WhatWeDoPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route
                      path="/services/:slug"
                      element={<ServiceDetailsPage />}
                    />
                    <Route
                      path="/mission-vision"
                      element={<MissionVisionPage />}
                    />
                    <Route path="/our-team" element={<OurTeamPage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route
                      path="/products/:slug"
                      element={<ProductDetailsPage />}
                    />
                    <Route path="/gallary" element={<GallaryPage />} />
                    <Route path="/project" element={<ProjectsPage />} />
                    <Route path="/blogs" element={<BlogsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                  </Routes>
                </PublicLayout>
              }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
