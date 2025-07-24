# CreateMacros

Um gerador web para criar macros do GrandMA2 de forma fácil e intuitiva.

## 🚀 Funcionalidades

- **Interface moderna e responsiva** com React + Tailwind CSS
- **Gerador de Take Selection** com grupos e efeitos configuráveis
- **Preview em tempo real** do código da macro
- **Download do arquivo** da macro gerada
- **Sistema expansível** para novos tipos de macros

## 🛠️ Tecnologias

- **React 18** - Framework JavaScript
- **Vite** - Build tool rápida
- **Tailwind CSS** - Framework CSS utilitário
- **Lucide React** - Ícones modernos

## 📦 Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no navegador

## 🎯 Como Usar

### Take Selection Generator

1. **Nome da Macro**: Digite um nome para sua macro
2. **Adicionar Grupos**: Clique em "Adicionar Grupo" para criar novos grupos
3. **Configurar Grupos**: 
   - Renomeie os grupos conforme necessário
   - Use as setas para reordenar os grupos
4. **Adicionar Efeitos**: Para cada grupo, adicione efeitos com:
   - Nome do efeito
   - Tipo (Dim, Color, Position, Gobo, Beam)
5. **Preview**: Veja o código gerado em tempo real
6. **Download**: Baixe o arquivo da macro

### Exemplo de Macro Gerada

```
Take Selection
SetUserVar $selection = "Selection"

Group 1
Name "Grupo Principal"
Effect 1
Name "Efeito Dim"
Type dim
End
End

Group 2
Name "Grupo Secundário"
Effect 1
Name "Efeito Color"
Type color
End
End

End
```

## 🚀 Deploy no Netlify

1. Conecte seu repositório ao Netlify
2. Configure o build:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Deploy automático a cada push

## 🔧 Desenvolvimento

### Estrutura do Projeto

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

### Adicionando Novos Geradores

1. Crie um novo componente em `src/components/generators/`
2. Adicione o gerador ao array `generators` em `MacroGenerator.jsx`
3. Implemente a lógica de geração da macro

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests. 