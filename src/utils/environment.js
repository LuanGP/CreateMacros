// Utilitário para detecção de ambiente e hardware binding

// Função de hash simples (compatível com browser e Electron)
const simpleHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).toUpperCase()
}

// Função de hash mais complexa (simulada)
const complexHash = (str) => {
  let hash = ''
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash += char.toString(16).toUpperCase()
  }
  return hash.substring(0, 32) // Limita a 32 caracteres
}

// Detecção de ambiente
export const getEnvironment = () => {
  // Verifica se está rodando no Electron (desktop)
  if (typeof window !== 'undefined' && window.electron) {
    return 'desktop'
  }
  
  // Verifica se está rodando no Capacitor (mobile)
  if (typeof window !== 'undefined' && window.capacitor) {
    return 'mobile'
  }
  
  // Padrão: web (navegador)
  return 'web'
}

// Detecção de hardware (apenas para desktop)
export const getHardwareInfo = async () => {
  const environment = getEnvironment()
  
  if (environment !== 'desktop') {
    return null
  }

  try {
    // Usando Node.js os module (disponível no Electron)
    const os = require('os')
    
    // CPU Info
    const cpu = os.cpus()[0]
    const cpuInfo = `${cpu.manufacturer}_${cpu.model}`.replace(/\s+/g, '_')
    
    // MAC Address
    const interfaces = os.networkInterfaces()
    let macAddress = 'unknown'
    
    for (const name of Object.keys(interfaces)) {
      for (const networkInterface of interfaces[name]) {
        if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
          macAddress = networkInterface.mac.replace(/:/g, '')
          break
        }
      }
      if (macAddress !== 'unknown') break
    }
    
    // Hardware ID combinado
    const hardwareId = `${cpuInfo}_${macAddress}`
    
    return {
      cpu: cpuInfo,
      mac: macAddress,
      hardwareId: hardwareId
    }
  } catch (error) {
    console.error('Erro ao obter informações de hardware:', error)
    return null
  }
}

// Criptografia do Hardware ID (cliente -> servidor)
export const encryptHardwareId = (hardwareId) => {
  const clientKey = "K8mN2pQ7vX4wR9tY6uI3oP1aZ5sD0fG"
  const combined = hardwareId + clientKey
  
  // Hash complexo
  const hash = complexHash(combined)
  
  // Simula Base64 e limpeza para 16 caracteres
  const clean = hash.replace(/[^A-Z0-9]/g, '')
  
  return clean.substring(0, 16)
}

// Validação de licença (servidor -> cliente)
export const validateLicense = (encryptedHardwareId, licenseKey) => {
  const serverKey = "H7jL4nO9wQ2xS5vT8uK1mI6pA3zE0bC"
  const combined = encryptedHardwareId + serverKey
  
  // Gera a licença esperada
  const expectedHash = complexHash(combined)
  const expectedLicense = expectedHash.replace(/[^A-Z0-9]/g, '').substring(0, 16)
  
  return licenseKey === expectedLicense
}

// Sistema de licenciamento
export const checkLicense = async () => {
  const environment = getEnvironment()
  
  // Web: sempre permite (demo) - não deveria chegar aqui
  if (environment === 'web') {
    return { valid: true, isDemo: true }
  }
  
  // Desktop: verifica hardware binding
  if (environment === 'desktop') {
    try {
      const hardwareInfo = await getHardwareInfo()
      
      if (!hardwareInfo) {
        return { valid: false, error: 'Não foi possível obter informações de hardware' }
      }
      
      // Criptografa o hardware ID
      const encryptedId = encryptHardwareId(hardwareInfo.hardwareId)
      
      return {
        valid: false,
        encryptedHardwareId: encryptedId,
        hardwareInfo: hardwareInfo
      }
    } catch (error) {
      console.error('Erro ao verificar licença:', error)
      return { valid: false, error: 'Erro ao verificar licença' }
    }
  }
  
  // Mobile: similar ao desktop
  if (environment === 'mobile') {
    return { valid: false, error: 'Versão mobile não implementada' }
  }
  
  return { valid: false, error: 'Ambiente não reconhecido' }
} 