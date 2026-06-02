let selectedPoint = null;
let quizState = { current: 0, score: 0, answered: false };

const API = '/api';

// Zoom / pan state
const MAP_W = 2835, MAP_H = 1949;
let viewBox = { x: 0, y: 0, w: MAP_W, h: MAP_H };
let isPanning = false, panStart = null, vbStart = null;
let dragged = false;

function applyViewBox() {
  document.getElementById('campus-map').setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`);
}

function toSvgCoord(e) {
  const svg = document.getElementById('campus-map');
  const r = svg.getBoundingClientRect();
  return {
    x: (e.clientX - r.left) / r.width * viewBox.w + viewBox.x,
    y: (e.clientY - r.top) / r.height * viewBox.h + viewBox.y
  };
}

function zoomMap(factor, cx, cy) {
  const newW = viewBox.w * factor;
  if (newW < 200 || newW > MAP_W * 1.2) return;
  if (cx === undefined) { cx = viewBox.x + viewBox.w / 2; cy = viewBox.y + viewBox.h / 2; }
  viewBox.x = cx - (cx - viewBox.x) * factor;
  viewBox.y = cy - (cy - viewBox.y) * factor;
  viewBox.w = newW;
  viewBox.h = viewBox.h * factor;
  applyViewBox();
}

function resetZoom() {
  viewBox = { x: 0, y: 0, w: MAP_W, h: MAP_H };
  applyViewBox();
}

function initZoom() {
  const wrap = document.querySelector('.map-wrap');
  const svg = document.getElementById('campus-map');

  wrap.addEventListener('wheel', e => {
    e.preventDefault();
    const c = toSvgCoord(e);
    const dir = Math.sign(e.deltaY);
    zoomMap(dir > 0 ? 1.1 : 0.9, c.x, c.y);
  }, { passive: false });

  svg.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    isPanning = true; dragged = false;
    panStart = { x: e.clientX, y: e.clientY };
    vbStart = { ...viewBox };
    svg.style.cursor = 'grabbing';
  });

  window.addEventListener('mousemove', e => {
    if (!isPanning) return;
    const dx = e.clientX - panStart.x;
    const dy = e.clientY - panStart.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged = true;
    const r = svg.getBoundingClientRect();
    viewBox.x = vbStart.x - dx / r.width * viewBox.w;
    viewBox.y = vbStart.y - dy / r.height * viewBox.h;
    applyViewBox();
  });

  window.addEventListener('mouseup', () => {
    if (isPanning) { isPanning = false; svg.style.cursor = ''; }
  });
}

// ── Student ──────────────────────────────────────────────────────────
function getStudent() {
  const raw = localStorage.getItem('iguana_student');
  return raw ? JSON.parse(raw) : null;
}

function saveStudent(data) {
  localStorage.setItem('iguana_student', JSON.stringify(data));
}

function showRegisterModal() {
  document.getElementById('register-modal').classList.add('show');
}

function hideRegisterModal() {
  document.getElementById('register-modal').classList.remove('show');
}

function updateStudentBadge(student) {
  const badge = document.getElementById('student-badge');
  if (student) {
    document.getElementById('student-name-display').textContent = student.name + ' (' + student.email + ')';
    badge.style.display = 'inline-flex';
  } else {
    badge.style.display = 'none';
  }
}

async function registerStudent() {
  const name = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const err = document.getElementById('modal-error');

  if (!name || !email) {
    err.textContent = 'Completa todos los campos.';
    err.classList.add('show');
    return;
  }
  if (!email.includes('@')) {
    err.textContent = 'Ingresa un correo válido.';
    err.classList.add('show');
    return;
  }

  err.classList.remove('show');
  document.getElementById('btn-register').disabled = true;
  document.getElementById('btn-register').textContent = 'Registrando…';

  try {
    const res = await fetch(API + '/student.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al registrar');
    saveStudent(data.student);
    updateStudentBadge(data.student);
    hideRegisterModal();
  } catch (e) {
    err.textContent = e.message;
    err.classList.add('show');
  } finally {
    document.getElementById('btn-register').disabled = false;
    document.getElementById('btn-register').textContent = 'Comenzar';
  }
}

// Close modal on Enter
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reg-email').addEventListener('keydown', e => {
    if (e.key === 'Enter') registerStudent();
  });
});

// ── Sightings API ────────────────────────────────────────────────────
async function loadSightings() {
  try {
    const res = await fetch(API + '/sighting.php');
    const data = await res.json();
    if (res.ok) {
      renderAllSightings(data.sightings, data.stats);
    }
  } catch (_) {}
}

async function addSighting() {
  const student = getStudent();
  if (!student) { showRegisterModal(); return; }

  if (!selectedPoint) { alert('Selecciona un punto rojo del mapa.'); return; }

  const fecha = document.getElementById("sel-fecha").value;
  const hora = document.getElementById("sel-hora").value;
  const num = document.getElementById('sel-num').value;
  const tamano = document.getElementById('sel-tamano').value;
  const comp = document.getElementById('sel-comp').value;
  const obs = document.getElementById('txt-obs').value.trim();
  if (!hora || !num) { alert('Indica la hora y la cantidad del avistamiento.'); return; }

  try {
    const res = await fetch(API + '/sighting.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_id: student.id,
        zone: selectedPoint,
        hora,
        cantidad: num,
        tamano,
        comportamiento: comp,
        observaciones: obs,
        fecha: fecha || null
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al guardar');
    clearForm();
    await loadSightings();
    const pt = referencePoints.find(p => p.name === selectedPoint);
    if (pt) addPin(pt.x, pt.y);
  } catch (e) {
    alert(e.message);
  }
}

function addPin(cx, cy) {
  const layer = document.getElementById('pins-layer');
  const jx = (Math.random() - 0.5) * 30;
  const jy = (Math.random() - 0.5) * 20;
  const px = cx + jx, py = cy + jy;

  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M${px},${py - 18} a8,8 0 1,1 0.01,0 Z`);
  path.setAttribute('fill', '#e53935');
  path.setAttribute('stroke', 'white');
  path.setAttribute('stroke-width', '1.5');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', px);
  circle.setAttribute('cy', py - 14);
  circle.setAttribute('r', '3');
  circle.setAttribute('fill', 'white');
  circle.setAttribute('opacity', '0.8');

  const tri = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  tri.setAttribute('points', `${px - 5},${py - 10} ${px + 5},${py - 10} ${px},${py}`);
  tri.setAttribute('fill', '#e53935');

  g.appendChild(tri);
  g.appendChild(path);
  g.appendChild(circle);
  layer.appendChild(g);
  setTimeout(() => { path.setAttribute('fill', '#f9a825'); tri.setAttribute('fill', '#f9a825'); }, 6000);
}

