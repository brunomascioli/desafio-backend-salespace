# Desafio de Estágio Backend - Salespace

## Tecnologias Utilizadas

- Node.js
- TypeScript
- Express
- Zod (validação)
- Jest (testes)
- Winston (logs)

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

O servidor irá escutar por requisições na porta 3000

3. Para os testes

```bash
npm run test
```

## Exemplo de Request/Response

## Request

`POST /v1/orders/`

```json
{
    "items": [
        { "productId": "ele-001", "quantity": 10 },
        { "productId": "acc-001", "quantity": 10 },
        { "productId": "acc-002", "quantity": 50 }
    ]
}
```

## Response (200 OK)

```json
{
    "currency": "BRL",
    "subtotal": 2193,
    "items": [
        {
            "productId": "ele-001",
            "unitPrice": 79.9,
            "category": "eletronicos",
            "quantity": 10,
            "subtotal": 799,
            "appliedDiscounts": [],
            "total": 799
        },
        {
            "productId": "acc-001",
            "unitPrice": 39.9,
            "category": "acessorios",
            "quantity": 10,
            "subtotal": 399,
            "appliedDiscounts": [
                {
                    "code": "CAT_ACC_5PCT",
                    "name": "Desconto de 5% na categoria 'acessorios'",
                    "amount": 19.95,
                    "basis": 399
                }
            ],
            "total": 379.05
        },
        {
            "productId": "acc-002",
            "unitPrice": 19.9,
            "category": "acessorios",
            "quantity": 50,
            "subtotal": 995,
            "appliedDiscounts": [
                {
                    "code": "CAT_ACC_5PCT",
                    "name": "Desconto de 5% na categoria 'acessorios'",
                    "amount": 49.75,
                    "basis": 995
                }
            ],
            "total": 945.25
        }
    ],
    "discounts": [
        {
            "code": "QTY_TIER_20PCT",
            "name": "Desconto de 20% por volume",
            "basis": 2123.3,
            "amount": 424.66,
            "metadata": {
                "justification": "Pedido com 70 itens no total se enquadra na faixa de 20% (>= 50 itens)."
            }
        },
        {
            "code": "CART_VALUE_FIXED_150",
            "name": "Desconto de R$ 150.00 por valor do carrinho",
            "basis": 1698.64,
            "amount": 150,
            "metadata": {
                "justification": "Subtotal inicial de R$ 2193.00 se enquadra na faixa de R$ 150.00 de desconto (>= R$ 2000.00)."
            }
        }
    ],
    "total": 1548.64
}
```

## Notas

- Todos os cálculos monetários são realizados em centavos (inteiros) para evitar erros de ponto flutuante.
A conversão para reais com duas casas decimais ocorre apenas na camada de serviço, no momento de montar a resposta final da API.