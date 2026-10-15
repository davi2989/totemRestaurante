<?php
// Recebe o pedido e grava comanda + pedido + item_pedido + pagamento (numa transação).
require __DIR__ . '/conexao.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(['ok' => false, 'erro' => 'Método não permitido.'], 405);
}

/* ---------- validação de CPF / CNPJ ---------- */
function cpfValido(string $c): bool {
    if (strlen($c) !== 11 || preg_match('/^(\d)\1+$/', $c)) return false;
    for ($t = 9; $t < 11; $t++) {
        $soma = 0;
        for ($i = 0; $i < $t; $i++) $soma += (int) $c[$i] * ($t + 1 - $i);
        if ((int) $c[$t] !== (($soma * 10) % 11) % 10) return false;
    }
    return true;
}

function cnpjValido(string $c): bool {
    if (strlen($c) !== 14 || preg_match('/^(\d)\1+$/', $c)) return false;
    $conjuntos = [
        12 => [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
        13 => [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    ];
    foreach ($conjuntos as $posicao => $pesos) {
        $soma = 0;
        foreach ($pesos as $i => $peso) $soma += (int) $c[$i] * $peso;
        $resto = $soma % 11;
        $digito = $resto < 2 ? 0 : 11 - $resto;
        if ((int) $c[$posicao] !== $digito) return false;
    }
    return true;
}

/* ---------- leitura dos dados ---------- */
$entrada = json_decode(file_get_contents('php://input'), true);
if (!is_array($entrada)) {
    responder(['ok' => false, 'erro' => 'Dados inválidos.'], 400);
}

$nome      = trim((string) ($entrada['nome'] ?? ''));
$tipoDoc   = (string) ($entrada['tipoDocumento'] ?? '');
$documento = preg_replace('/\D/', '', (string) ($entrada['documento'] ?? ''));
$forma     = (string) ($entrada['forma'] ?? '');
$retirada  = (string) ($entrada['retirada'] ?? '');
$itens     = $entrada['itens'] ?? [];

if (mb_strlen($nome) < 2) responder(['ok' => false, 'erro' => 'Nome inválido.'], 400);
$nome = mb_substr($nome, 0, 45);                       // varchar(45)

$documentoOk = $tipoDoc === 'cpf' ? cpfValido($documento)
             : ($tipoDoc === 'cnpj' ? cnpjValido($documento) : false);
if (!$documentoOk) responder(['ok' => false, 'erro' => 'CPF/CNPJ inválido.'], 400);

if (!in_array($forma, ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'], true)) {
    responder(['ok' => false, 'erro' => 'Forma de pagamento inválida.'], 400);
}
if (!in_array($retirada, ['Comer aqui', 'Para levar'], true)) {
    responder(['ok' => false, 'erro' => 'Forma de retirada inválida.'], 400);
}
if (!is_array($itens) || count($itens) === 0) {
    responder(['ok' => false, 'erro' => 'O carrinho está vazio.'], 400);
}

// junta quantidades por produto e valida
$quantidades = [];
foreach ($itens as $it) {
    $id  = (int) ($it['id'] ?? 0);
    $qtd = (int) ($it['quantidade'] ?? 0);
    if ($id <= 0 || $qtd < 1 || $qtd > 99) {
        responder(['ok' => false, 'erro' => 'Item inválido no carrinho.'], 400);
    }
    $quantidades[$id] = ($quantidades[$id] ?? 0) + $qtd;
}

try {
    $pdo = conectar();

    // preços vêm do BANCO (nunca confiamos no valor enviado pelo navegador)
    $marcadores = implode(',', array_fill(0, count($quantidades), '?'));
    $stmt = $pdo->prepare("SELECT ID_produto, preco_produto FROM produto WHERE ID_produto IN ($marcadores)");
    $stmt->execute(array_keys($quantidades));
    $precos = [];
    foreach ($stmt->fetchAll() as $l) {
        $precos[(int) $l['ID_produto']] = (int) round(((float) $l['preco_produto']) * 100); // centavos
    }
    if (count($precos) !== count($quantidades)) {
        responder(['ok' => false, 'erro' => 'Algum produto do carrinho não existe mais.'], 400);
    }

    $totalCentavos = 0;
    foreach ($quantidades as $id => $qtd) $totalCentavos += $precos[$id] * $qtd;
    $total = number_format($totalCentavos / 100, 2, '.', '');

    $agora = new DateTime();
    $dataBanco = $agora->format('YmdHis');             // 14 caracteres = varchar(14)

    $pdo->beginTransaction();

    $pdo->prepare('INSERT INTO comanda (nome_comanda, CPF_comanda) VALUES (?, ?)')
        ->execute([$nome, $documento]);
    $idComanda = (int) $pdo->lastInsertId();

    $pdo->prepare('INSERT INTO pedido (ID_comanda, data_pedido, status_pedido, valorTotal_pedido) VALUES (?, ?, ?, ?)')
        ->execute([$idComanda, $dataBanco, 'Em preparo', $total]);
    $idPedido = (int) $pdo->lastInsertId();

    $insItem = $pdo->prepare(
        'INSERT INTO item_pedido (ID_pedido, ID_produto, quantidade_item_pedido, valor_item_pedido) VALUES (?, ?, ?, ?)'
    );
    foreach ($quantidades as $id => $qtd) {
        $insItem->execute([$idPedido, $id, $qtd, number_format($precos[$id] * $qtd / 100, 2, '.', '')]);
    }

    $pdo->prepare('INSERT INTO pagamento (ID_pedido, valorTotal_pagamento, formaPagamento, retiradaAlimento) VALUES (?, ?, ?, ?)')
        ->execute([$idPedido, $total, $forma, $retirada]);

    $pdo->commit();

    responder([
        'ok'       => true,
        'id'       => $idPedido,
        'total'    => (float) $total,
        'dataHora' => $agora->format('d/m/Y H:i'),
    ]);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    error_log('[KydeFood] ' . $e->getMessage());
    responder(['ok' => false, 'erro' => 'Erro ao salvar o pedido no banco.'], 500);
}
