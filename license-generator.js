// Gerador de Licenças CreateMacros
// Use: node license-generator.js

// Função de hash complexa (mesma do app)
const complexHash = (str) => {
  let hash = ''
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash += char.toString(16).toUpperCase()
  }
  return hash.substring(0, 32)
}

// Segunda criptografia (você -> licença)
const generateLicense = (encryptedHardwareId) => {
  const serverKey = "H7jL4nO9wQ2xS5vT8uK1mI6pA3zE0bC"
  const combined = encryptedHardwareId + serverKey
  
  // Hash complexo
  const hash = complexHash(combined)
  const clean = hash.replace(/[^A-Z0-9]/g, '')
  
  return clean.substring(0, 16)
}

// Interface de linha de comando
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.log('=== Gerador de Licenças CreateMacros ===')
console.log('Digite o Hardware ID CRIPTOGRAFADO do cliente:')

rl.on('line', (input) => {
  const encryptedFromClient = input.trim()
  
  if (!encryptedFromClient) {
    console.log('Hardware ID inválido. Tente novamente:')
    return
  }
  
  const license = generateLicense(encryptedFromClient)
  
  console.log('\n=== RESULTADO ===')
  console.log('Hardware ID Criptografado:', encryptedFromClient)
  console.log('Licença gerada:', license)
  console.log('=== Copie a licença acima ===\n')
  
  rl.close()
})

rl.on('close', () => {
  console.log('Gerador finalizado.')
  process.exit(0)
}) 