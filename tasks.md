
### TASKS SHOWCASE 

### Criação dos arquivos de exemplo:
o que vai ser a tarefa:
    - dentro da pasta do showcase de cada componente, criar uma subpasta samples, nessa pasta, colocar os exemplos ex: apps\showcase\src\app\components\digits\sg-discard-digit\samples, apps\showcase\src\app\components\sg-input-text\samples, etc
    - os arquivos de dos exemplos devem ter o nome do exemplo no showcase com extensao .tsx.sample ex: no caso do sgInputText "basico( RHF ).tsx.sample", "obrigatorio.tsx.sample", "controlado(caso necessario).tsx.sample", "contador de caracteres.tsx.sample", etc 
    - os exemplos comuns continuam no padrão `.tsx.sample`
    - quando a página tiver `SgPlayground`, extrair o código interativo para um arquivo dedicado no padrão `.tsx.playground`
    - utilizar o esbuild para validar os codigos se estão compiláveis, lembre-se que o usuário desenvolvedor vai copiar e colar esses codigos e os mesmos devem funcionar 


### Critério de “não inventar”

Você precisa travar o comportamento do agente:

não faça refactors extras;
não altere API pública;
não mude comportamento visual;
faça apenas a extração mecânica dos samples/playground e a adaptação mínima necessária para compilar.

### Checklist de acompanhamento

#### Inputs
[x] SgInputText: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico (RHF)
    [x] 2) Obrigatório
    [x] 3) Controlado (caso necessário)
    [x] 4) Contador de caracteres
    [x] 5) Tamanho mínimo
    [x] 6) Mínimo de palavras
    [x] 7) Validação customizada
    [x] 8) Ícone prefixo
    [x] 9) Prefixo e sufixo
    [x] 10) Botões de ícone
    [x] 11) Variações visuais
    [x] 12) Sem botão limpar
    [x] 13) Largura e borda
    [x] 14) Desabilitado e somente leitura
    [x] 15) Erro externo
    [x] 16) Standalone (form completo)
    [x] 17) Eventos (standalone)
    [x] 18) Posição do rótulo
    [x] 19) Elevação

[x] SgInputTextArea: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Controlado
    [x] 4) Contador
    [x] 5) Tamanho mínimo
    [x] 6) Mínimo de palavras
    [x] 7) Mínimo de linhas
    [x] 8) Validação customizada
    [x] 9) Tamanho e linhas
    [x] 10) Ícone prefixo
    [x] 11) Variações visuais
    [x] 12) Sem botão limpar
    [x] 13) Largura e borda
    [x] 14) Desabilitado e somente leitura
    [x] 15) Erro externo
    [x] 16) Eventos
    [x] 17) Posição do rótulo
    [x] 18) Playground
[x] SgInputPassword: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Validação
    [x] 4) Variações visuais
    [x] 5) Eventos
    [x] 6) Posição do rótulo
    [x] 7) Playground
[x] SgInputOTP: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Máscara customizada
    [x] 3) Colagem + onComplete
    [x] 4) Acesso por ref
    [x] 5) Playground
- SgInputSelect: página própria do showcase não encontrada; item listado no índice, mas sem rota dedicada em `apps/showcase/src/app/components`
    - pendente de decisão: criar página dedicada ou remover do índice atual
[x] SgInputDate: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Intervalo
    [x] 3) Data fixa
    [x] 4) Posição do rótulo
    [x] 5) Playground
[x] SgInputBirthDate: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Intervalo
    [x] 4) Posição do rótulo
    [x] 5) Playground
[x] SgToggleSwitch: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Com ícones (on/off)
    [x] 3) Remote (simulação de update)
    [x] 4) Controlado externamente + captura do valor
    [x] 5) React Hook Form
    [x] 6) Estados Disabled / ReadOnly
    [x] 7) Playground
[x] SgInputEmail: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Inválido
    [x] 4) Bloqueados
    [x] 5) Validação customizada
    [x] 6) Lista de bloqueados
    [x] 7) JSON
    [x] 8) Variações visuais
    [x] 9) Sem botão limpar
    [x] 10) Largura e borda
    [x] 11) Desabilitado
    [x] 12) Eventos
    [x] 13) Posição do rótulo
    [x] 14) Playground
[x] SgInputCPF: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Tamanho
    [x] 4) Inválido
    [x] 5) Validação customizada
    [x] 6) Variações visuais
    [x] 7) Sem botão limpar
    [x] 8) Largura e borda
    [x] 9) Desabilitado
    [x] 10) Eventos
    [x] 11) Posição do rótulo
    [x] 12) Playground
