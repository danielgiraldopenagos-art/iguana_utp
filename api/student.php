<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  jsonError('Método no permitido', 405);
}

$data = getJsonInput();

$name  = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');

if ($name === '' || $email === '') {
  jsonError('El nombre y el correo son obligatorios');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  jsonError('Correo electrónico no válido');
}

$db = getDB();

// Check if student already exists
$stmt = $db->prepare('SELECT id, name, email FROM students WHERE email = ?');
$stmt->execute([$email]);
$existing = $stmt->fetch();

if ($existing) {
  jsonResponse([
    'student' => $existing,
    'registered' => false,
    'message' => 'Bienvenido de nuevo, ' . $existing['name']
  ]);
}

// Register new student
$stmt = $db->prepare('INSERT INTO students (name, email) VALUES (?, ?)');
$stmt->execute([$name, $email]);
$id = (int)$db->lastInsertId('students_id_seq');

jsonResponse([
  'student' => ['id' => $id, 'name' => $name, 'email' => $email],
  'registered' => true,
  'message' => '¡Registrado correctamente!'
], 201);
