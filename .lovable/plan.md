# Sincronização automática de estoque

## Resultado
- Criar um endpoint seguro `sync-estoque` no aplicativo para ler a aba pública `ESTOQUE` da planilha.
- Interpretar o CSV pelas colunas `PRODUTO` e `QUANTIDADE`, normalizando nomes com espaços colapsados e letras maiúsculas.
- Atualizar `quantidade_estoque` e `estoque_atualizado_em` somente para produtos encontrados.
- Retornar a quantidade atualizada e os nomes da planilha sem correspondência no catálogo.

## Segurança e agendamento
- Proteger o endpoint com um token privado gerado e mantido apenas no backend.
- Habilitar os recursos de agendamento e chamadas HTTP do banco.
- Agendar uma chamada ao endpoint a cada minuto usando a URL estável de prévia.
- A rotina administrativa continuará sendo a única capaz de alterar o estoque; clientes mantêm somente leitura.

## Validação
- Executar a sincronização manualmente após a configuração.
- Conferir no banco quantos produtos receberam estoque e informar os nomes não encontrados.
- Não alterar telas, produtos, preços, imagens ou o carrinho.

## Detalhes técnicos
- Nesta aplicação TanStack, novas Edge Functions não são suportadas; será usado um endpoint público do servidor com autenticação própria, equivalente para o cron.
- A execução a cada minuto representa 1.440 chamadas por dia e pode manter o backend ativo, elevando custos. A frequência será preservada porque foi solicitada para estoque quase em tempo real; o atraso máximo esperado é de cerca de um minuto.
