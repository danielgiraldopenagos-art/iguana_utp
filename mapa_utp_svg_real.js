const eduData = [
  { title: "¿Quién es la iguana verde?", body: `<p>La iguana verde (<em>Iguana iguana</em>) es un reptil herbívoro de la familia Iguanidae, nativa de América Central y del Sur, incluyendo Colombia. Puede alcanzar hasta 1,8 m y vivir más de 20 años.</p><p>Reconocible por su cresta dorsal, papada prominente y garras para trepar. Los machos adultos desarrollan coloraciones naranja en época reproductiva.</p><ul><li>Ectotérmica: regula temperatura con el sol</li><li>Activa principalmente en horas de mayor radiación</li><li>Ovípara: pone entre 10 y 70 huevos</li></ul>`, tip: "En la UTP, las iguanas aprovechan el guaducto, los árboles del campus y los senderos arborizados como refugio y zona de termorregulación." },
  { title: "Hábitat y dieta en el campus", body: `<p>Habita bosques tropicales, riberas de ríos y zonas urbanas con vegetación. El campus UTP ofrece condiciones favorables por su diversidad vegetal, el guaducto y los jardines.</p><ul><li>Hojas tiernas y brotes de árboles del campus</li><li>Flores y frutos (mango, higuillo, papaya)</li><li>Juveniles consumen ocasionalmente insectos</li></ul>`, tip: "Nunca ofrezcas pan, arroz ni comida de cafetería a las iguanas. Su digestión está adaptada exclusivamente a vegetación natural." },
  { title: "Estado de conservación", body: `<p>Figura en el Apéndice II de CITES. En Colombia está protegida por la Ley 2 de 1959 y resoluciones del Ministerio de Ambiente.</p><ul><li>Pérdida de hábitat por urbanización</li><li>Captura ilegal para mascotas</li><li>Atropellamiento vehicular en el campus</li><li>Alimentación antrópica inadecuada</li><li>Persecución por desconocimiento</li></ul>`, tip: "Si encuentras una iguana herida en la UTP, contacta a la Facultad de Ciencias Ambientales o al programa de Medicina Veterinaria y Zootecnia." },
  { title: "Convivencia responsable", body: `<p>La presencia de iguanas en la UTP es un indicador positivo de biodiversidad urbana. Convivir con ellas es parte de nuestra responsabilidad como comunidad universitaria.</p><ul><li>No perseguirlas ni causarles estrés</li><li>No alimentarlas con comida humana</li><li>Mantener mínimo 2 metros de distancia</li><li>No capturarlas ni tocarlas</li><li>Registrar avistamientos para el monitoreo</li><li>Respetar la vegetación del campus</li></ul>`, tip: "Cada avistamiento que registras contribuye a datos reales de ciencia ciudadana que apoyan la gestión ambiental de la UTP." }
];

const quizData = [
  { q: "¿Cuál es la principal amenaza para la iguana verde en entornos urbanos como la UTP?", opts: ["Exceso de lluvia", "Pérdida de hábitat y captura ilegal", "Competencia con otras especies", "Enfermedades fúngicas"], correct: 1, fb: "Correcto. La pérdida de hábitat y la captura ilegal son las mayores amenazas.", fbw: "La principal amenaza es la pérdida de hábitat y la captura para el tráfico de mascotas." },
  { q: "¿A qué apéndice de la CITES pertenece la Iguana iguana?", opts: ["Apéndice I", "Apéndice II", "Apéndice III", "No está en CITES"], correct: 1, fb: "Exacto. El Apéndice II regula el comercio internacional con controles estrictos.", fbw: "La iguana verde figura en el Apéndice II de CITES." },
  { q: "¿Qué tipo de alimentación tiene la iguana verde adulta?", opts: ["Carnívora", "Omnívora", "Principalmente herbívora", "Insectívora"], correct: 2, fb: "Muy bien. Los adultos son principalmente herbívoros: hojas, flores y frutos.", fbw: "Las iguanas adultas son principalmente herbívoras." },
  { q: "Si ves una iguana en el guaducto de la UTP, ¿qué haces?", opts: ["Te acercas y le das de comer", "Observas a distancia y registras el avistamiento", "La capturas para protegerla", "La asustas"], correct: 1, fb: "Exactamente. Observar con respeto y registrar es la conducta más responsable.", fbw: "Lo correcto es observar a distancia (mín. 2 m) y registrar el avistamiento." },
  { q: "¿Qué significa que la iguana sea ectotérmica?", opts: ["Genera calor interno", "Depende del sol para regular su temperatura", "Solo se activa de noche", "Mantiene temperatura constante"], correct: 1, fb: "Correcto. Las iguanas dependen del sol para alcanzar su temperatura óptima.", fbw: "Las iguanas son ectotérmicas: dependen del sol para regular su temperatura." }
];

