import React, { useState } from 'react'
import Header from './components/Header'
import MacroGenerator from './components/MacroGenerator'
import MacroPreview from './components/MacroPreview'
import { Download, Code, Settings } from 'lucide-react'

function App() {
  const [generatedMacro, setGeneratedMacro] = useState('')
  const [macroName, setMacroName] = useState('')

  const downloadMacro = () => {
    if (!generatedMacro) return
    
    const blob = new Blob([generatedMacro], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${macroName || 'macro'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-bold text-gray-900">Preview da Macro</h2>
              </div>
              
              {generatedMacro && (
                <button
                  onClick={downloadMacro}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>
            
            <MacroPreview macro={generatedMacro} />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App 