import React, { useState, useEffect } from 'react'
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react'

function TakeSelectionGenerator({ onMacroGenerated }) {
  const [groups, setGroups] = useState([
    {
      id: 1,
      groupValue: 1,
      effects: [
        { id: 1, effectNumber: 1, isComplex: false }
      ]
    }
  ])

  const [nextGroupId, setNextGroupId] = useState(2)
  const [nextEffectId, setNextEffectId] = useState(2)
  const [invalidEffects, setInvalidEffects] = useState({})

  // Gerar macro sempre que os dados mudarem
  useEffect(() => {
    const macro = generateTakeSelectionMacro(groups)
    onMacroGenerated(macro)
  }, [groups, onMacroGenerated])

  const generateTakeSelectionMacro = (groupsData) => {
    let macro = 'Clear\nClear\nClear\n'

    // Coletar todos os números de efeitos
    const allEffectNumbers = groupsData.flatMap(group => 
      group.effects.map(effect => effect.effectNumber)
    ).sort((a, b) => a - b)

    groupsData.forEach((group, index) => {
      if (index > 0) {
        macro += 'Clear\n'
      }
      
      // Verifica se é número ou string
      if (isNumeric(group.groupValue)) {
        macro += `Group ${group.groupValue}\n`
      } else {
        macro += `Group "${group.groupValue}"\n`
      }
      
      group.effects.forEach((effect) => {
        macro += `Store Effect ${effect.effectNumber}.* /o\n`
      })
    })

    // Adicionar RemoveIndividuals no final
    if (allEffectNumbers.length > 0) {
      const effectList = allEffectNumbers.join(' + ')
      macro += `RemoveIndividuals effect ${effectList} /nc\n`
    }

    return macro
  }

  const addGroup = () => {
    // Encontrar o próximo número de efeito disponível
    const allEffectNumbers = groups.flatMap(g => g.effects.map(e => e.effectNumber))
    let nextAvailableNumber = 1
    while (allEffectNumbers.includes(nextAvailableNumber)) {
      nextAvailableNumber++
    }
    
    const newGroup = {
      id: nextGroupId,
      groupValue: nextGroupId,
      effects: [
        { id: nextEffectId, effectNumber: nextAvailableNumber, isComplex: false }
      ]
    }
    setGroups([...groups, newGroup])
    setNextGroupId(nextGroupId + 1)
    setNextEffectId(nextEffectId + 1)
  }

  const removeGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId))
  }

  const updateGroup = (groupId, field, value) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, [field]: value } : group
    ))
  }

  const isNumeric = (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value))
  }

  const isEffectNumberAvailable = (effectNumber, currentGroupId, currentEffectId) => {
    // Se o valor não for um número válido, não mostrar erro (permitir digitação)
    const numValue = parseInt(effectNumber)
    if (isNaN(numValue) || numValue <= 0) {
      return true
    }
    
    return !groups.some(group => 
      group.id !== currentGroupId && 
      group.effects.some(effect => 
        effect.id !== currentEffectId && 
        effect.effectNumber === numValue
      )
    )
  }

  const addEffect = (groupId) => {
    const group = groups.find(g => g.id === groupId)
    
    // Encontrar o próximo número de efeito disponível
    const allEffectNumbers = groups.flatMap(g => g.effects.map(e => e.effectNumber))
    let nextAvailableNumber = 1
    while (allEffectNumbers.includes(nextAvailableNumber)) {
      nextAvailableNumber++
    }
    
    const newEffect = {
      id: nextEffectId,
      effectNumber: nextAvailableNumber,
      isComplex: false
    }
    
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, effects: [...group.effects, newEffect] }
        : group
    ))
    setNextEffectId(nextEffectId + 1)
  }

  const removeEffect = (groupId, effectId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, effects: group.effects.filter(effect => effect.id !== effectId) }
        : group
    ))
  }

  const updateEffect = (groupId, effectId, field, value) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            effects: group.effects.map(effect => 
              effect.id === effectId 
                ? { ...effect, [field]: value }
                : effect
            )
          }
        : group
    ))
    // Limpa o erro visual ao digitar
    setInvalidEffects(prev => ({ ...prev, [effectId]: false }))
  }

  const moveGroup = (groupId, direction) => {
    const currentIndex = groups.findIndex(g => g.id === groupId)
    if (direction === 'up' && currentIndex > 0) {
      const newGroups = [...groups]
      const temp = newGroups[currentIndex]
      newGroups[currentIndex] = newGroups[currentIndex - 1]
      newGroups[currentIndex - 1] = temp
      setGroups(newGroups)
    } else if (direction === 'down' && currentIndex < groups.length - 1) {
      const newGroups = [...groups]
      const temp = newGroups[currentIndex]
      newGroups[currentIndex] = newGroups[currentIndex + 1]
      newGroups[currentIndex + 1] = temp
      setGroups(newGroups)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium text-gray-900">Configuração de Grupos e Efeitos</h4>
        <button
          onClick={addGroup}
          className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Grupo
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group, groupIndex) => (
          <div key={group.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Grupo</span>
                <input
                  type="text"
                  value={group.groupValue}
                  onChange={(e) => updateGroup(group.id, 'groupValue', e.target.value)}
                  className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Número ou nome"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => moveGroup(group.id, 'up')}
                    disabled={groupIndex === 0}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <MoveUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveGroup(group.id, 'down')}
                    disabled={groupIndex === groups.length - 1}
                    className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                  >
                    <MoveDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => addEffect(group.id)}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Efeito
                </button>
                <button
                  onClick={() => removeGroup(group.id)}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {group.effects.map((effect) => (
                <div key={effect.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">Efeito</span>
                    <input
                      type="number"
                      value={effect.effectNumber}
                      onChange={(e) => updateEffect(group.id, effect.id, 'effectNumber', e.target.value)}
                      onBlur={() => {
                        const numValue = parseInt(effect.effectNumber)
                        const isDuplicate = !isNaN(numValue) && numValue > 0 && groups.some(g =>
                          g.id !== group.id &&
                          g.effects.some(e => e.effectNumber === numValue)
                        )
                        setInvalidEffects(prev => ({
                          ...prev,
                          [effect.id]: isDuplicate
                        }))
                      }}
                      className={`w-16 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                        invalidEffects[effect.id] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Nº"
                      min="1"
                    />
                    {invalidEffects[effect.id] && (
                      <span className="text-xs text-red-600">Já usado</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`complex-${effect.id}`}
                        checked={effect.isComplex || false}
                        onChange={(e) => updateEffect(group.id, effect.id, 'isComplex', e.target.checked)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                      <label htmlFor={`complex-${effect.id}`} className="text-sm text-gray-700">
                        Efeito complexo
                      </label>
                    </div>
                    <button
                      onClick={() => removeEffect(group.id, effect.id)}
                      className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum grupo configurado. Adicione um grupo para começar.</p>
        </div>
      )}
    </div>
  )
}

export default TakeSelectionGenerator 