[x] SgInputCNPJ: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Alfanumérico
    [x] 3) Lista alfanumérica
    [x] 4) CNPJ público
    [x] 5) Obrigatório
    [x] 6) Tamanho
    [x] 7) Inválido
    [x] 8) Validação customizada
    [x] 9) Variações visuais
    [x] 10) Sem botão limpar
    [x] 11) Largura e borda
    [x] 12) Desabilitado
    [x] 13) Eventos
    [x] 14) Posição do rótulo
    [x] 15) Playground
[x] SgInputCPFCNPJ: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Inválido
    [x] 4) Validação customizada
    [x] 5) Alfanumérico
    [x] 6) Lista alfanumérica
    [x] 7) Variações visuais
    [x] 8) Sem botão limpar
    [x] 9) Largura e borda
    [x] 10) Desabilitado
    [x] 11) Eventos
    [x] 12) Posição do rótulo
    [x] 13) Playground
[x] SgInputPostalCode: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Países
    [x] 3) Obrigatório
    [x] 4) Controlado
    [x] 5) Validação customizada
    [x] 6) ViaCEP
    [x] 7) Ícone prefixo
    [x] 8) Prefixo e sufixo
    [x] 9) Botões de ícone
    [x] 10) Variações visuais
    [x] 11) Largura e borda
    [x] 12) Desabilitado e somente leitura
    [x] 13) Standalone
    [x] 14) Eventos
    [x] 15) Posição do rótulo
    [x] 16) Playground
[x] SgInputPhone: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Inválido
    [x] 4) Validação customizada
    [x] 5) Variações visuais
    [x] 6) Sem botão limpar
    [x] 7) Largura e borda
    [x] 8) Desabilitado
    [x] 9) Eventos
    [x] 10) Posição do rótulo
    [x] 11) Playground
[x] SgAutocomplete: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Customizado
    [x] 3) Agrupado
    [x] 4) Dropdown
    [x] 5) Footer
    [x] 6) Tamanho mínimo
    [x] 7) Border radius
    [x] 8) Playground
[x] SgCombobox: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico com lista de objetos
    [x] 2) Controlado por value
    [x] 3) Source async + custom render
    [x] 4) Border radius
    [x] 5) Playground
[x] SgSlider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Controle externo
    [x] 3) Step e width
    [x] 4) className, ariaLabel e disabled
    [x] 5) inputProps
    [x] 6) Playground
[x] SgStepperInput: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Controle externo
    [x] 3) Read-only e disabled
    [x] 4) Playground
[x] SgTextEditor: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Sem CSS
    [x] 3) Desabilitado
    [x] 4) Border radius
    [x] 5) Playground
[x] SgDatatable: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Filtros
    [x] 3) Seleção
    [x] 4) Templates
    [x] 5) Ações
    [x] 6) Controlado
    [x] 7) Server-side
    [x] 8) Loading e vazio
    [x] 9) Playground
[x] SgInputNumber: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Controlado
    [x] 4) Validação customizada
    [x] 5) Ícone prefixo
    [x] 6) Prefixo e sufixo
    [x] 7) Botões de ícone
    [x] 8) Sem negativos
    [x] 9) Sem decimais
    [x] 10) Mínimo e máximo
    [x] 11) Valor vazio
    [x] 12) Variações visuais
    [x] 13) Standalone
    [x] 14) Eventos
    [x] 15) Largura e borda
    [x] 16) Posição do rótulo
    [x] 17) Playground
[x] SgInputCurrency: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Obrigatório
    [x] 3) Controlado
    [x] 4) Validação customizada
    [x] 5) Moeda
    [x] 6) Símbolo
    [x] 7) Botões de ícone
    [x] 8) Sem negativos
    [x] 9) Sem decimais
    [x] 10) Mínimo e máximo
    [x] 11) Valor vazio
    [x] 12) Variações visuais
    [x] 13) Standalone
    [x] 14) Eventos
    [x] 15) Largura e borda
    [x] 16) Playground

#### Layout e navegação
[x] SgGroupBox: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Formulário
    [x] 3) Tamanho
    [x] 4) className
    [x] 5) Playground
[x] SgCard: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Leading e trailing
    [x] 3) Colapsável
    [x] 4) Variantes
    [x] 5) Surface colors
    [x] 6) Draggable + persistence
    [x] 7) Playground
