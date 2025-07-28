import React from 'react'
import { Zap } from 'lucide-react'

function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-primary-600" />
            <h1 className="text-2xl font-bold text-gray-900">CreateMacros</h1>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Gerador de Macros para GrandMA2
            </span>
            <span className="text-xs text-primary-600 font-medium">
              by Luan
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 