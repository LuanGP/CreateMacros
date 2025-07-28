import React, { useState } from 'react'
import TakeSelectionGenerator from './generators/TakeSelectionGenerator'
import XmlUploader from './XmlUploader'
import { ChevronDown, ChevronUp } from 'lucide-react'

function MacroGenerator({ onMacroGenerated, onMacroNameChange }) {
  const [selectedGenerator, setSelectedGenerator] = useState('take-selection')
  const [isExpanded, setIsExpanded] = useState(true)
  const [showUploader, setShowUploader] = useState(false)

  const generators = [
    {
      id: 'take-selection',
      name: 'Take Selection',
      description: 'Gera macro para Take Selection com grupos e efeitos'
    }
    // Futuros geradores podem ser adicionados aqui
  ]

  return (
    <div className="space-y-6">
      {/* Nome da Macro */}
      <div>
        <label htmlFor="macroName" className="block text-sm font-medium text-gray-700 mb-2">
          Nome da Macro
        </label>
        <input
          type="text"
          id="macroName"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          placeholder="Ex: Take_Selection_Show"
          onChange={(e) => onMacroNameChange(e.target.value)}
        />
      </div>

      {/* Botão para alternar entre criar novo e carregar existente */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowUploader(false)}
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            !showUploader 
              ? 'bg-primary-600 text-white border-primary-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Criar Nova Macro
        </button>
        <button
          onClick={() => setShowUploader(true)}
          className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
            showUploader 
              ? 'bg-primary-600 text-white border-primary-600' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          Carregar XML
        </button>
      </div>

      {/* Seletor de Tipo de Macro - só mostra quando não está no modo upload */}
      {!showUploader && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Macro
          </label>
          <select
            value={selectedGenerator}
            onChange={(e) => setSelectedGenerator(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            {generators.map((generator) => (
              <option key={generator.id} value={generator.id}>
                {generator.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Configurações do Gerador */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div>
            <h3 className="font-medium text-gray-900">
              {showUploader ? 'Carregar XML' : generators.find(g => g.id === selectedGenerator)?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {showUploader ? 'Carregue um arquivo XML gerado pelo CreateMacros para editar' : generators.find(g => g.id === selectedGenerator)?.description}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        <div className={`p-4 ${!isExpanded ? 'hidden' : ''}`}>
          {showUploader ? (
            <XmlUploader 
              onXmlLoaded={(macroContent) => {
                onMacroGenerated(macroContent)
                setShowUploader(false) // Volta para o modo de criar nova macro
              }} 
            />
          ) : (
            selectedGenerator === 'take-selection' && (
              <TakeSelectionGenerator onMacroGenerated={onMacroGenerated} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default MacroGenerator 