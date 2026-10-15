-- Kyde Food - cardápio inicial
-- Rode no phpMyAdmin, com o banco `alimentacao` selecionado (aba SQL).
SET NAMES utf8mb4;

INSERT INTO `produto` (`nome_produto`, `descricao_produto`, `preco_produto`) VALUES
('X-Burger',          'Pão, hambúrguer bovino, queijo e molho especial', 18.90),
('X-Bacon',           'Pão, hambúrguer bovino, queijo, bacon crocante e molho', 22.90),
('X-Salada',          'Pão, hambúrguer bovino, queijo, alface, tomate e maionese', 19.90),
('Duplo Cheese',      'Pão, dois hambúrgueres bovinos e dobro de queijo cheddar', 26.90),
('Hot Dog Completo',  'Pão, salsicha, purê, milho, batata palha e molhos', 14.90),
('Batata Frita',      'Porção média de batata frita crocante', 12.90),
('Nuggets (10 un.)',  'Dez nuggets de frango empanados com molho barbecue', 16.90),
('Refrigerante Lata', 'Lata 350 ml (Cola, Guaraná ou Laranja)', 6.50),
('Suco Natural',      'Copo 400 ml de laranja ou limão', 9.90),
('Milk Shake',        'Copo 400 ml de chocolate, morango ou baunilha', 15.90);

-- (Opcional) a tabela item_pedido só tem índice em ID_pedido, sem chave estrangeira.
-- Se quiser ligar ao pedido, descomente:
-- ALTER TABLE `item_pedido`
--   ADD CONSTRAINT `fk_item_pedido_pedido` FOREIGN KEY (`ID_pedido`) REFERENCES `pedido` (`ID_pedido`);
