<?php
// Lista o cardápio (tabela produto).
require __DIR__ . '/conexao.php';

try {
    $pdo = conectar();
    $linhas = $pdo->query(
        'SELECT ID_produto, nome_produto, descricao_produto, preco_produto
           FROM produto ORDER BY ID_produto'
    )->fetchAll();

    $produtos = array_map(function ($l) {
        return [
            'id'        => (int) $l['ID_produto'],
            'nome'      => $l['nome_produto'],
            'descricao' => $l['descricao_produto'],
            'preco'     => (float) $l['preco_produto'],
        ];
    }, $linhas);

    responder($produtos);
} catch (PDOException $e) {
    error_log('[KydeFood] ' . $e->getMessage());
    responder(['erro' => 'Não foi possível conectar ao banco. O MySQL do XAMPP está ligado?'], 500);
}