function clearForm() {
  ['sel-hora', 'sel-num', 'sel-tamano', 'sel-comp'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('sel-fecha').value = '';
  document.getElementById('txt-obs').value = '';
}

function renderAllSightings(sightings, stats) {
  // Counters
  document.getElementById('cnt-total').textContent = stats.total;
  document.getElementById('cnt-hoy').textContent = stats.today;
  document.getElementById('cnt-zones').textContent = stats.zones;

  // Sightings list
  const list = document.getElementById('sightings-list');
  if (sightings.length) {
    list.style.display = 'block';
    document.getElementById('sightings-items').innerHTML = sightings.slice(0, 5).map(s => `
      <div class="si-item">
        <span class="si-badge">${escHtml((s.zone || '').slice(0, 16))}</span>
        <div>
          <div class="si-title">${escHtml(s.cantidad)}${s.tamano ? ' · ' + escHtml(s.tamano) : ''}${s.comportamiento ? ' · ' + escHtml(s.comportamiento) : ''}</div>
          <div class="si-meta">${escHtml(s.student_name || 'Anónimo')} · ${s.fecha || (s.created_at || '').slice(0, 10)} · ${escHtml(s.hora)} · ${(s.created_at || '').slice(11, 16)}${s.observaciones ? ' · ' + escHtml(s.observaciones.slice(0, 45)) : ''}</div>
        </div>
      </div>`).join('');
  } else {
    list.style.display = 'none';
  }

  // Report data
  document.getElementById('r-total').textContent = stats.total;
  document.getElementById('r-hoy').textContent = stats.today;
  document.getElementById('r-zonas').textContent = stats.zones;
  const th = Object.entries(stats.hourDetail || {}).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('r-hora').textContent = th ? th[0].split('(')[0].trim() : '-';

  const zd = stats.zoneDetail || {};
  const mz = Math.max(...Object.values(zd), 1);
  document.getElementById('zona-bars').innerHTML = Object.keys(zd).length
    ? Object.entries(zd).sort((a, b) => b[1] - a[1]).map(([z, c]) =>
        `<div class="brow"><span class="blabel">${escHtml(z.slice(0, 18))}</span><div class="btrack"><div class="bfill" style="width:${Math.round(c / mz * 100)}%"></div></div><span class="bcount">${c}</span></div>`).join('')
    : '<p style="font-size:13px;color:var(--text-secondary);">Aún no hay datos.</p>';

  const cd = stats.compDetail || {};
  const mc = Math.max(...Object.values(cd), 1);
  document.getElementById('comp-bars').innerHTML = Object.keys(cd).length
    ? Object.entries(cd).sort((a, b) => b[1] - a[1]).map(([c, n]) =>
        `<div class="brow"><span class="blabel">${escHtml(c)}</span><div class="btrack"><div class="bfill" style="width:${Math.round(n / mc * 100)}%"></div></div><span class="bcount">${n}</span></div>`).join('')
    : '<p style="font-size:13px;color:var(--text-secondary);">Aún no hay datos.</p>';
}


// ── Init ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const student = getStudent();
  if (student) {
    updateStudentBadge(student);
  } else {
    showRegisterModal();
  }
  initMap();
  initZoom();
  loadSightings();
  showEdu(0, document.querySelector('.ecard'));
  renderQuiz();
});

