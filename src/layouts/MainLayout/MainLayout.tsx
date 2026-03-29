import React, { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'
import { Sheet, SheetContent } from '@/components/ui/sheet'

interface Props {
    children?: React.ReactNode
}

function MainLayout({ children }: Props) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

            <div className="flex max-w-[1400px] mx-auto w-full flex-1">
                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Mobile Sidebar (Sheet) */}
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-72 border-none">
                        <Sidebar className="flex w-full h-full pt-16 bg-white" />
                    </SheetContent>
                </Sheet>

                <main className="flex-1 px-4 lg:px-8 py-6 lg:py-10 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default MainLayout