let sightings = [];
let selectedZone = null;
let selectedZoneCenter = { x: 450, y: 290 };
let quizState = { current: 0, score: 0, answered: false };

const zoneCenters = {
  'Jardín Botánico / Bloque Y': { x: 162, y: 184 },
  'Quiosco': { x: 213, y: 340 },
  'Planetario': { x: 212, y: 396 },
  'Bloque 11': { x: 187, y: 257 },
  'Acopio de Residuos (Edificio 12)': { x: 160, y: 109 },
  'Edificio 13 / Observatorio': { x: 310, y: 101 },
  'Laboratorio Química Ambiental (Ed. 14)': { x: 505, y: 106 },
  'Bloque 10': { x: 410, y: 177 },
  'Bloque 9': { x: 355, y: 229 },
  'Bloque 8': { x: 339, y: 295 },
  'Biblioteca (Bloque 7)': { x: 430, y: 286 },
  'Bloque 6': { x: 508, y: 270 },
  'Cafetería Central El Galpón': { x: 522, y: 342 },
  'Bloque 5 / Coliseo': { x: 602, y: 309 },
  'Bloque 15': { x: 705, y: 227 },
  'Bloque 4': { x: 660, y: 357 },
  'Bloque 1 - Ingeniería': { x: 700, y: 422 },
  'Bloque 2': { x: 787, y: 416 },
  'Bloque 3': { x: 600, y: 421 },
  'Bloque 16': { x: 857, y: 536 },
  'La Frutería': { x: 315, y: 400 },
};

function zoneClick(name) {
  selectedZone = name;
  selectedZoneCenter = zoneCenters[name] || { x: 450, y: 290 };
  const info = document.getElementById('zone-info');
  document.getElementById('zone-name-display').textContent = 'Zona seleccionada: ' + name;
  info.style.display = 'block';
  document.querySelectorAll('.zone-hl').forEach(el => el.style.opacity = '0');
}

function addSighting() {
  if (!selectedZone) { alert('Por favor haz clic en una zona del mapa.'); return; }
  const hora = document.getElementById('sel-hora').value;
  const num = document.getElementById('sel-num').value;
  const tamano = document.getElementById('sel-tamano').value;
  const comp = document.getElementById('sel-comp').value;
  const obs = document.getElementById('txt-obs').value.trim();
  if (!hora || !num) { alert('Por favor completa hora y cantidad.'); return; }
  const s = { zona: selectedZone, cx: selectedZoneCenter.x, cy: selectedZoneCenter.y, hora, num, tamano, comp, obs, ts: new Date() };
  sightings.unshift(s);
  updateCounters();
  renderSightings();
  addPin(s.cx, s.cy);
  clearForm();
}

function addPin(cx, cy) {
  const layer = document.getElementById('pins-layer');
  const jx = (Math.random() - 0.5) * 18; const jy = (Math.random() - 0.5) * 12;
  const px = cx + jx; const py = cy + jy;
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
  document.getElementById('txt-obs').value = '';
}

function updateCounters() {
  const today = new Date().toDateString();
  document.getElementById('cnt-total').textContent = sightings.length;
  document.getElementById('cnt-hoy').textContent = sightings.filter(s => s.ts.toDateString() === today).length;
  document.getElementById('cnt-zones').textContent = new Set(sightings.map(s => s.zona)).size;
}

function renderSightings() {
  const list = document.getElementById('sightings-list');
  list.style.display = sightings.length ? 'block' : 'none';
  document.getElementById('sightings-items').innerHTML = sightings.slice(0, 5).map(s => `
    <div class="si-item">
      <span class="si-badge">${s.zona.split('(')[0].trim().slice(0, 16)}</span>
      <div><div class="si-title">${s.num}${s.tamano ? ' · ' + s.tamano : ''}${s.comp ? ' · ' + s.comp : ''}</div>
      <div class="si-meta">${s.hora} · ${s.ts.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}${s.obs ? ' · ' + s.obs.slice(0, 45) : ''}</div></div>
    </div>`).join('');
}

function switchTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + id).classList.add('active');
  btn.classList.add('active');
  if (id === 'reporte') updateReport();
  if (id === 'quiz') renderQuiz();
}

function showEdu(idx, card) {
  document.querySelectorAll('.ecard').forEach(c => c.classList.remove('sel'));
  card.classList.add('sel');
  const d = eduData[idx];
  document.getElementById('edu-content').innerHTML = `<h3>${d.title}</h3>${d.body}<div class="tipbox"><i class="ti ti-bulb" aria-hidden="true"></i> ${d.tip}</div>`;
}

function renderQuiz() {
  const area = document.getElementById('quiz-area');
  if (quizState.current >= quizData.length) {
    const pct = Math.round(quizState.score / quizData.length * 100);
    area.innerHTML = `<div class="qresult"><div style="font-size:36px;font-weight:500;color:#0F6E56;">${quizState.score}/${quizData.length}</div><div style="font-size:13px;color:var(--color-text-secondary);">${pct}% correcto</div><div style="font-size:13px;color:var(--color-text-primary);margin:12px 0;line-height:1.6;">${pct >= 80 ? '¡Excelente! Eres guardián de la iguana verde en la UTP.' : pct >= 50 ? 'Buen trabajo. Revisa el módulo Aprende para reforzar.' : 'Te animamos a visitar la sección Aprende.'}</div><button class="bts" onclick="restartQuiz()">Intentar de nuevo</button></div>`;
    return;
  }
  const q = quizData[quizState.current];
  area.innerHTML = `<div class="qdots">${quizData.map((_, i) => `<div class="qdot${i < quizState.current ? ' done' : i === quizState.current ? ' cur' : ''}"></div>`).join('')}</div><div style="font-size:11px;color:var(--color-text-secondary);margin-bottom:8px;">Pregunta ${quizState.current + 1} de ${quizData.length}</div><div class="qq">${q.q}</div><div class="qopts">${q.opts.map((o, i) => `<button class="qopt" onclick="answerQuiz(${i})">${o}</button>`).join('')}</div><div id="qfb" style="display:none;"></div><button id="btn-next" style="display:none;" class="bts" onclick="nextQ()">Siguiente →</button>`;
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

function updateReport() {
  const today = new Date().toDateString();
  document.getElementById('r-total').textContent = sightings.length;
  document.getElementById('r-hoy').textContent = sightings.filter(s => s.ts.toDateString() === today).length;
  document.getElementById('r-zonas').textContent = new Set(sightings.map(s => s.zona)).size;
  const hc = {};
  sightings.forEach(s => { hc[s.hora] = (hc[s.hora] || 0) + 1; });
  const th = Object.entries(hc).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('r-hora').textContent = th ? th[0].split('(')[0].trim() : '–';
  const zc = {};
  sightings.forEach(s => { zc[s.zona] = (zc[s.zona] || 0) + 1; });
  const mz = Math.max(...Object.values(zc), 1);
  document.getElementById('zona-bars').innerHTML = sightings.length ? Object.entries(zc).sort((a, b) => b[1] - a[1]).map(([z, c]) => `<div class="brow"><span class="blabel">${z.split('(')[0].trim().slice(0, 18)}</span><div class="btrack"><div class="bfill" style="width:${Math.round(c / mz * 100)}%"></div></div><span class="bcount">${c}</span></div>`).join('') : '<p style="font-size:13px;color:var(--color-text-secondary);">Sin datos.</p>';
  const cc = {};
  sightings.forEach(s => { if (s.comp) cc[s.comp] = (cc[s.comp] || 0) + 1; });
  const mc = Math.max(...Object.values(cc), 1);
  document.getElementById('comp-bars').innerHTML = Object.keys(cc).length ? Object.entries(cc).sort((a, b) => b[1] - a[1]).map(([c, n]) => `<div class="brow"><span class="blabel">${c}</span><div class="btrack"><div class="bfill" style="width:${Math.round(n / mc * 100)}%"></div></div><span class="bcount">${n}</span></div>`).join('') : '<p style="font-size:13px;color:var(--color-text-secondary);">Sin datos.</p>';
}

showEdu(0, document.querySelector('.ecard'));
renderQuiz();
