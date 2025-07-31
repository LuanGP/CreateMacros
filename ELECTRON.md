# CreateMacros - Versão Desktop (Electron)

## 🖥️ Sobre

Esta é a versão desktop do CreateMacros, compilada com Electron para funcionar offline com sistema de licenciamento por hardware binding.

## 🚀 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação das Dependências
```bash
npm install
```

### Desenvolvimento
```bash
# Inicia o servidor Vite + Electron
npm run electron:dev
```

### Build para Produção
```bash
# Windows
npm run electron:build:win

# macOS
npm run electron:build:mac

# Linux
npm run electron:build:linux

# Todas as plataformas
npm run electron:build
```

## 🔐 Sistema de Licenciamento

### Como Funciona
1. **Detecção de Hardware**: O app detecta CPU + MAC Address
2. **Criptografia**: Hardware ID é criptografado com chave cliente
3. **Geração de Licença**: Você usa o gerador Lua para criar a licença
4. **Validação**: App valida a licença com hardware local

### Fluxo de Venda
1. Cliente instala o app
2. App mostra Hardware ID criptografado
3. Cliente envia o ID para você
4. Você gera a licença com o gerador Lua
5. Cliente insere a licença no app
6. App valida e funciona normalmente

### Gerador de Licença (Lua)
```lua
-- Use em: https://www.tutorialspoint.com/compilers/online-lua-compiler.htm

function generateLicense(encryptedHardwareId)
    local serverKey = "CreateMacrosServer2024!@#"
    local combined = encryptedHardwareId .. serverKey
    -- Implementar hash SHA-256 real
    return "LICENCA_GERADA"
end

-- Exemplo
local encryptedId = "X7Y9Z2A4B6C8D1E3" -- Do cliente
local license = generateLicense(encryptedId)
print("Licença: " .. license)
```

## 📁 Estrutura do Projeto

```
CreateMacros/
├── src/                    # Código React (web + desktop)
├── electron/              # Configuração Electron
│   └── main.js           # Processo principal
├── dist/                  # Build web (gerado)
├── dist-electron/         # Build desktop (gerado)
└── package.json          # Scripts e dependências
```

## 🔧 Configuração

### package.json Scripts
- `electron:dev`: Desenvolvimento com hot reload
- `electron:build:win`: Build para Windows
- `electron:build:mac`: Build para macOS  
- `electron:build:linux`: Build para Linux

### electron-builder
Configurado para gerar:
- **Windows**: Instalador NSIS (.exe)
- **macOS**: App bundle (.app)
- **Linux**: AppImage (.AppImage)

## 🛡️ Segurança

### Hardware Binding
- CPU + MAC Address únicos
- Criptografia dupla (cliente + servidor)
- Licença vinculada ao hardware específico

### Anti-Pirataria
- Detecção de ambiente (web/desktop)
- Validação offline
- Sem servidor necessário

## 📱 Multiplataforma

### Funcionamento
- **Web**: Demo com limitações
- **Desktop**: Versão completa com licenciamento
- **Mobile**: Futuro (Capacitor)

### Detecção Automática
```javascript
if (window.electron) {
  // Desktop (Windows/Mac/Linux)
} else if (window.capacitor) {
  // Mobile (Android/iOS)
} else {
  // Web (Navegador)
}
```

## 🚀 Deploy

### Web (Netlify)
```bash
npm run build
# Upload dist/ para Netlify
```

### Desktop
```bash
npm run electron:build:win  # Windows
npm run electron:build:mac  # macOS
npm run electron:build:linux # Linux
```

## 📝 Notas

- O mesmo código funciona em web e desktop
- Hardware binding apenas no desktop
- Web sempre funciona como demo
- Build único para todas as plataformas desktop 