# Instruções de Instalação

## Pré-requisitos

### 1. Instalar Node.js
- Baixe o Node.js em: https://nodejs.org/
- Escolha a versão LTS (recomendada)
- Execute o instalador e siga as instruções
- Reinicie o terminal após a instalação

### 2. Verificar Instalação
```bash
node --version
npm --version
```

## Instalação do Projeto

### 1. Instalar Dependências
```bash
npm install
```

### 2. Executar em Desenvolvimento
```bash
npm run dev
```

### 3. Acessar o Projeto
Abra http://localhost:5173 no navegador

## Build para Produção

### 1. Gerar Build
```bash
npm run build
```

### 2. Preview do Build
```bash
npm run preview
```

## Deploy no Netlify

### 1. Conectar Repositório
- Faça login no Netlify
- Conecte seu repositório GitHub/GitLab

### 2. Configurar Build
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### 3. Deploy Automático
- A cada push para a branch principal, o Netlify fará deploy automático

## Estrutura do Projeto

```
create-macros/
├── src/
│   ├── components/
│   │   ├── generators/
│   │   │   └── TakeSelectionGenerator.jsx
│   │   ├── Header.jsx
│   │   ├── MacroGenerator.jsx
│   │   └── MacroPreview.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Funcionalidades

✅ **Gerador de Take Selection**
- Adicionar/remover grupos
- Adicionar/remover efeitos
- Reordenar grupos
- Preview em tempo real
- Download da macro

🔄 **Sistema Expansível**
- Fácil adição de novos geradores
- Interface modular
- Componentes reutilizáveis

## Próximos Passos

1. Instalar Node.js
2. Executar `npm install`
3. Executar `npm run dev`
4. Testar o gerador
5. Fazer deploy no Netlify 