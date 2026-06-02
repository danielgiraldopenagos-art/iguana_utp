<?php

declare(strict_types=1);

require_once __DIR__ . '/db.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$db = getDB();

// ── GET: list sightings with stats ──────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  $stmt = $db->query('
    SELECT s.*, st.name AS student_name, st.email
    FROM sightings s
    JOIN students st ON st.id = s.student_id
    ORDER BY s.created_at DESC
    LIMIT 200
  ');
  $list = $stmt->fetchAll();

  $total   = count($list);
  $today   = 0;
  $zones   = [];
  $hours   = [];
  $comps   = [];
  $todayStr = date('Y-m-d');

  foreach ($list as $row) {
    if (substr($row['created_at'], 0, 10) === $todayStr) $today++;
    $zones[$row['zone']] = ($zones[$row['zone']] ?? 0) + 1;
    $hours[$row['hora']] = ($hours[$row['hora']] ?? 0) + 1;
    if ($row['comportamiento']) {
      $comps[$row['comportamiento']] = ($comps[$row['comportamiento']] ?? 0) + 1;
    }
  }

  jsonResponse([
    'sightings' => $list,
    'stats' => [
      'total'   => $total,
      'today'   => $today,
      'zones'   => count($zones),
      'zoneDetail' => $zones,
      'hourDetail' => $hours,
      'compDetail' => $comps,
    ]
  ]);
}

// ── POST: create sighting ────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  jsonError('Método no permitido', 405);
}

$data = getJsonInput();

$studentId = (int)($data['student_id'] ?? 0);
$zone      = trim($data['zone'] ?? '');
$hora      = trim($data['hora'] ?? '');
$cantidad  = trim($data['cantidad'] ?? '');
$tamano    = trim($data['tamano'] ?? '');
$comp      = trim($data['comportamiento'] ?? '');
$obs       = trim($data['observaciones'] ?? '');

if ($studentId <= 0 || $zone === '' || $hora === '' || $cantidad === '') {
  jsonError('Faltan campos obligatorios (student_id, zone, hora, cantidad)');
}

// Verify student exists
$check = $db->prepare('SELECT id FROM students WHERE id = ?');
$check->execute([$studentId]);
if (!$check->fetch()) {
  jsonError('Estudiante no encontrado. Registra tu nombre y correo primero.', 404);
}

$stmt = $db->prepare('
  INSERT INTO sightings (student_id, zone, hora, cantidad, tamano, comportamiento, observaciones)
  VALUES (?, ?, ?, ?, ?, ?, ?)
');
$stmt->execute([$studentId, $zone, $hora, $cantidad, $tamano, $comp, $obs]);
$id = (int)$db->lastInsertId();

jsonResponse([
  'id' => $id,
  'message' => 'Avistamiento registrado correctamente'
], 201);
