import AppSidebar from "@/components/ui/app-sidebar"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-svh">
      <AppSidebar />
      <div className="ml-64">
        {children}
      </div>
    </div>
  )
}