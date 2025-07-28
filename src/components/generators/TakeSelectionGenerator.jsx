import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2 } from 'lucide-react'

function TakeSelectionGenerator({ onMacroGenerated, initialGroups }) {
  const [groups, setGroups] = useState([])

  const [nextGroupId, setNextGroupId] = useState(1)
  const [nextEffectId, setNextEffectId] = useState(1)
  const [nextEffectLineId, setNextEffectLineId] = useState(1)
  const [collapsedEffects, setCollapsedEffects] = useState({})
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const [showMultipleEffectsModal, setShowMultipleEffectsModal] = useState(false)
  const [multipleEffectsInput, setMultipleEffectsInput] = useState('')
  const [currentGroupId, setCurrentGroupId] = useState(null)

  // Carregar dados iniciais se fornecidos
  useEffect(() => {
    if (initialGroups && initialGroups.length > 0) {
      setGroups(initialGroups)
      // Resetar os IDs para evitar conflitos
      const maxGroupId = Math.max(...initialGroups.map(g => g.id))
      const maxEffectId = Math.max(...initialGroups.flatMap(g => g.effects.map(e => e.id)))
      setNextGroupId(maxGroupId + 1)
      setNextEffectId(maxEffectId + 1)
    }
  }, [initialGroups])

  // Gerar macro sempre que os dados mudarem
  const [duplicates, setDuplicates] = useState({})

  useEffect(() => {
    const macro = generateTakeSelectionMacro(groups)
    onMacroGenerated(macro)
  }, [groups, onMacroGenerated])

  // Verificar duplicatas sempre que o macro for alterado (com debounce)
  useEffect(() => {
    console.log('🔄 Groups mudou, executando análise de duplicatas...')
    console.log('📊 Groups atual:', groups)
    
    // Limpar duplicatas imediatamente
    setDuplicates({})
    
    const timeoutId = setTimeout(() => {
      // Sempre gerar macro fresco e analisar
      const macro = generateTakeSelectionMacro(groups)
      console.log('🆕 Macro gerado:', macro)
      
      const foundDuplicates = analyzeMacroForDuplicates(macro, groups)
      console.log('🆕 Duplicatas encontradas:', foundDuplicates)
      
      setDuplicates(foundDuplicates)
    }, 50) // Reduzido ainda mais para 50ms
    
    return () => clearTimeout(timeoutId)
  }, [groups]) // Dependência direta em groups, sem useCallback



  const analyzeMacroForDuplicates = (macroText, groupsData) => {
    // Sempre limpar dados anteriores
    const duplicates = {}
    
    const lines = macroText.split('\n').filter(line => line.trim() !== '')
    const storeEffectLines = lines.filter(line => line.startsWith('Store Effect'))
    
    // Debug: Log das linhas encontradas
    console.log('🔍 Analisando macro:', macroText)
    console.log('📝 Linhas Store Effect encontradas:', storeEffectLines)
    
    // Contar ocorrências de cada linha
    const lineCounts = {}
    storeEffectLines.forEach(line => {
      lineCounts[line] = (lineCounts[line] || 0) + 1
    })
    
    console.log('📊 Contagem de linhas:', lineCounts)
    
    // Para cada linha que aparece mais de uma vez, marcar TODAS as ocorrências
    Object.keys(lineCounts).forEach(line => {
      if (lineCounts[line] > 1) {
        console.log('🚨 Duplicata detectada:', line, 'ocorrências:', lineCounts[line])
        
        // Regex melhorado para capturar mais variações de Store Effect
        const effectMatch = line.match(/Store Effect (\d+)(?:\.(\d+))?(?:\.\*)? \/o?/)
        if (effectMatch) {
          const effectNumber = parseInt(effectMatch[1])
          const lineNumber = effectMatch[2] ? parseInt(effectMatch[2]) : null
          
          console.log('🔢 Efeito extraído:', effectNumber, 'Linha:', lineNumber)
          
          // Encontrar todos os efeitos correspondentes
          const matchingEffects = []
          console.log('🔍 Procurando efeitos com número:', effectNumber)
          console.log('📊 Groups para busca:', groupsData)
          
          groupsData.forEach((group, groupIndex) => {
            console.log(`📦 Analisando grupo ${groupIndex + 1}:`, group)
            group.effects.forEach((effect, effectIndex) => {
              console.log(`  🎯 Efeito ${effectIndex + 1}:`, effect)
              console.log(`  🔢 Comparando: ${effect.effectNumber} === ${effectNumber}?`, effect.effectNumber === effectNumber)
              
              if (effect.effectNumber === effectNumber) {
                if (lineNumber) {
                  // É uma linha específica de efeito complexo
                  const effectLine = effect.effectLines?.find(l => l.lineNumber === lineNumber)
                  if (effectLine) {
                    matchingEffects.push({ type: 'line', id: effectLine.id, effectId: effect.id })
                  }
                } else {
                  // É um efeito não-complexo
                  matchingEffects.push({ type: 'effect', id: effect.id })
                  console.log(`  ✅ Efeito ${effect.id} adicionado como duplicata`)
                }
              }
            })
          })
          
          console.log('🎯 Efeitos correspondentes encontrados:', matchingEffects)
          
          // Marcar TODOS os efeitos correspondentes como duplicatas
          matchingEffects.forEach(match => {
            if (match.type === 'line') {
              duplicates[`line-${match.id}`] = true
            } else {
              duplicates[`effect-${match.id}`] = true
            }
          })
        }
      }
    })
    
    console.log('✅ Duplicatas finais:', duplicates)
    return duplicates
  }

  // Função para contar duplicatas
  const getDuplicateStats = () => {
    const duplicateCount = Object.keys(duplicates).length
    const effectDuplicates = Object.keys(duplicates).filter(key => key.startsWith('effect-')).length
    const lineDuplicates = Object.keys(duplicates).filter(key => key.startsWith('line-')).length
    
    return { total: duplicateCount, effects: effectDuplicates, lines: lineDuplicates }
  }

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
        if (effect.isComplex && effect.effectLines && effect.effectLines.length > 0) {
          // Para efeitos complexos, gerar uma linha para cada linha do efeito
          effect.effectLines.forEach(line => {
            macro += `Store Effect ${effect.effectNumber}.${line.lineNumber} /o\n`
          })
        } else {
          // Para efeitos simples, gerar a linha padrão
          macro += `Store Effect ${effect.effectNumber}.* /o\n`
        }
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
        { id: nextEffectId, effectNumber: nextAvailableNumber, isComplex: false, effectLines: [] }
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



  const addEffect = (groupId) => {
    const group = groups.find(g => g.id === groupId)
    
    // Encontrar o próximo número de efeito disponível (que não seja usado por efeitos não-complexos)
    const nonComplexEffectNumbers = groups.flatMap(g => 
      g.effects.filter(e => !e.isComplex).map(e => e.effectNumber)
    )
    let nextAvailableNumber = 1
    while (nonComplexEffectNumbers.includes(nextAvailableNumber)) {
      nextAvailableNumber++
    }
    
    const newEffect = {
      id: nextEffectId,
      effectNumber: nextAvailableNumber,
      isComplex: false,
      effectLines: []
    }
    
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, effects: [...group.effects, newEffect] }
        : group
    ))
    setNextEffectId(nextEffectId + 1)
  }



  const processMultipleEffects = (input) => {
    const effects = []
    const parts = input.split(',').map(part => part.trim())
    
    for (const part of parts) {
      if (part.includes('-')) {
        // Processar blocos (ex: 1-8)
        const [start, end] = part.split('-').map(num => parseInt(num.trim()))
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            effects.push(i)
          }
        }
      } else {
        // Processar números individuais
        const num = parseInt(part.trim())
        if (!isNaN(num)) {
          effects.push(num)
        }
      }
    }
    
    return effects
  }

  const addMultipleEffectsFromModal = () => {
    if (!currentGroupId || !multipleEffectsInput.trim()) return
    
    const effectNumbers = processMultipleEffects(multipleEffectsInput)
    const currentGroup = groups.find(g => g.id === currentGroupId)
    const currentGroupEffectNumbers = currentGroup ? currentGroup.effects.map(e => e.effectNumber) : []
    const otherGroupsEffectNumbers = groups.filter(g => g.id !== currentGroupId).flatMap(g => g.effects.map(e => e.effectNumber))
    const allEffectNumbers = [...currentGroupEffectNumbers, ...otherGroupsEffectNumbers]
    
    // Filtrar apenas números que não existem
    const newEffectNumbers = effectNumbers.filter(num => !allEffectNumbers.includes(num))
    
    if (newEffectNumbers.length === 0) {
      alert('Todos os números de efeito já existem!')
      return
    }
    
    const newEffects = newEffectNumbers.map((effectNumber, index) => ({
      id: nextEffectId + index,
      effectNumber: effectNumber,
      isComplex: false,
      effectLines: []
    }))
    
    setGroups(groups.map(group => 
      group.id === currentGroupId 
        ? { ...group, effects: [...group.effects, ...newEffects] }
        : group
    ))
    setNextEffectId(nextEffectId + newEffects.length)
    
    // Limpar modal
    setShowMultipleEffectsModal(false)
    setMultipleEffectsInput('')
    setCurrentGroupId(null)
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

  const addEffectLine = (groupId, effectId) => {
    const group = groups.find(g => g.id === groupId)
    const effect = group?.effects.find(e => e.id === effectId)
    
    // Encontrar o próximo número de linha disponível globalmente
    const allLineNumbers = groups.flatMap(g => 
      g.effects.filter(e => e.isComplex && e.effectLines)
        .flatMap(e => e.effectLines.map(l => l.lineNumber))
    )
    
    // Verificar se existe um efeito NÃO-complexo com o mesmo número
    const effectNumber = effect.effectNumber
    const hasNonComplexEffect = groups.some(g =>
      g.effects.some(e => 
        e.effectNumber === effectNumber && !e.isComplex && e.id !== effect.id
      )
    )
    
    let nextAvailableNumber = 1
    
    // Se existe um efeito NÃO-complexo com o mesmo número, não sugerir nenhuma linha
    if (hasNonComplexEffect) {
      nextAvailableNumber = 1 // Será rejeitado pela validação
    } else if (allLineNumbers.length === 0) {
      // Se não há linhas em nenhum efeito complexo, usar 1
      nextAvailableNumber = 1
    } else {
      // Encontrar o maior número e adicionar 1
      const maxNumber = Math.max(...allLineNumbers)
      nextAvailableNumber = maxNumber + 1
    }
    
    const newLine = {
      id: nextEffectLineId,
      lineNumber: nextAvailableNumber
    }
    
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            effects: group.effects.map(effect => 
              effect.id === effectId 
                ? { ...effect, effectLines: [...(effect.effectLines || []), newLine] }
                : effect
            )
          }
        : group
    ))
    setNextEffectLineId(nextEffectLineId + 1)
  }

  const removeEffectLine = (groupId, effectId, lineId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            effects: group.effects.map(effect => 
              effect.id === effectId 
                ? { ...effect, effectLines: (effect.effectLines || []).filter(line => line.id !== lineId) }
                : effect
            )
          }
        : group
    ))
  }

  const updateEffectLine = (groupId, effectId, lineId, field, value) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            effects: group.effects.map(effect => 
              effect.id === effectId 
                ? {
                    ...effect,
                    effectLines: (effect.effectLines || []).map(line => 
                      line.id === lineId 
                        ? { ...line, [field]: value }
                        : line
                    )
                  }
                : effect
            )
          }
        : group
    ))
  }

  const toggleEffectCollapse = (effectId) => {
    setCollapsedEffects(prev => ({
      ...prev,
      [effectId]: !prev[effectId]
    }))
  }

  const toggleGroupCollapse = (groupId) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }))
  }





  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h4 className="text-lg font-medium text-gray-900">Configuração de Grupos e Efeitos</h4>
          {getDuplicateStats().total > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              {getDuplicateStats().total} duplicata{getDuplicateStats().total !== 1 ? 's' : ''}
            </div>
          )}
        </div>
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
                  id={`group-${group.id}`}
                  name={`group-${group.id}`}
                  type="text"
                  value={group.groupValue}
                  onChange={(e) => updateGroup(group.id, 'groupValue', e.target.value)}
                  className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Número ou nome"
                />
                <button
                  onClick={() => toggleGroupCollapse(group.id)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  {collapsedGroups[group.id] ? 'Expandir' : 'Minimizar'}
                </button>
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
                  onClick={() => {
                    setCurrentGroupId(group.id)
                    setShowMultipleEffectsModal(true)
                  }}
                  className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  Múltiplos Efeitos
                </button>

                <button
                  onClick={() => removeGroup(group.id)}
                  className="p-1 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!collapsedGroups[group.id] && (
              <div className="space-y-2">
                {group.effects.map((effect) => (
                <div key={effect.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  {/* Cabeçalho do efeito */}
                  <div className="flex items-center justify-between p-2 bg-gray-50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700">Efeito</span>
                      <input
                        id={`effect-${effect.id}`}
                        name={`effect-${effect.id}`}
                        type="number"
                        value={effect.effectNumber}
                        onChange={(e) => updateEffect(group.id, effect.id, 'effectNumber', e.target.value)}
                        className={`w-16 px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 ${
                          duplicates[`effect-${effect.id}`] ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Nº"
                        min="1"
                      />
                      {effect.isComplex && (
                        <button
                          onClick={() => toggleEffectCollapse(effect.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                          {collapsedEffects[effect.id] ? 'Expandir' : 'Minimizar'}
                        </button>
                      )}
                      {duplicates[`effect-${effect.id}`] && (
                        <span 
                          className="text-xs text-red-600 cursor-help" 
                          title="Este efeito aparece múltiplas vezes no macro. Isso pode causar conflitos no GrandMA2."
                        >
                          Já usado
                        </span>
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
                  
                  {/* Conteúdo do efeito (minimizado ou expandido) */}
                  {!collapsedEffects[effect.id] && (
                    <>
                      {/* Cascata para efeito complexo */}
                      {effect.isComplex && (
                        <div className="p-3 bg-blue-50 border-t border-blue-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <h5 className="text-sm font-medium text-blue-900">Linhas do Efeito</h5>
                              <span className="text-xs text-blue-600">
                                ({(effect.effectLines || []).length} linha{(effect.effectLines || []).length !== 1 ? 's' : ''})
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => addEffectLine(group.id, effect.id)}
                                className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                                Adicionar Linha
                              </button>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {(effect.effectLines || []).map((line, lineIndex) => (
                              <div key={line.id} className="flex items-center gap-2">
                                <span className="text-xs text-blue-700">Linha:</span>
                                <input
                                  id={`line-${line.id}`}
                                  name={`line-${line.id}`}
                                  type="number"
                                  value={line.lineNumber}
                                  onChange={(e) => updateEffectLine(group.id, effect.id, line.id, 'lineNumber', e.target.value)}
                                  className={`w-16 px-2 py-1 text-xs border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                                    duplicates[`line-${line.id}`] ? 'border-red-500 bg-red-50' : 'border-blue-300'
                                  }`}
                                  placeholder="Nº"
                                  min="1"
                                />
                                {duplicates[`line-${line.id}`] && (
                                  <span 
                                    className="text-xs text-red-600 cursor-help" 
                                    title="Esta linha de efeito aparece múltiplas vezes no macro. Isso pode causar conflitos no GrandMA2."
                                  >
                                    Já usado
                                  </span>
                                )}
                                <button
                                  onClick={() => removeEffectLine(group.id, effect.id, line.id)}
                                  className="p-1 text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                            
                            {(!effect.effectLines || effect.effectLines.length === 0) && (
                              <p className="text-xs text-blue-600 italic">
                                Nenhuma linha configurada. Adicione linhas para especificar quais linhas do efeito atualizar.
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                      

                    </>
                  )}
                </div>
              ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {groups.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhum grupo configurado. Adicione um grupo para começar.</p>
        </div>
      )}

      {/* Modal para múltiplos efeitos */}
      {showMultipleEffectsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
              Adicionar múltiplos efeitos
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Digite aqui os efeitos:
                </label>
                <input
                  type="text"
                  value={multipleEffectsInput}
                  onChange={(e) => setMultipleEffectsInput(e.target.value)}
                  placeholder="Ex: 1, 6, 14 ou 1-8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <p className="font-medium">Forma de adicionar:</p>
                <p>• Separe por vírgulas para efeitos diferentes, como:</p>
                <p className="ml-4"><code className="bg-gray-100 px-1 rounded">1, 6, 14</code></p>
                <p>• Separe com hífens para blocos, como:</p>
                <p className="ml-4"><code className="bg-gray-100 px-1 rounded">1-8</code> (vai adicionar 1,2,3,4,5,6,7,8)</p>
                <p>• Exemplo misto:</p>
                <p className="ml-4"><code className="bg-gray-100 px-1 rounded">1, 3-7, 10</code> → Adiciona efeitos 1, 3, 4, 5, 6, 7, 10</p>
              </div>
              
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => {
                    setShowMultipleEffectsModal(false)
                    setMultipleEffectsInput('')
                    setCurrentGroupId(null)
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addMultipleEffectsFromModal}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TakeSelectionGenerator 