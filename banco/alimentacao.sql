-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/10/2026 às 21:33
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `alimentacao`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `cadastro`
--

CREATE TABLE `cadastro` (
  `num_comanda` int(11) NOT NULL,
  `nome_de_cadastro` varchar(45) NOT NULL,
  `CPF_de_cadastro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `comanda`
--

CREATE TABLE `comanda` (
  `ID_comanda` int(11) NOT NULL,
  `nome_comanda` varchar(45) NOT NULL,
  `CPF_comanda` varchar(14) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `comanda`
--

INSERT INTO `comanda` (`ID_comanda`, `nome_comanda`, `CPF_comanda`) VALUES
(1, 'kauã', '00103373004'),
(2, 'Davi', '00103373004'),
(3, 'flavinho', '00716553015');

-- --------------------------------------------------------

--
-- Estrutura para tabela `item_pedido`
--

CREATE TABLE `item_pedido` (
  `ID_item_pedido` int(11) NOT NULL,
  `ID_pedido` int(11) NOT NULL,
  `ID_produto` int(11) NOT NULL,
  `quantidade_item_pedido` int(11) NOT NULL,
  `valor_item_pedido` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `item_pedido`
--

INSERT INTO `item_pedido` (`ID_item_pedido`, `ID_pedido`, `ID_produto`, `quantidade_item_pedido`, `valor_item_pedido`) VALUES
(1, 1, 3, 1, 19.90),
(2, 1, 6, 1, 12.90),
(3, 1, 10, 1, 15.90),
(4, 1, 9, 1, 9.90),
(5, 2, 2, 1, 22.90),
(6, 2, 8, 1, 6.50),
(7, 2, 10, 1, 15.90),
(8, 3, 7, 1, 16.90),
(9, 3, 1, 1, 18.90),
(10, 3, 8, 1, 6.50),
(11, 3, 3, 2, 39.80);

-- --------------------------------------------------------

--
-- Estrutura para tabela `pagamento`
--

CREATE TABLE `pagamento` (
  `ID_pagamento` int(11) NOT NULL,
  `ID_pedido` int(11) NOT NULL,
  `valorTotal_pagamento` decimal(10,2) NOT NULL,
  `formaPagamento` varchar(20) NOT NULL,
  `retiradaAlimento` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pagamento`
--

INSERT INTO `pagamento` (`ID_pagamento`, `ID_pedido`, `valorTotal_pagamento`, `formaPagamento`, `retiradaAlimento`) VALUES
(1, 1, 58.60, 'PIX', 'Comer aqui'),
(2, 2, 45.30, 'Cartão de Débito', 'Para levar'),
(3, 3, 82.10, 'Cartão de Crédito', 'Para levar');

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedido`
--

CREATE TABLE `pedido` (
  `ID_pedido` int(11) NOT NULL,
  `ID_comanda` int(11) NOT NULL,
  `data_pedido` varchar(14) NOT NULL,
  `status_pedido` varchar(20) NOT NULL,
  `valorTotal_pedido` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedido`
--

INSERT INTO `pedido` (`ID_pedido`, `ID_comanda`, `data_pedido`, `status_pedido`, `valorTotal_pedido`) VALUES
(1, 1, '20261015153613', 'Em preparo', 58.60),
(2, 2, '20261015160510', 'Em preparo', 45.30),
(3, 3, '20261015161350', 'Em preparo', 82.10);

-- --------------------------------------------------------

--
-- Estrutura para tabela `produto`
--

CREATE TABLE `produto` (
  `ID_produto` int(11) NOT NULL,
  `nome_produto` varchar(45) NOT NULL,
  `descricao_produto` varchar(150) NOT NULL,
  `preco_produto` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `produto`
--

INSERT INTO `produto` (`ID_produto`, `nome_produto`, `descricao_produto`, `preco_produto`) VALUES
(1, 'X-Burger', 'Pão, hambúrguer bovino, queijo e molho especial', 18.90),
(2, 'X-Bacon', 'Pão, hambúrguer bovino, queijo, bacon crocante e molho', 22.90),
(3, 'X-Salada', 'Pão, hambúrguer bovino, queijo, alface, tomate e maionese', 19.90),
(4, 'Duplo Cheese', 'Pão, dois hambúrgueres bovinos e dobro de queijo cheddar', 26.90),
(5, 'Hot Dog Completo', 'Pão, salsicha, purê, milho, batata palha e molhos', 14.90),
(6, 'Batata Frita', 'Porção média de batata frita crocante', 12.90),
(7, 'Nuggets (10 un.)', 'Dez nuggets de frango empanados com molho barbecue', 16.90),
(8, 'Refrigerante Lata', 'Lata 350 ml (Cola, Guaraná ou Laranja)', 6.50),
(9, 'Suco Natural', 'Copo 400 ml de laranja ou limão', 9.90),
(10, 'Milk Shake', 'Copo 400 ml de chocolate, morango ou baunilha', 15.90);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `cadastro`
--
ALTER TABLE `cadastro`
  ADD PRIMARY KEY (`num_comanda`);

--
-- Índices de tabela `comanda`
--
ALTER TABLE `comanda`
  ADD PRIMARY KEY (`ID_comanda`);

--
-- Índices de tabela `item_pedido`
--
ALTER TABLE `item_pedido`
  ADD PRIMARY KEY (`ID_item_pedido`),
  ADD KEY `fk_pedido` (`ID_pedido`),
  ADD KEY `fk_produto` (`ID_produto`);

--
-- Índices de tabela `pagamento`
--
ALTER TABLE `pagamento`
  ADD PRIMARY KEY (`ID_pagamento`),
  ADD KEY `fk_pagamento_pedido` (`ID_pedido`);

--
-- Índices de tabela `pedido`
--
ALTER TABLE `pedido`
  ADD PRIMARY KEY (`ID_pedido`),
  ADD KEY `fk_pedido_comanda` (`ID_comanda`);

--
-- Índices de tabela `produto`
--
ALTER TABLE `produto`
  ADD PRIMARY KEY (`ID_produto`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cadastro`
--
ALTER TABLE `cadastro`
  MODIFY `num_comanda` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `comanda`
--
ALTER TABLE `comanda`
  MODIFY `ID_comanda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `item_pedido`
--
ALTER TABLE `item_pedido`
  MODIFY `ID_item_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `pagamento`
--
ALTER TABLE `pagamento`
  MODIFY `ID_pagamento` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `pedido`
--
ALTER TABLE `pedido`
  MODIFY `ID_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `produto`
--
ALTER TABLE `produto`
  MODIFY `ID_produto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `item_pedido`
--
ALTER TABLE `item_pedido`
  ADD CONSTRAINT `fk_produto` FOREIGN KEY (`ID_produto`) REFERENCES `produto` (`ID_produto`);

--
-- Restrições para tabelas `pagamento`
--
ALTER TABLE `pagamento`
  ADD CONSTRAINT `fk_pagamento_pedido` FOREIGN KEY (`ID_pedido`) REFERENCES `pedido` (`ID_pedido`);

--
-- Restrições para tabelas `pedido`
--
ALTER TABLE `pedido`
  ADD CONSTRAINT `fk_pedido_comanda` FOREIGN KEY (`ID_comanda`) REFERENCES `comanda` (`ID_comanda`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
