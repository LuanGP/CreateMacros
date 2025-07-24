import React, { useState } from 'react'
import TakeSelectionGenerator from './generators/TakeSelectionGenerator'
import { ChevronDown, ChevronUp } from 'lucide-react'

function MacroGenerator({ onMacroGenerated, onMacroNameChange }) {
  const [selectedGenerator, setSelectedGenerator] = useState('take-selection')
  const [isExpanded, setIsExpanded] = useState(true)

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

      {/* Seletor de Tipo de Macro */}
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

      {/* Configurações do Gerador */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors rounded-t-lg"
        >
          <div>
            <h3 className="font-medium text-gray-900">
              {generators.find(g => g.id === selectedGenerator)?.name}
            </h3>
            <p className="text-sm text-gray-500">
              {generators.find(g => g.id === selectedGenerator)?.description}
            </p>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="p-4">
            {selectedGenerator === 'take-selection' && (
              <TakeSelectionGenerator onMacroGenerated={onMacroGenerated} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MacroGenerator 