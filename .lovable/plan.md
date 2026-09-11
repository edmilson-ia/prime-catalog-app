# Painel administrativo de promoções

## Objetivo
Adicionar acesso administrativo exclusivo para editar preços promocionais, refletindo essas promoções automaticamente no catálogo, carrinho e pedido pelo WhatsApp.

## Implementação
- Ativar login por e-mail e senha, impedir novos cadastros públicos e criar somente o administrador informado.
- Adicionar `preco_promocional` aos produtos e uma regra administrativa separada que permita a esse usuário alterar apenas essa coluna.
- Criar `/admin` para login e `/admin/produtos` para a lista protegida com salvar e remover promoção.
- Ampliar a atualização automática atual para trazer estoque e promoção juntos.
- Aplicar o preço promocional no card, carrinho, totais e mensagem do WhatsApp, mantendo todo o comportamento de estoque existente.
- Validar login, bloqueio de acesso, gravação/remoção de promoção e cálculo do pedido.

## Detalhes técnicos
- Sem tabela de perfil; a autorização administrativa ficará em uma tabela de papéis separada, protegida por regras de acesso.
- Novos cadastros ficarão desativados; usuários autenticados sem papel de administrador não poderão editar promoções.
- A permissão no banco será limitada à coluna de preço promocional, sem liberar alterações de estoque ou nomes.
- A senha temporária será gerada de forma segura e o usuário administrador será criado com e-mail confirmado.