function toggleSidebar() {
  const panel = document.getElementById('sidebar-panel');
  const btn = document.querySelector('.map-toggle-btn');
  panel.classList.toggle('collapsed');
  btn.innerHTML = panel.classList.contains('collapsed')
    ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>'
    : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>';
  btn.title = panel.classList.contains('collapsed') ? 'Mostrar panel lateral' : 'Ocultar panel lateral';
}

function initMap() {
  const layer = document.getElementById('pins-layer');
  referencePoints.forEach((pt, i) => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'ref-point');
    g.setAttribute('data-idx', i);
    g.addEventListener('click', () => { if (!dragged) pointClick(pt.name); });

    const hit = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    hit.setAttribute('cx', pt.x);
    hit.setAttribute('cy', pt.y);
    hit.setAttribute('r', 40);
    hit.setAttribute('fill', 'transparent');

    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('class', 'ref-dot');
    dot.setAttribute('cx', pt.x);
    dot.setAttribute('cy', pt.y);
    dot.setAttribute('r', 15);
    dot.setAttribute('fill', '#e53935');
    dot.setAttribute('stroke', 'white');
    dot.setAttribute('stroke-width', '2.5');
    dot.setAttribute('opacity', '0.85');

    const halo = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    halo.setAttribute('class', 'halo-ring');
    halo.setAttribute('cx', pt.x);
    halo.setAttribute('cy', pt.y);
    halo.setAttribute('r', 24);
    halo.setAttribute('fill', 'none');
    halo.setAttribute('stroke', '#e53935');
    halo.setAttribute('stroke-width', '1.5');
    halo.setAttribute('opacity', '0.25');

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('class', 'ref-label');
    label.setAttribute('x', pt.x);
    label.setAttribute('y', pt.y - 22);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-size', '12');
    label.setAttribute('fill', '#1e3c2b');
    label.setAttribute('font-weight', '700');
    label.setAttribute('paint-order', 'stroke');
    label.setAttribute('stroke', 'white');
    label.setAttribute('stroke-width', '4');
    label.textContent = pt.name;

    g.appendChild(hit);
    g.appendChild(halo);
    g.appendChild(dot);
    g.appendChild(label);
    layer.appendChild(g);
  });
}

function pointClick(name) {
  selectedPoint = name;
  const info = document.getElementById('zone-info');
  document.getElementById('zone-name-display').textContent = 'Punto seleccionado: ' + name;
  info.style.display = 'block';
}

function switchTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'reporte' || id === 'mapa') loadSightings();
  if (id === 'quiz') renderQuiz();
  if (id === 'historial') loadHistory();
}

