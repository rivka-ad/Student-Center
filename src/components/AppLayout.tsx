import Header from './Header'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar />
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  )
}