[x] SgAccordion: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico vertical (single)
    [x] 2) Multiple + collapsible
    [x] 3) Horizontal
    [x] 4) Controlado por estado
    [x] 5) Custom items + header background
    [x] 6) Color customization example
    [x] 7) Playground
[x] SgSkeleton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basic shapes
    [x] 2) Text widths
    [x] 3) Animation
    [x] 4) Card placeholder
    [x] 5) List and table
    [x] 6) Playground
[x] SgScreen: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Complete example
    [x] 2) Playground
[x] SgDockScreen: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Playground
[x] SgMainPanel: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Complete example
    [x] 2) Playground
[x] SgPanel: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) align + width + height
    [x] 2) span + rowSpan
    [x] 3) borderStyle + padding + children
    [x] 4) scrollable + scrollbarGutter
    [x] 5) Combined example
    [x] 6) Playground
[x] SgGrid: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Columns responsivo
    [x] 2) Auto-Fit + RowSpan
    [x] 3) Playground
[x] SgStack: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Column + Row
    [x] 2) Playground
[x] SgBadge: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Variants
    [x] 3) Sizes
    [x] 4) Counter
    [x] 5) Actions
    [x] 6) Playground
[x] SgBadgeOverlay: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Placements
    [x] 3) Playground
[x] SgAvatar: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Shape e tamanho
    [x] 3) Severity e cores customizadas
    [x] 4) Avatar Group
    [x] 5) Playground
[x] SgBreadcrumb: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Caminho externo
    [x] 3) Overflow
    [x] 4) Playground
[x] SgMenu: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Sidebar fixa
    [x] 2) Drawer mobile
    [x] 3) PanelMenu
    [x] 4) Tiered
    [x] 5) MegaMenu horizontal
    [x] 6) MegaMenu vertical
    [x] 7) Sidebar dockable
    [x] 8) Playground
[x] SgExpandablePanel: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Inline controlado + resize
    [x] 2) Overlay + comportamento
    [x] 3) defaultOpen + estilização
    [x] 4) Acessibilidade + fade
    [x] 5) Sem backdrop + animation none
    [x] 6) Playground
[x] SgDialog: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Severity
    [x] 3) No close
    [x] 4) Strict
    [x] 5) Auto close
    [x] 6) Playground
[x] SgToolBar: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) onClick assíncrono com toast
    [x] 3) Orientação e quebra
    [x] 4) Cores de fundo
    [x] 5) Playground
[x] SgDockLayout: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Playground
[x] SgTreeView: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Icon tone
    [x] 3) Confirm
    [x] 4) Size
    [x] 5) Expanded
    [x] 6) Json checked
    [x] 7) Playground
[x] SgPageControl: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Controle externo
    [x] 3) Ocultar página externamente
    [x] 4) Com hint nas abas
    [x] 5) Playground
[x] SgPopup: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Básico
    [x] 2) Ícone + hint
    [x] 3) Custom
    [x] 4) Playground
[x] SgPlayground: revisar se precisa pasta `samples` própria ou se fica apenas como infraestrutura

#### Ações, seleção e feedback
[x] SgButton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Icones
    [x] 3) Severities
    [x] 4) Elevated Buttons
    [x] 5) Rounded Buttons
    [x] 6) Ghost Buttons (Flat)
    [x] 7) Outlined + Elevation
    [x] 8) Outlined Buttons
    [x] 9) Rounded Icon Buttons
    [x] 10) Rounded Text Icon Buttons
    [x] 11) Rounded and Outlined Icon Buttons
    [x] 12) Sizes
    [x] 13) Loading
    [x] 14) Custom Colors
    [x] 15) Playground
[x] SgFloatActionButton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Positions
    [x] 2) Variants
    [x] 3) Shapes & Sizes
    [x] 4) Elevation
    [x] 5) Hint
    [x] 6) Actions - Linear Layout
    [x] 7) Circle Layout
    [x] 8) Semi-Circle Layout
    [x] 9) Quarter-Circle Layout
    [x] 10) Active Icon
    [x] 11) Animations
    [x] 12) Custom Color
    [x] 13) Disabled & Loading
    [x] 14) Drag & Drop
    [x] 15) Playground
[x] SgSplitButton: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Severidades
    [x] 3) Outlined
    [x] 4) Ghost
    [x] 5) Elevated
    [x] 6) Tamanhos
    [x] 7) Com icones
    [x] 8) Separadores de menu
    [x] 9) Disabled
    [x] 10) Loading
    [x] 11) Itens desabilitados
    [x] 12) Playground
