<?php
// Conexão com o banco "alimentacao" (XAMPP: usuário root, sem senha).
header('Content-Type: application/json; charset=utf-8');
date_default_timezone_set('America/Sao_Paulo');

function conectar(): PDO {
    return new PDO(
        'mysql:host=localhost;dbname=alimentacao;charset=utf8mb4',
        'root',
        '',
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
}

function responder(array $dados, int $codigo = 200): void {
    http_response_code($codigo);
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}
