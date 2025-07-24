import React, { useState, useEffect } from 'react'
import { Plus, Trash2, MoveUp, MoveDown } from 'lucide-react'

function TakeSelectionGenerator({ onMacroGenerated }) {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Grupo 1',
      effects: [
        { id: 1, name: 'Efeito 1', type: 'dim' }
      ]
    }
  ])

  const [nextGroupId, setNextGroupId] = useState(2)
  const [nextEffectId, setNextEffectId] = useState(2)

  // Gerar macro sempre que os dados mudarem
  useEffect(() => {
    const macro = generateTakeSelectionMacro(groups)
    onMacroGenerated(macro)
  }, [groups, onMacroGenerated])

  const generateTakeSelectionMacro = (groupsData) => {
    let macro = 'Take Selection\n'
    macro += 'SetUserVar $selection = "Selection"\n\n'

    groupsData.forEach((group, groupIndex) => {
      macro += `Group ${groupIndex + 1}\n`
      macro += `Name "${group.name}"\n`
      
      group.effects.forEach((effect, effectIndex) => {
        macro += `Effect ${effectIndex + 1}\n`
        macro += `Name "${effect.name}"\n`
        macro += `Type ${effect.type}\n`
        macro += `End\n`
      })
      
      macro += 'End\n\n'
    })

    macro += 'End'
    return macro
  }

  const addGroup = () => {
    const newGroup = {
      id: nextGroupId,
      name: `Grupo ${nextGroupId}`,
      effects: [
        { id: nextEffectId, name: `Efeito 1`, type: 'dim' }
      ]
    }
    setGroups([...groups, newGroup])
    setNextGroupId(nextGroupId + 1)
    setNextEffectId(nextEffectId + 1)
  }

  const removeGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId))
  }

  const updateGroupName = (groupId, newName) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, name: newName } : group
    ))
  }

  const addEffect = (groupId) => {
    const newEffect = {
      id: nextEffectId,
      name: `Efeito ${nextEffectId}`,
      type: 'dim'
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
                <input
                  type="text"
                  value={group.name}
                  onChange={(e) => updateGroupName(group.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
                <div key={effect.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <input
                    type="text"
                    value={effect.name}
                    onChange={(e) => updateEffect(group.id, effect.id, 'name', e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Nome do efeito"
                  />
                  <select
                    value={effect.type}
                    onChange={(e) => updateEffect(group.id, effect.id, 'type', e.target.value)}
                    className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="dim">Dim</option>
                    <option value="color">Color</option>
                    <option value="position">Position</option>
                    <option value="gobo">Gobo</option>
                    <option value="beam">Beam</option>
                  </select>
                  <button
                    onClick={() => removeEffect(group.id, effect.id)}
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
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