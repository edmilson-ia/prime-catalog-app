# Estoque em tempo real no catálogo

## O que será feito
- Consultar no Lovable Cloud somente o nome e a quantidade em estoque dos produtos.
- Normalizar os nomes (remover espaços extras e comparar em maiúsculas) antes de cruzar com o catálogo atual.
- Atualizar os dados automaticamente a cada 45 segundos enquanto o catálogo estiver aberto.
- Mostrar `FORA DE ESTOQUE` em vermelho somente quando um produto encontrado tiver quantidade nula, zero ou negativa.
- Desativar os controles de compra desses produtos; itens ainda não encontrados continuarão funcionando como hoje.

## Detalhes técnicos
- Usar o cliente de dados já gerado no projeto e TanStack Query para cache, deduplicação e polling.
- Centralizar a consulta no catálogo e repassar apenas a quantidade correspondente para cada cartão.
- Preservar preços, imagens, descrições e todas as outras telas e funções.
- Validar o catálogo no navegador após a implementação.
