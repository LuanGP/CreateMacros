import React from 'react'
import { Download } from 'lucide-react'

function MacroPreview({ macro, macroName }) {

  const generateXML = () => {
    if (!macro) return ''

    const lines = macro.split('\n').filter(line => line.trim() !== '')
    const now = new Date().toISOString().replace('T', ' ').substring(0, 19)
    
    let xml = `<?xml version="1.0" encoding="utf-8"?>
<MA xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://schemas.malighting.de/grandma2/xml/MA" xsi:schemaLocation="http://schemas.malighting.de/grandma2/xml/MA http://schemas.malighting.de/grandma2/xml/3.9.60/MA.xsd" major_vers="3" minor_vers="9" stream_vers="60">
	<Info datetime="${now}" showfile="CreateMacros" />
	<Macro index="1" name="${macroName || 'TakeSelection'}">`

    lines.forEach((line, index) => {
      xml += `
		<Macroline index="${index}" delay="0.02">
			<text>${line}</text>
		</Macroline>`
    })

    xml += `
	</Macro>
</MA>`

    return xml
  }

  const downloadXML = () => {
    const xml = generateXML()
    if (!xml) return

    const blob = new Blob([xml], { type: 'application/xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${macroName || 'macro'}.xml`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (!macro) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <p className="text-gray-500">Configure a macro para ver o preview</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-900">Console da Macro</h3>
        <button
          onClick={downloadXML}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Download XML
        </button>
      </div>
      
      <div className="bg-gray-800 border border-gray-600 rounded-lg overflow-hidden">
        {/* Header da tabela */}
        <div className="bg-black border-b-2 border-yellow-500 border-t-2">
          <div className="grid grid-cols-12 text-white font-bold text-xs">
            <div className="col-span-2 py-1 px-2 text-center border-r border-gray-600">No.</div>
            <div className="col-span-10 py-1 px-2">CMD</div>
          </div>
        </div>
        
        {/* Linhas dos comandos */}
        <div className="max-h-80 overflow-y-auto">
          {macro.split('\n').filter(line => line.trim() !== '').map((line, index) => (
            <div 
              key={index} 
              className="grid grid-cols-12 border-b border-gray-600 hover:bg-gray-700"
            >
              <div className="col-span-2 py-1 px-2 text-center border-r border-gray-600 text-white text-xs">
                {index + 1}
              </div>
              <div className="col-span-10 py-1 px-2 font-mono text-xs text-green-400">
                {line}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>💡 Dica: Use "Download XML" para baixar o arquivo pronto para importar no gMA2</p>
      </div>
    </div>
  )
}

export default MacroPreview 