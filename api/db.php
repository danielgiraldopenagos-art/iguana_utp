<?php

declare(strict_types=1);

function getDB(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $url = getenv('DATABASE_URL');
    if ($url) {
      $parts = parse_url($url);
      $host   = $parts['host'] ?? 'localhost';
      $port   = $parts['port'] ?? 3306;
      $dbname = ltrim($parts['path'] ?? '', '/') ?: 'iguanautp';
      $user   = $parts['user'] ?? 'root';
      $pass   = $parts['pass'] ?? '';
      $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    } else {
      $host   = getenv('DB_HOST') ?: 'localhost';
      $port   = getenv('DB_PORT') ?: '3306';
      $dbname = getenv('DB_NAME') ?: 'iguanautp';
      $user   = getenv('DB_USER') ?: 'root';
      $pass   = getenv('DB_PASS') ?: '';
      $dsn = "mysql:host=$host;port=$port;dbname=$dbname;charset=utf8mb4";
    }

    $opts = [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    if (getenv('DATABASE_URL') || getenv('MYSQL_SSL') === 'true') {
      $opts[PDO::MYSQL_ATTR_SSL_CA] = getenv('MYSQL_SSL_CA') ?: '/etc/ssl/certs/ca-certificates.crt';
    }

    $pdo = new PDO($dsn, $user, $pass, $opts);
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
