# AGENTS.md  

## Conventions  
Todo componente deve ter um showcase 
O código exemplo do showcase deve refletir exatamente o exemplo de modo que eu copie e cole e obtenha o mesmo resultado  
Todo showcase deve ter um sgPlayground para que o dev consiga simular o funcionamento  (tem de ficar 1:1)
Os exemplos do showcase, devem sempre que possivel, utilizar componentes Sg ao invés de componentes nativos  
Exemplo 
    button -> sgButton 
    div flex -> sgGrid

dentro do componente, quando possivel utilize sempre os componentes sg em substituição aos componentes nativos,
Sempre ajuste o ISO para nao quebrar a acentuação 
Aplique no showcase o I18NReady 

criar uma "Referência de Props" com todas as propriedades exemplo:

exemplo:
Referência de Props 
Prop	Tipo	Padrão	Descrição
id	string	-	Identificador único do carrossel
items	ReactNode[]	-	Array de items a serem exibidos no carrossel (obrigatório)
numVisible	number	1	Número de items visíveis ao mesmo tempo
numScroll	number	1	Número de items que rolam por vez
orientation	"horizontal" | "vertical"	"horizontal"	Orientação do carrossel
circular	boolean	true	Ativa modo circular (loop infinito)
autoPlay	boolean	false	Ativa navegação automática
autoPlayInterval	number	3000	Intervalo de auto play em milissegundos
showNavigators	boolean	true	Mostra botões de navegação
showIndicators	boolean	true	Mostra indicadores (dots)
className	string	-	Classe CSS customizada para o container
itemClassName	string	-	Classe CSS customizada para os items
width	number | string	"100%"	Largura do container do carrossel
height	number | string	-	Altura do container do carrossel
gap	number	16	Espaçamento entre items em pixels
onIndexChange	(index: number) => void	-	Callback chamado quando o Índice ativo muda
customNavigators	{ prev?: ReactNode; next?: ReactNode }	-	Botões de navegação customizados



o showcase vai ficar sempre:

[ essa parte nao scrola junto com a tela 
<Nome do componente> 
Explicação do objetivo e funcionalidades do componente 
<Link href# para o exemplo> 
]

Exemplos 
1) - <descricao do exemplo >
exemplo executando 
codigo 
.
.
.

N) - <descricao do exemplo >
exemplo executando 
codigo 

Playground (usando o SgPlayground)


props reference 

