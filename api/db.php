<?php

declare(strict_types=1);

function resolveHostIPv4(string $host): ?string {
  if (filter_var($host, FILTER_VALIDATE_IP)) {
    return $host;
  }
  $ip = gethostbyname($host);
  return $ip !== $host ? $ip : null;
}

function getDB(): PDO {
  static $pdo = null;
  if ($pdo === null) {
    $url = getenv('DATABASE_URL');
    if ($url) {
      $parts = parse_url($url);
      $host   = $parts['host'] ?? 'localhost';
      $port   = $parts['port'] ?? 5432;
      $dbname = ltrim($parts['path'] ?? '', '/') ?: 'iguanautp';
      $user   = $parts['user'] ?? 'postgres';
      $pass   = $parts['pass'] ?? '';
      $hostaddr = resolveHostIPv4($host);
      $connHost = $hostaddr !== null ? "hostaddr=$hostaddr" : "host=$host";
      $dsn = "pgsql:$connHost;port=$port;dbname=$dbname;sslmode=require";
    } else {
      $host   = getenv('DB_HOST') ?: 'localhost';
      $port   = getenv('DB_PORT') ?: '5432';
      $dbname = getenv('DB_NAME') ?: 'iguanautp';
      $user   = getenv('DB_USER') ?: 'postgres';
      $pass   = getenv('DB_PASS') ?: '';
      $sslmode = getenv('DB_SSLMODE') ?: 'prefer';
      $hostaddr = resolveHostIPv4($host);
      $connHost = $hostaddr !== null ? "hostaddr=$hostaddr" : "host=$host";
      $dsn = "pgsql:$connHost;port=$port;dbname=$dbname;sslmode=$sslmode";
    }

    $pdo = new PDO($dsn, $user, $pass, [
      PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
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
