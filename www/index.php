<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IguanaUTP — Monitoreo de la iguana verde</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>

<div class="app">
  <h2 class="sr-only" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);">IguanaUTP — Monitoreo de Iguana iguana en el campus de la Universidad Tecnológica de Pereira</h2>

  <div class="brand-header">
    <div class="brand-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f6e56" stroke-width="2"><path d="M17 13a4 4 0 0 1-8 0c0-2 2-7 4-9 2 2 4 7 4 9z"/><path d="M9 13a4 4 0 0 0 6 0"/><path d="M12 5v.01"/></svg>
    </div>
    <div>
      <div class="brand-title">IguanaUTP 🦎</div>
      <div class="brand-subtitle">Monitoreo de la iguana verde en el campus UTP</div>
    </div>
  </div>

  <div class="tabs">
    <button class="tab active" onclick="switchTab('mapa',this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><path d="M3 7v11l7 3 4-2 7 3V11l-7-3-4 2-7-3z"/><path d="M10 5v13"/><path d="M14 7v13"/></svg>
      Mapa
    </button>
    <button class="tab" onclick="switchTab('edu',this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
      Aprende
    </button>
    <button class="tab" onclick="switchTab('quiz',this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
      Prueba
    </button>
    <button class="tab" onclick="switchTab('reporte',this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
      Reportes
    </button>
    <button class="tab" onclick="switchTab('historial',this)">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Historial
    </button>
  </div>

  <!-- MAPA -->
  <div id="panel-mapa" class="panel active">
    <div class="counter-row">
      <div class="ccard">
        <div class="cnum" id="cnt-total">0</div>
        <div class="clabel">avistamientos</div>
      </div>
      <div class="ccard">
        <div class="cnum" id="cnt-hoy">0</div>
        <div class="clabel">hoy</div>
      </div>
      <div class="ccard">
        <div class="cnum" id="cnt-zones">0</div>
        <div class="clabel">zonas activas</div>
      </div>
    </div>
    <p class="map-hint">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;"><path d="M18 8a6 6 0 0 1-6 6"/><path d="M6 8a6 6 0 0 0 6 6"/><circle cx="12" cy="8" r="6"/><path d="M8 21s4-2 4-4"/><path d="M16 21s-4-2-4-4"/></svg>
      Toca un punto rojo para registrar avistamientos · Rueda del ratón para acercar · Arrastra para mover el mapa.
    </p>

    <div class="map-grid">
      <div class="map-grid-left">
        <div class="map-toolbar">
          <div class="zoom-group">
            <button class="btc zoom-btn" onclick="zoomMap(0.65)" title="Acercar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="btc zoom-btn" onclick="zoomMap(1.4)" title="Alejar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </button>
            <button class="btc zoom-btn" onclick="resetZoom()" title="Restablecer vista">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            </button>
          </div>
          <button class="btc map-toggle-btn" onclick="toggleSidebar()" title="Ocultar panel lateral">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        </div>
        <div class="map-wrap">
          <svg id="campus-map" viewBox="0 0 2835 1949" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="2" dy="2" stdDeviation="1" flood-color="#000" flood-opacity="0.3"/>
              </filter>
            </defs>
            <image href="assets/mapa-utp.jpg" width="2835" height="1949" preserveAspectRatio="xMidYMid meet"/>
            <g id="pins-layer"></g>
          </svg>
        </div>
      </div>
      <div class="map-grid-right" id="sidebar-panel">
        <div class="zone-sel-info" id="zone-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><path d="M17 13a4 4 0 0 1-8 0c0-2 2-7 4-9 2 2 4 7 4 9z"/><path d="M9 13a4 4 0 0 0 6 0"/></svg>
          <strong id="zone-name-display"></strong>
        </div>
        <div class="sf">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            Registrar avistamiento
          </h3>
          <div class="fr">
            <select id="sel-hora">
              <option value="">-- Hora --</option>
              <option>Mañana (6-10 a.m.)</option>
              <option>Media mañana (10 a.m.-12 p.m.)</option>
              <option>Mediodía (12-2 p.m.)</option>
              <option>Tarde (2-5 p.m.)</option>
              <option>Atardecer (5-7 p.m.)</option>
            </select>
            <select id="sel-num">
              <option value="">-- Cantidad --</option>
              <option>1 iguana</option>
              <option>2-3 iguanas</option>
              <option>4-6 iguanas</option>
              <option>Más de 6</option>
            </select>
          </div>
          <div class="fr">
            <select id="sel-tamano">
              <option value="">-- Tamaño --</option>
              <option>Cría (menos de 30 cm)</option>
              <option>Juvenil (30-80 cm)</option>
              <option>Adulta (más de 80 cm)</option>
              <option>Varios tamaños</option>
            </select>
            <select id="sel-comp">
              <option value="">-- Comportamiento --</option>
              <option>Tomando el sol</option>
              <option>Alimentándose</option>
              <option>Trepando árbol</option>
              <option>En movimiento</option>
              <option>En reposo</option>
              <option>Actitud defensiva</option>
            </select>
          </div>
          <div class="fr"><textarea id="txt-obs" placeholder="Observaciones adicionales..."></textarea></div>
          <button class="bts" onclick="addSighting()">Registrar avistamiento</button>
          <button class="btc" onclick="clearForm()">Limpiar</button>
        </div>
        <div id="sightings-list" style="display:none;margin-top:12px;">
          <div style="font-size:13px;font-weight:500;margin-bottom:7px;color:var(--text-primary);">Últimos avistamientos</div>
          <div id="sightings-items"></div>
          <button class="btc" onclick="switchTab('historial',document.querySelectorAll('.tab')[4])" style="margin-top:6px;width:100%;font-size:13px;padding:8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            Ver historial completo
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- EDU -->
  <div id="panel-edu" class="panel">
    <div class="tipbox" style="margin-bottom:10px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      Selecciona un tema para aprender sobre la iguana verde y cómo convivir con ella en el campus.
    </div>
    <div class="egrid">
      <div class="ecard sel" onclick="showEdu(0,this)">
        <div class="eicon">🦎</div>
        <div class="etitle">¿Quién es la iguana verde?</div>
        <div class="edesc">Biología y características</div>
      </div>
      <div class="ecard" onclick="showEdu(1,this)">
        <div class="eicon">🌿</div>
        <div class="etitle">Hábitat y dieta en el campus</div>
        <div class="edesc">Dónde vive y qué come</div>
      </div>
      <div class="ecard" onclick="showEdu(2,this)">
        <div class="eicon">📌</div>
        <div class="etitle">Estado de conservación</div>
        <div class="edesc">Amenazas y protección</div>
      </div>
      <div class="ecard" onclick="showEdu(3,this)">
        <div class="eicon">🤝</div>
        <div class="etitle">Convivencia responsable</div>
        <div class="edesc">Cómo actuar al verla</div>
      </div>
    </div>
    <div class="econtent" id="edu-content"></div>
  </div>

  <!-- QUIZ -->
  <div id="panel-quiz" class="panel">
    <div class="tipbox" style="margin-bottom:10px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      Responde cada pregunta para comprobar lo que sabes sobre la iguana verde.
    </div>
    <div id="quiz-area"></div>
  </div>

  <!-- REPORTE -->
  <div id="panel-reporte" class="panel">
    <div class="section-heading">Resumen</div>
    <div class="rgrid">
      <div class="rstat">
        <div class="rnum" id="r-total">0</div>
        <div class="rlabel">Registros totales</div>
      </div>
      <div class="rstat">
        <div class="rnum" id="r-hoy">0</div>
        <div class="rlabel">Hoy</div>
      </div>
      <div class="rstat">
        <div class="rnum" id="r-zonas">0</div>
        <div class="rlabel">Zonas activas</div>
      </div>
      <div class="rstat">
        <div class="rnum" id="r-hora" style="font-size:12px;margin-top:3px;">·</div>
        <div class="rlabel">Hora pico</div>
      </div>
    </div>
    <div class="section-heading">Zonas con más avistamientos</div>
    <div id="zona-bars">
      <p style="font-size:13px;color:var(--text-secondary);">Registra avistamientos para consultar estas estadísticas.</p>
    </div>
    <div class="section-heading">Comportamientos observados</div>
    <div id="comp-bars">
      <p style="font-size:13px;color:var(--text-secondary);">Aún no hay datos.</p>
    </div>
    <div class="tipbox" style="margin-top:10px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      Estos datos pueden servir para el informe de biodiversidad del campus UTP.
    </div>
  </div>
  <!-- HISTORIAL -->
  <div id="panel-historial" class="panel">
    <div class="section-heading">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px;"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
      Historial de avistamientos
    </div>
    <div class="tipbox" style="margin-bottom:14px;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:4px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      Todas las observaciones registradas por la comunidad del campus.
    </div>
    <div class="hist-controls">
      <input type="text" id="hist-search" placeholder="Buscar por nombre, zona..." oninput="loadHistory()">
      <select id="hist-filter" onchange="loadHistory()">
        <option value="">Todas las zonas</option>
      </select>
    </div>
    <div id="history-table-wrap" style="overflow-x:auto;">
      <table class="hist-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Zona</th>
            <th>Hora</th>
            <th>Cantidad</th>
            <th>Tamano</th>
            <th>Comportamiento</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody id="history-body"></tbody>
      </table>
    </div>
    <div id="history-empty" style="display:none;text-align:center;padding:40px 0;color:var(--text-secondary);font-size:14px;">
      No hay avistamientos registrados. ¡Sé el primero en reportar!
    </div>
  </div>

  <!-- Student badge -->
  <div id="student-badge" class="student-badge" style="display:none;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    <span id="student-name-display"></span>
    <button onclick="showRegisterModal()" class="btc" style="padding:2px 6px;font-size:11px;border-radius:6px;">Cambiar</button>
  </div>
</div>

<!-- Modal -->
<div id="register-modal" class="modal-overlay">
  <div class="modal-box">
    <div class="modal-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0f6e56" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </div>
    <h3>Identifícate</h3>
    <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">Ingresa tus datos para registrar avistamientos en el campus.</p>
    <div class="modal-field">
      <label for="reg-name">Nombre completo</label>
      <input type="text" id="reg-name" placeholder="Ej: Juan Pérez" autocomplete="name">
    </div>
    <div class="modal-field">
      <label for="reg-email">Correo institucional</label>
      <input type="email" id="reg-email" placeholder="Ej: juan.perez@utp.edu.co" autocomplete="email">
    </div>
    <div id="modal-error" class="modal-error"></div>
    <button class="bts" id="btn-register" onclick="registerStudent()" style="width:100%;">Comenzar</button>
  </div>
</div>

<script src="js/data.js"></script>
<script src="js/app.js"></script>
</body>
</html>
