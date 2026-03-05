// TODO - Retirar referencias primefaces do projeto 

// TODO - na pasta apps\showcase\src\i18n ainda tem os .json, nao tinha mudado tudo pra .ts ?
// TODO - Renomear a propriedade variant para style nos seguintes componentes sgCard,sgClock,sgFloaActionButton, sgBadge,sgBreadCrumb,sgMenu,sgPageControl, (validar antes se ja nao tem uma prop style)

// TODO - renomear o componente SgCurrencyEdit para SgInputCurrency para ficar mais coerente com a suite

// TODO - remover o negocio de 'cancel' do sgRadiogroup

// TODO - refatorar password https://chatgpt.com/c/698a8cd9-372c-8326-a8c2-9768339d80d3

// TODO - DockZone com 12 areas 

dockzone 
só uma pergunta :
hoje o dockLayout tem 4 positions 
top, bottom, left e right

o que vc acha de ter 

alinha horizontal :
top-left, top-center- e top-right
bottom-left, bottom-center- e bottom-right

alinha vertical 
left-top, left-center e left-bottom
rigth-top, rigth-center e rigth-bottom
e free (posso arrastar para qualquer parte dentro do docklayout) 

o que acha disso? iria complicar demais ?
apenas responda
É uma ideia muito boa e bem pensada. Não iria complicar demais, mas tem um custo real:

O que muda internamente:

zone deixa de ser um enum simples de 4 valores → vira algo como "top-left" | "top-center" | "top-right" | ... (12 + free)
O DockZone precisa saber renderizar em sub-regiões (ex: top tem 3 slots independentes)
A lógica de drag-and-drop precisa detectar em qual sub-zona o item foi solto
O horizontalDockAlign que já existe no SgMenu (left/center/right) é exatamente isso — já foi criado pensando nessa direção
O free é o mais complexo — precisa de posicionamento absoluto dentro do DockLayout, detecção de colisão, e persistência de coordenadas X/Y além de zona.

Minha opinião: o modelo de 12 zonas alinhadas vale muito a pena — resolve casos reais de layout sem a complexidade do free. O free pode ser uma fase 2. O horizontalDockAlign já está parcialmente implementado no SgMenu, então metade do trabalho já existe.



// TODO - Correção sgDiscardDigit 
no discardDigit,  exemplo basico, clico no proximo deve colocar uma carta
e quando clico no anterior deve retirar uma carta 
e os textos dos botoes do exemplo deveriam ser i18n


// TODO - separar em Digits 

// TODO - separar components, providers e hooks 

// TODO - separar cli 

// TODO - Criar provider generico @seedgrid/fe-i18n
 O monorepo já está pronto para novo pacote (packages/*): pnpm-workspace.yaml.
Já existe um “núcleo” de i18n no components: packages/seedgrid-fe-components/src/i18n/index.ts.
O CI de publish hoje está focado no fe-components: .github/workflows/deploy-components.yml.
Existem 2 pontos que aumentam custo se mover i18n de lugar: manifest.ts e shims do SgPlayground.tsx.
Estimativa de custo (realista):

Fase 1 (recomendada): criar @seedgrid/fe-i18n genérico e manter API atual no fe-components via reexport/adapter, sem breaking change: 6-10h.
Fase 2: ajustar pipeline de publish para novo pacote + docs/showcase de uso: 4-8h.
Se quiser unificar também i18n do showcase inteiro (hoje ele tem provider próprio em apps/showcase/src/i18n/index.ts): +8-14h.
Resumo curto: sim, compensa e dá para manter monorepo; custo total de algo bem feito fica entre 1 e 3 dias, dependendo de migrar só components ou também showcase.
Se quiser, eu implemento já a Fase 1 sem quebrar API pública atual.


// TODO - Propriedade dragleble no sgCard sempre free (salvar no sgEnvironmentProvider)

// TODO - Criar estrutura padrao pra gadgets (dentro de um sgCard free dragleable)



// TODO -  Criar sgToastHost 

// TODO - Criar sgCheckboxGroup - recebe uma lista de componentes, retorna uma lista de values checked 


// TODO - criar OrderList - https://showcase.primefaces.org/ui/data/orderList.xhtml?jfwid=036be

// TODO - Criar pickList  - https://showcase.primefaces.org/ui/data/pickList.xhtml?jfwid=036be

// TODO - criar Schedule  - https://showcase.primefaces.org/ui/data/schedule/basic.xhtml?jfwid=036be
// TODO - criar schedule configuration - https://showcase.primefaces.org/ui/data/schedule/configuration.xhtml?jfwid=036be

// TODO - dashboard - investigar https://showcase.primefaces.org/ui/panel/dashboard.xhtml?jfwid=036be


// TODO - Paginator - https://showcase.primefaces.org/ui/data/datatable/paginator.xhtml?jfwid=036be

// TODO - Datatable - https://showcase.primefaces.org/ui/data/datatable/rowGroup.xhtml?jfwid=036be


// TODO - por que somente alguns componentes tem o className?  (sgRadioGrouup)










