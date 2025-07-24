import React, { useState } from 'react'
import Header from './components/Header'
import MacroGenerator from './components/MacroGenerator'
import MacroPreview from './components/MacroPreview'
import { Download, Code, Settings } from 'lucide-react'

function App() {
  const [generatedMacro, setGeneratedMacro] = useState('')
  const [macroName, setMacroName] = useState('')



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gerador de Macro */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Gerador de Macro</h2>
            </div>
            
            <MacroGenerator 
              onMacroGenerated={setGeneratedMacro}
              onMacroNameChange={setMacroName}
            />
          </div>

          {/* Preview da Macro */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Code className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Preview da Macro</h2>
            </div>
            
            <MacroPreview macro={generatedMacro} macroName={macroName} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 