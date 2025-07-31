import React, { useState, useEffect } from 'react'
import { Key, Copy, CheckCircle, AlertCircle, Monitor, Smartphone, Globe } from 'lucide-react'
import { getEnvironment, checkLicense, validateLicense } from '../utils/environment'

const LicenseManager = ({ onLicenseValid }) => {
  const [environment, setEnvironment] = useState('web')
  const [licenseStatus, setLicenseStatus] = useState(null)
  const [licenseKey, setLicenseKey] = useState('')
  const [hardwareInfo, setHardwareInfo] = useState(null)
  const [encryptedId, setEncryptedId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const initializeLicense = async () => {
      setIsLoading(true)
      
      // Detecta ambiente
      const env = getEnvironment()
      setEnvironment(env)
      
      // Se for web, permite acesso direto sem verificar licença
      if (env === 'web') {
        setLicenseStatus({ valid: true, isDemo: true })
        onLicenseValid({ valid: true, isDemo: true })
        setIsLoading(false)
        return
      }
      
      // Para desktop/mobile, verifica licença
      const status = await checkLicense()
      setLicenseStatus(status)
      
      if (status.hardwareInfo) {
        setHardwareInfo(status.hardwareInfo)
      }
      
      if (status.encryptedHardwareId) {
        setEncryptedId(status.encryptedHardwareId)
      }
      
      // Se válido, notifica o componente pai
      if (status.valid) {
        onLicenseValid(status)
      }
      
      setIsLoading(false)
    }

    initializeLicense()
  }, [onLicenseValid])

  const handleLicenseSubmit = () => {
    if (!licenseKey.trim()) return
    
    const isValid = validateLicense(encryptedId, licenseKey.trim())
    
    if (isValid) {
      setLicenseStatus({ valid: true, isDemo: false })
      onLicenseValid({ valid: true, isDemo: false })
    } else {
      setLicenseStatus({ valid: false, error: 'Licença inválida' })
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getEnvironmentIcon = () => {
    switch (environment) {
      case 'desktop':
        return <Monitor className="w-5 h-5" />
      case 'mobile':
        return <Smartphone className="w-5 h-5" />
      default:
        return <Globe className="w-5 h-5" />
    }
  }

  const getEnvironmentName = () => {
    switch (environment) {
      case 'desktop':
        return 'Desktop'
      case 'mobile':
        return 'Mobile'
      default:
        return 'Web'
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span>Verificando licença...</span>
        </div>
      </div>
    )
  }

  // Se a licença é válida, não mostra nada
  if (licenseStatus?.valid) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-2 mb-4">
          <Key className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold">Ativação do CreateMacros</h2>
        </div>

        {/* Informações do Ambiente */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            {getEnvironmentIcon()}
            <span className="font-medium">Ambiente: {getEnvironmentName()}</span>
          </div>
          
          {environment === 'web' && (
            <p className="text-sm text-gray-600">
              Versão demo - funcionalidades limitadas
            </p>
          )}
        </div>

        {/* Informações de Hardware (Desktop) */}
        {hardwareInfo && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium mb-2">Informações de Hardware</h3>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">CPU:</span> {hardwareInfo.cpu}</div>
              <div><span className="font-medium">MAC:</span> {hardwareInfo.mac}</div>
            </div>
          </div>
        )}

        {/* Hardware ID Criptografado */}
        {encryptedId && (
          <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
            <h3 className="font-medium mb-2">Hardware ID Criptografado</h3>
            <div className="flex items-center gap-2">
              <code className="bg-white px-2 py-1 rounded text-sm font-mono flex-1">
                {encryptedId}
              </code>
              <button
                onClick={() => copyToClipboard(encryptedId)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Copiar"
              >
                {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Envie este ID para obter sua licença
            </p>
          </div>
        )}

        {/* Entrada da Licença */}
        {encryptedId && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Chave de Licença
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="Digite sua licença"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleLicenseSubmit}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                Ativar
              </button>
            </div>
          </div>
        )}

        {/* Erro */}
        {licenseStatus?.error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-red-600">{licenseStatus.error}</span>
          </div>
        )}

        {/* Instruções */}
        {environment === 'desktop' && (
          <div className="text-xs text-gray-600">
            <p className="mb-2">
              <strong>Como obter sua licença:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Copie o Hardware ID acima</li>
              <li>Envie para o desenvolvedor</li>
              <li>Receba sua chave de licença</li>
              <li>Cole a chave e clique em "Ativar"</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  )
}

export default LicenseManager 