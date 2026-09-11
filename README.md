# Prime Order Hub

Crie um aplicativo web mobile-first chamado Prime Alimentos, um catálogo digital de distribuidora de bebidas e alimentos, com layout de app dentro de uma “moldura de celular” centralizada na tela (largura máxima ~400px, cantos arredondados, sombra), navegação por abas fixas na parte inferior, e um botão flutuante de pedido.

Identidade visual

	•	Nome do app: Prime Alimentos

	•	Logo: emblema circular azul-marinho com coroa dourada, texto “PRIME” em branco e uma faixa vermelha com “ALIMENTOS” (vou anexar o arquivo da logo — use-o no cabeçalho, em formato circular, e centralizado na tela de Início).

	•	Paleta de cores (tudo em tons de azul, nada de verde/teal):

	•	Azul escuro (ink/headers): #152B6B

	•	Azul primário (botões, cabeçalho): #3355DE

	•	Azul médio (hover): #4569EA

	•	Azul claro (gradiente): #6C8CF0

	•	Azul bem claro (fundo do app): #F4F6FD

	•	Tint azul claro (chips, cards): #E8ECFC

	•	Dourado/âmbar (destaque, CTA): #E8A33D

	•	Dourado escuro (hover): #CE8A26

	•	Texto principal: #1E2A2E

	•	Texto secundário: #5C6B6E

	•	Verde do WhatsApp (só no ícone do WhatsApp, não usar em mais nada): #25D366

	•	Tipografia: títulos em fonte geométrica moderna (ex: Sora), texto em Inter.

	•	Evite qualquer aparência “genérica de IA” (sem gradiente roxo/rosa clichê, sem cream+serifada).

Navegação (5 abas fixas embaixo)

	1.	Início (ícone casa)

	2.	Catálogo (ícone sacola)

	3.	Contato (ícone balão de mensagem)

	4.	Cadastro (ícone pessoa+)

	5.	Empresa (ícone prédio)

A aba ativa fica destacada em azul primário; as demais em cinza-azulado.

Botão flutuante “Pedidos”

	•	Fica fixo em todas as telas, canto inferior direito, formato de pílula (não círculo), fundo azul primário.

	•	Contém: ícone de WhatsApp (dourado) + texto “Pedidos” + (se houver itens no carrinho) uma bolha dourada com o número de itens.

	•	Ao clicar:

	•	Se o carrinho tiver itens: abre o WhatsApp (número +55 21 98801-2670) com uma mensagem pré-formatada listando cada produto, quantidade, subtotal e o total geral.

	•	Se o carrinho estiver vazio: abre o WhatsApp com uma mensagem genérica “Olá, Prime Alimentos! Gostaria de mais informações.”

Aba: Início

	•	Painel no topo com fundo em gradiente azul (do azul claro pro azul escuro), com a logo centralizada (tamanho pequeno/médio, não esticada, sem cortar nada) e, abaixo dela, o texto “Rio de Janeiro · Entrega no mesmo dia” em dourado.

	•	Botão grande “Ver catálogo completo · [N] itens” que leva pra aba Catálogo.

	•	Um badge/aviso: “Pagamento via Pix e Dinheiro” (sem outras opções de pagamento listadas, sem menção a “entrega rápida”).

	•	Seção “Categorias em destaque”: grade 2 colunas com 6 categorias principais (ex: Cervejas, Refrigerantes, Whisky, Vinhos & Chopps, Doces, Carnes), cada uma com ícone colorido próprio da categoria. Ao clicar numa categoria, vai direto pro Catálogo já filtrado naquela categoria (não passa pela tela geral do catálogo).

Aba: Catálogo

	•	Campo de busca por nome do produto no topo (busca em todos os produtos, ignorando a categoria selecionada quando o usuário digita algo).

	•	Chips horizontais roláveis com todas as categorias (ver lista completa abaixo), cada chip com ícone + nome; categoria ativa destacada em azul.

	•	Lista de produtos da categoria selecionada (ou resultado da busca), cada card com:

	•	Foto do produto (se disponível) OU, se não houver foto, um selo colorido com ícone da categoria (cor exclusiva por categoria, ver tabela abaixo) — nunca deixar espaço em branco/quebrado.

	•	Nome do produto

	•	Descrição curta (opcional, alguns produtos têm ex: “Consultar sabores disponíveis em estoque.”)

	•	Preço em R$ (formato brasileiro, ex: R$ 46,00)

	•	Botão “Adicionar” (vira um contador +/- depois de adicionado)

	•	Contador de carrinho no cabeçalho quando há itens.

	•	Ao abrir o carrinho (drawer/bottom sheet): lista dos itens com quantidade editável, total geral, e botão “Finalizar pedido no WhatsApp” que monta a mensagem e abre o WhatsApp.

Categorias (18) — nome, ícone sugerido, cor de destaque

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b6635f64-36b2-4573-acbe-4834cb9f0bc7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
