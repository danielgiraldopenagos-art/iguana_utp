<?php

declare(strict_types=1);

function getDB(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $host = getenv('DB_HOST') ?: 'db';
    $db   = getenv('DB_NAME') ?: 'iguanautp';
    $user = getenv('DB_USER') ?: 'iguana';
    $pass = getenv('DB_PASS') ?: 'iguana123';

    $pdo = new PDO(
      "mysql:host=$host;dbname=$db;charset=utf8mb4",
      $user,
      $pass,
      [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
      ]
    );
  }
  return $pdo;
}

function jsonResponse(mixed $data, int $code = 200): void {
  http_response_code($code);
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function jsonError(string $message, int $code = 400): void {
  jsonResponse(['error' => $message], $code);
}

function getJsonInput(): array {
  $raw = file_get_contents('php://input');
  $data = json_decode($raw, true);
  if (!is_array($data)) {
    jsonError('JSON inválido');
  }
  return $data;
}
