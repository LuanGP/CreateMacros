import React from 'react'
import { Copy, Check, Download } from 'lucide-react'
import { useState } from 'react'

function MacroPreview({ macro, macroName }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(macro)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Erro ao copiar: ', err)
    }
  }

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
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Código da Macro</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={downloadXML}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download XML
          </button>
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-600" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
          {macro}
        </pre>
      </div>
      
      <div className="text-xs text-gray-500">
        <p>💡 Dica: Use "Download XML" para baixar o arquivo pronto para importar no gMA2, ou "Copiar" para colar no editor</p>
      </div>
    </div>
  )
}

export default MacroPreview 