// ── Historial ─────────────────────────────────────────────────────────
async function loadHistory() {
  const search = (document.getElementById('hist-search')?.value || '').toLowerCase().trim();
  const filterZone = document.getElementById('hist-filter')?.value || '';

  try {
    const res = await fetch(API + '/sighting.php');
    const data = await res.json();
    if (!res.ok) return;

    const sightings = data.sightings || [];
    const tbody = document.getElementById('history-body');
    const empty = document.getElementById('history-empty');
    if (!tbody) return;

    // Populate filter dropdown with zones
    const filterSel = document.getElementById('hist-filter');
    if (filterSel && filterSel.options.length <= 1) {
      const zones = [...new Set(sightings.map(s => s.zone || '').filter(Boolean))];
      zones.sort().forEach(z => {
        const opt = document.createElement('option');
        opt.value = z;
        opt.textContent = z;
        filterSel.appendChild(opt);
      });
    }

    // Filter
    const filtered = sightings.filter(s => {
      const name = (s.student_name || '').toLowerCase();
      const zone = (s.zone || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const matchSearch = !search || name.includes(search) || zone.includes(search) || email.includes(search);
      const matchZone = !filterZone || s.zone === filterZone;
      return matchSearch && matchZone;
    });

    if (filtered.length === 0) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    tbody.innerHTML = filtered.map(s => {
      const fechaStr = s.fecha || (s.created_at || '').slice(0, 10);
      return `<tr>
        <td data-label="Nombre"><strong>${escHtml(s.student_name || 'Anónimo')}</strong></td>
        <td data-label="Correo">${escHtml(s.email || '—')}</td>
        <td data-label="Zona"><span class="si-badge" style="font-size:12px;">${escHtml((s.zone || '').slice(0, 20))}</span></td>
        <td data-label="Hora">${escHtml(s.hora || '—')}</td>
        <td data-label="Cantidad">${escHtml(s.cantidad || '—')}</td>
        <td data-label="Tamaño">${escHtml(s.tamano || '—')}</td>
        <td data-label="Comportamiento">${escHtml(s.comportamiento || '—')}</td>
        <td data-label="Fecha" style="white-space:nowrap;">${fechaStr} ${(s.created_at || '').slice(11, 16)}</td>
      </tr>`;
    }).join('');
  } catch (_) {}
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showEdu(idx, card) {
  document.querySelectorAll('.ecard').forEach(c => c.classList.remove('sel'));
  card.classList.add('sel');
  const d = eduData[idx];
  document.getElementById('edu-content').innerHTML = `<h3>${d.title}</h3>${d.body}<div class="tipbox">${d.tip}</div>`;
}

function renderQuiz() {
  const area = document.getElementById('quiz-area');
  if (quizState.current >= quizData.length) {
    const pct = Math.round(quizState.score / quizData.length * 100);
    area.innerHTML = `<div class="qresult"><div style="font-size:36px;font-weight:500;color:#0F6E56;">${quizState.score}/${quizData.length}</div><div style="font-size:13px;color:var(--color-text-secondary);">${pct}% correcto</div><div style="font-size:13px;color:var(--color-text-primary);margin:12px 0;line-height:1.6;">${pct >= 80 ? '¡Excelente! Has demostrado un buen conocimiento sobre la iguana verde.' : pct >= 50 ? 'Buen trabajo. Revisa la sección Aprende para reforzar tus conocimientos.' : 'Te recomendamos leer la sección Aprende y volver a intentarlo.'}</div><button class="bts" onclick="restartQuiz()">Intentar de nuevo</button></div>`;
    return;
  }
  const q = quizData[quizState.current];
  area.innerHTML = `<div class="qdots">${quizData.map((_, i) => `<div class="qdot${i < quizState.current ? ' done' : i === quizState.current ? ' cur' : ''}"></div>`).join('')}</div><div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px;">Pregunta ${quizState.current + 1} de ${quizData.length}</div><div class="qq">${q.q}</div><div class="qopts">${q.opts.map((o, i) => `<button class="qopt" onclick="answerQuiz(${i})">${o}</button>`).join('')}</div><div id="qfb" style="display:none;"></div><button id="btn-next" style="display:none;" class="bts" onclick="nextQ()">Siguiente</button>`;
}

function answerQuiz(idx) {
  if (quizState.answered) return;
  quizState.answered = true;
  const q = quizData[quizState.current];
  document.querySelectorAll('.qopt').forEach((o, i) => { o.disabled = true; if (i === q.correct) o.classList.add('correct'); else if (i === idx && idx !== q.correct) o.classList.add('wrong'); });
  const ok = idx === q.correct;
  if (ok) quizState.score++;
  const fb = document.getElementById('qfb');
  fb.className = 'qfb ' + (ok ? 'ok' : 'no');
  fb.textContent = ok ? q.fb : q.fbw;
  fb.style.display = 'block';
  document.getElementById('btn-next').style.display = 'inline-block';
}

function nextQ() {
  quizState.current++;
  quizState.answered = false;
  renderQuiz();
}

function restartQuiz() {
  quizState = { current: 0, score: 0, answered: false };
  renderQuiz();
}
