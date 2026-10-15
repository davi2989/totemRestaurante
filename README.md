# 🍔 Kyde Food

Totem de **autoatendimento para restaurante**, inspirado nos totens de redes de fast food. O cliente se cadastra, escolhe os lanches no cardápio, monta o carrinho, informa o documento, paga e recebe o número do pedido.

Projeto desenvolvido para fins acadêmicos. O front-end é feito em **HTML, CSS e JavaScript puro**, e a comunicação com o banco **MySQL** é feita por arquivos **PHP** rodando no **XAMPP**.

---

## 📑 Sumário

- [Funcionalidades](#-funcionalidades)
- [Fluxo do totem](#-fluxo-do-totem)
- [Tecnologias](#-tecnologias)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Banco de dados](#-banco-de-dados)
- [Como executar](#-como-executar)
- [API](#-api)
- [Regras de negócio](#-regras-de-negócio)
- [Segurança](#-segurança)
- [Melhorias futuras](#-melhorias-futuras)
- [Autor](#-autor)

---

## ✅ Funcionalidades

- Tela inicial com botão **Iniciar pedido**
- **Cadastro** do cliente pelo nome
- **Cardápio** carregado diretamente do banco de dados, com ícone automático para cada tipo de produto
- **Carrinho** com aumento e diminuição de quantidade, remoção de itens e total em tempo real
- Botão do carrinho no cardápio mostrando a quantidade de itens e o valor atual
- Identificação por **CPF ou CNPJ**, com máscara automática e **validação dos dígitos verificadores**
- Formas de pagamento: **PIX, Cartão de Crédito, Cartão de Débito e Dinheiro**
- Tipo de retirada: **Comer aqui** ou **Para levar**
- **Confirmação** com o número do pedido e resumo da compra
- Retorno automático à tela inicial após 30 segundos
- Layout responsivo, com animações leves

---

## 🔄 Fluxo do totem

```
1. Início
      ↓
2. Cadastro (nome)
      ↓
3. Cardápio  ◄─────────┐
      ↓                │
4. Carrinho ───────────┘  (volta para adicionar mais itens)
      ↓
5. Pagamento (CPF/CNPJ, forma de pagamento, retirada)
      ↓
6. Confirmação (número do pedido) ──► volta ao início em 30s
```

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 | Estrutura das telas |
| CSS3 | Estilo, layout responsivo e animações |
| JavaScript (puro) | Lógica do totem, carrinho e validações |
| PHP | API que conecta o front-end ao banco |
| MySQL | Banco de dados |
| XAMPP | Servidor local (Apache + MySQL + phpMyAdmin) |
| Visual Studio Code | Editor de código |
| Git / GitHub | Controle de versão |

---

---

## 🚀 Como executar

### Pré-requisitos

- [XAMPP](https://www.apachefriends.org/) (Apache + MySQL)
- [Visual Studio Code](https://code.visualstudio.com/)
- Navegador atualizado

### Passo a passo

1. **Clone o repositório** dentro da pasta `htdocs` do XAMPP
   ```bash
   cd C:/xampp/htdocs
   git clone https://github.com/SEU_USUARIO/KydeFood.git
   ```

2. **Inicie o XAMPP**
   - Abra o XAMPP Control Panel e clique em **Start** em *Apache* e em *MySQL*.

3. **Crie o banco de dados**
   - Acesse `http://localhost/phpmyadmin`.
   - Vá na aba **SQL**, cole o conteúdo de `produtos.sql` e execute.

4. **Abra o projeto no VS Code**
   ```bash
   code KydeFood
   ```

5. **Acesse o totem no navegador**
   ```
   http://localhost/KydeFood/
   ```

> ⚠️ O projeto precisa ser aberto por `http://localhost/...`. Extensões como o *Live Server* do VS Code **não executam PHP**, e o cardápio não carregará. Se abrir o `index.html` direto do disco (`file://`), as chamadas à API também falham.

### Conexão com o banco

Se o seu MySQL tiver usuário ou senha diferentes do padrão do XAMPP (`root` sem senha), ajuste os dados de conexão nos arquivos da pasta `api/`.

---

## 🔌 API

O front-end conversa com o servidor por duas rotas:

### `GET api/produtos.php`

Retorna a lista de produtos cadastrados.

```json
[
  { "id": 1, "nome": "Big Burger", "descricao": "Hambúrguer com queijo", "preco": 24.9 }
]
```

### `POST api/pedido.php`

Registra o pedido. Exemplo de corpo da requisição:

```json
{
  "nome": "Maria",
  "tipoDocumento": "cpf",
  "documento": "12345678909",
  "forma": "PIX",
  "retirada": "Comer aqui",
  "itens": [
    { "id": 1, "quantidade": 2 },
    { "id": 3, "quantidade": 1 }
  ]
}
```

Resposta em caso de sucesso:

```json
{ "ok": true, "id": 25, "total": 57.8, "dataHora": "15/10/2026 16:55" }
```

Em caso de erro, a resposta traz o campo `erro` com a mensagem exibida ao cliente.

---

## 📏 Regras de negócio

- O nome do cliente precisa ter no mínimo **2 caracteres**
- O subtotal de cada item é `preço × quantidade`
- O total do pedido é a soma dos subtotais
- Não é possível ir ao pagamento com o **carrinho vazio**
- A quantidade de um item não pode ficar abaixo de 1 (para tirar, usa-se **Remover**)
- O **CPF** (11 dígitos) ou **CNPJ** (14 dígitos) é validado pelos dígitos verificadores, e sequências repetidas como `111.111.111-11` são rejeitadas
- O pedido só é registrado após a confirmação do pagamento

---

## 🔒 Segurança

- O front-end envia ao servidor **apenas o ID e a quantidade** de cada produto. Os **preços são buscados no banco**, o que impede que alguém altere o valor pelo navegador.
- Os textos exibidos na tela usam `textContent`, o que evita a injeção de HTML.

---

## 👤 Autores

Davi Kleemann
Kauã Sander
Yasmin Vargas
Eduardo Modzeieski
---

## 📄 Licença

Projeto desenvolvido para fins educacionais.