[x] SgCheckboxGroup: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Orientation Horizontal
    [x] 3) Com Icones
    [x] 4) Apenas Icones (Icon Only)
    [x] 5) Selecao Controlada
    [x] 6) Controle Externo (setValue/getValue)
    [x] 7) Com Opcao Desabilitada
    [x] 8) Grupo Disabled
    [x] 9) Read-only
    [x] 10) Obrigatorio com Validacao
    [x] 11) Horizontal com Icones Coloridos
    [x] 12) Selection Style Highlight (Lista)
    [x] 13) Com GroupBox Customizado
    [x] 14) React Hook Form - Register
    [x] 15) Playground Interativo
    [x] 16) Check All (showCheckAll)
    [x] 17) Checked inicial no source
    [x] 18) Ref imperativo (getChecked / checkAll / clearAll)
[x] SgRadioGroup: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Orientation Horizontal
    [x] 3) Com Icones
    [x] 4) Apenas Icones (Icon Only)
    [x] 5) Selecao Controlada
    [x] 6) Controle Externo (setValue/getValue)
    [x] 7) Com Opcao Desabilitada
    [x] 8) Grupo Disabled
    [x] 9) Read-only
    [x] 10) Obrigatorio com Validacao
    [x] 11) Horizontal com Icones Coloridos
    [x] 12) Selection Style Highlight (Lista)
    [x] 13) Com GroupBox Customizado
    [x] 14) React Hook Form - Register
    [x] 15) Playground Interativo
[x] SgOrderList: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (controles internos)
    [x] 2) Selecao multipla + controles externos (ref)
    [x] 3) Drag and drop sem botoes
    [x] 4) Item template customizado e item desabilitado
    [x] 5) Ordem controlada por estado externo
    [x] 6) Playground interativo
[x] SgPickList: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Com Filtros
    [x] 3) Somente transferencia (sem ordenacao)
    [x] 4) Reordenacao com controles de lista
    [x] 5) Controles externos por ref
    [x] 6) Item template customizado
    [x] 7) Playground interativo
[x] SgRating: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Meia estrela + tooltip
    [x] 3) Read-only e desabilitado
    [x] 4) Tamanhos e quantidade de estrelas
    [x] 5) Cores e icones customizados
    [x] 6) Callbacks
    [x] 7) React Hook Form
    [x] 8) Campo obrigatorio
    [x] 9) Playground
[x] SgToastHost: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) O que e o SgToastHost
    [x] 2) Base setup
    [x] 3) Prioridade: layout vs pagina
    [x] 4) Toast types
    [x] 5) Loading by id (update same toast)
    [x] 6) toast.promise
    [x] 7) Actions and custom toast
    [x] 8) Options per toast
    [x] 9) Transparency
    [x] 10) Custom Colors
    [x] 11) Posicionamento
    [x] 12) Playground
[x] SgToaster: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Base setup
    [x] 2) Toast types
    [x] 3) Loading by id (update same toast)
    [x] 4) toast.promise
    [x] 5) Actions and custom toast
    [x] 6) Options per toast
    [x] 7) Transparency
    [x] 8) Custom Colors
    [x] 9) Playground
[x] SgConfirmationDialog: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Icone a esquerda
    [x] 3) Icone no topo
    [x] 4) Botoes customizados
    [x] 5) Surface customizada (customColor + elevation)
    [x] 6) Playground interativo

#### Digits
[x] SgFlipDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (0-9)
    [x] 2) Letras (A-Z)
    [x] 3) Variacoes de tamanho
    [x] 4) Sequencia estilo relogio
    [x] 5) Auto increment
    [x] 6) Playground
[x] SgFadeDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (0-9)
    [x] 2) Letras (A-Z)
    [x] 3) Cores customizadas
    [x] 4) Auto increment
    [x] 5) Sequencia estilo relogio
    [x] 6) Tamanhos
    [x] 7) Playground
[x] SgRoller3DDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (0-9)
    [x] 2) 2-digit padded value
    [x] 3) Letras (A-Z)
    [x] 4) Animacao de nomes
    [x] 5) Variacoes de tamanho
    [x] 6) Playground
[x] SgMatrixDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (0-9)
    [x] 2) Texto matricial
    [x] 3) Variacoes de color/backgroundColor
    [x] 4) Escala da matriz
    [x] 5) Playground
