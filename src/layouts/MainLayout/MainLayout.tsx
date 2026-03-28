import React from 'react'
import { Sidebar } from '@/components/Sidebar'
import { Topbar } from '@/components/Topbar'

interface Props {
    children?: React.ReactNode
}

function MainLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Topbar />
            <div className="flex max-w-[1400px] mx-auto w-full flex-1">
                <Sidebar />
                <main className="flex-1 px-8 py-10 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default MainLayout