[x] SgNeonDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Texto em neon
    [x] 3) Neon script (referencia visual)
    [x] 4) Variacoes de color/background/shadow
    [x] 5) Escala e leitura
    [x] 6) Playground
[x] SgDiscardDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico
    [x] 2) Folhas sequenciais
    [x] 3) Variacoes de papel
    [x] 4) Fontes
    [x] 5) Auto descarte
    [x] 6) Paginacao imperativa (ref)
    [x] 7) Playground
[x] SgSegmentDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (0-9)
    [x] 2) Composicao estilo relogio
    [x] 3) Tamanhos
    [x] 4) Cores
    [x] 5) Playground
[x] SgSevenSegmentDigit: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (0-9)
    [x] 2) Hexadecimal (0-9 A-F)
    [x] 3) Temas de cor
    [x] 4) Tamanho e espessura
    [x] 5) Composicao estilo relogio
    [x] 6) Playground

#### Gadgets
[x] SgClock: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Analogico
    [x] 2) Tema inline (sem provider)
    [x] 3) Digital
    [x] 4) Roller 3D
    [x] 5) Flip
    [x] 6) Segment
    [x] 7) Seven Segment
    [x] 8) Fade
    [x] 9) Matrix
    [x] 10) Neon
    [x] 11) Discard
    [x] 12) Timezone
    [x] 13) Playground
[x] SgCalendar: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Basico (mes atual)
    [x] 2) Selecionado controlado + limite de datas
    [x] 3) Locale + multiplos meses
    [x] 4) Playground
[x] SgStringAnimator: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Roller 3D - nomes (left-aligned)
    [x] 2) Roller 3D - numeros (right-aligned)
    [x] 3) Estilo Flip
    [x] 4) Estilo Neon
    [x] 5) Estilo Fade
    [x] 6) Estilo Discard
    [x] 7) Estilo Matrix
    [x] 8) autoStart - animacao automatica
    [x] 9) Velocidades
    [x] 10) Playground
[x] SgQRCode: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Interactive example
    [x] 2) Playground
[x] SgLinearGauge: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Default (Horizontal)
    [x] 2) Vertical + Multi Pointers
    [x] 3) Playground
[x] SgRadialGauge: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Speedometer Style
    [x] 2) Thicker Ring (ringThickness)
    [x] 3) Axis Inversed + Angulos Custom
    [x] 4) Multi Pointers + Annotation
    [x] 5) Range Pointer (Donut)
    [x] 6) Other Props (size, labels and accessibility)
    [x] 7) Playground

#### Hooks
[x] useComponentsI18n: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Construir componentes conscientes do locale
[x] useSgEnvironment: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Default (sem provider)
    [x] 2) Com provider
[x] useSgPersistence: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Quando usar vs useSgPersistentState
[x] useSgPersistentState: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Com isolamento por namespace
    [x] 3) Serialize e deserialize customizados
    [x] 4) Versionamento de estado
[x] useSgTime: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Sem provider (fallback)
    [x] 3) Usando tick para re-renders

#### Providers
[x] SgClockThemeProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Tema local customizado
    [x] 3) Registro global
[x] SgComponentsI18nProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Troca dinamica de locale
    [x] 3) API imperativa (setComponentsI18n)
    [x] 4) Sobrescrita de mensagens
[x] SgEnvironmentProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Default (namespace vazio)
    [x] 2) Namespace customizado
    [x] 3) REST (por usuario)
    [x] 4) Hybrid (local + REST)
    [x] 5) Playground
[x] SgTimeProvider: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Uso basico
    [x] 2) Sem provedor (fallback)
    [x] 3) Integracao com Next.js

#### Outros
[x] SgWizard: criar `samples`, extrair `.tsx.playground`, separar exemplos da página e validar com esbuild
    [x] 1) Validacao automatica
    [x] 2) stepNavigation
    [x] 3) Stepper com Icones
    [x] 4) Stepper Numerado
    [x] 5) Labels customizados
    [x] 6) onBeforeNext async
    [x] 7) validateStep
    [x] 8) Playground
[x] SgBenchmark: decidir se entra no mesmo padrão de `samples` e validar com esbuild
    [x] 1) SgInputText (uncontrolled)
    [x] 2) Native input (uncontrolled)
    [x] 3) Playground
- Theme page: manter como documentação temática; não virar checklist próprio de `samples`
