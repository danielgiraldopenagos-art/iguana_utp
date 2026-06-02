const referencePoints = [
  { x: 1150, y: 349, name: "Edificio 13" },
  { x: 1074, y: 916, name: "Bloque 8" },
  { x: 2718, y: 109, name: "Bloque 16" },
  { x: 385, y: 229, name: "Acopio Residuos" },
  { x: 1978, y: 1060, name: "Bloque 5 Coliseo" },
  { x: 2071, y: 1258, name: "Bloque 4" },
  { x: 1019, y: 505, name: "Observatorio" },
  { x: 2596, y: 1592, name: "Bloque 2" },
  { x: 568, y: 615, name: "Jardin Botanico" },
  { x: 1927, y: 580, name: "Bloque 15" },
  { x: 1314, y: 965, name: "Biblioteca" },
  { x: 641, y: 228, name: "Acopio Residuos Norte" },
  { x: 1729, y: 1274, name: "Cafeteria Central" },
  { x: 937, y: 669, name: "Bloque 9" },
  { x: 2270, y: 1319, name: "Bloque 1 Ingenieria" },
  { x: 1633, y: 1025, name: "Bloque 6" },
  { x: 985, y: 786, name: "Bloque 9 Este" },
  { x: 956, y: 1593, name: "La Fruteria" },
  { x: 1771, y: 1593, name: "Bloque 3" },
  { x: 583, y: 714, name: "Jardin Botanico Este" },
  { x: 1631, y: 419, name: "Laboratorio Quimica" },
  { x: 785, y: 984, name: "Quiosco" },
  { x: 985, y: 829, name: "Bloque 9 Sur" },
  { x: 1177, y: 519, name: "Bloque 10" },
  { x: 739, y: 597, name: "Jardin Botanico Sur" },
  { x: 196, y: 233, name: "Acopio Residuos Oeste" },
  { x: 801, y: 244, name: "Edificio 13 Norte" },
  { x: 1056, y: 977, name: "Bloque 8 Sur" },
  { x: 749, y: 518, name: "Jardin Botanico Central" },
  { x: 863, y: 470, name: "Edificio 13 Este" },
];

const eduData = [
  { title: "¿Quién es la iguana verde?", body: `<p>La iguana verde (<em>Iguana iguana</em>) es un reptil herbívoro que vive en América Central y del Sur, incluyendo Colombia. Puede medir hasta 1,8 m y vivir más de 20 años.</p><p>Se reconoce por su cresta en la espalda, su papada grande y sus garras fuertes para trepar. Los machos adultos pueden mostrar colores naranja cuando se reproducen.</p><ul><li>Ectotérmica: usa el sol para regular su temperatura corporal.</li><li>Activa durante el día, especialmente con buena luz solar.</li><li>Pone huevos; cada hembra puede poner entre 10 y 70.</li></ul>`, tip: "En la UTP, las iguanas usan el guaducto, los árboles y los senderos arbolados para refugiarse y regular su temperatura." },
  { title: "Hábitat y dieta en el campus", body: `<p>En el campus UTP, la iguana verde vive en áreas con mucha vegetación. Los jardines, árboles y el guaducto le ofrecen sombra y alimento.</p><ul><li>Come hojas tiernas y brotes de árboles.</li><li>También come flores y frutos como mango, higuillo y papaya.</li><li>Los juveniles pueden comer insectos de forma ocasional.</li></ul>`, tip: "No le des pan, arroz ni comida de cafetería a las iguanas; su digestión está adaptada a plantas naturales." },
  { title: "Estado de conservación", body: `<p>La iguana verde está en el Apéndice II de CITES, lo que significa que su comercio está regulado. En Colombia está protegida por la Ley 2 de 1959 y otras normas ambientales.</p><ul><li>Se pierde hábitat cuando se construye sin planificar.</li><li>Se captura ilegalmente para venderla como mascota.</li><li>Puede ser atropellada dentro del campus.</li><li>A veces se le da comida inadecuada.</li><li>También puede ser molestada por desconocimiento.</li></ul>`, tip: "Si ves una iguana herida en la UTP, informa a la Facultad de Ciencias Ambientales o al programa de Medicina Veterinaria y Zootecnia." },
  { title: "Convivencia responsable", body: `<p>La presencia de iguanas en la UTP ayuda a demostrar que el campus conserva biodiversidad. Convivir con ellas es una responsabilidad de toda la comunidad.</p><ul><li>No las persigas ni las asustes.</li><li>No las alimentes con comida humana.</li><li>Mantén una distancia mínima de 2 metros.</li><li>No las captures ni las toques.</li><li>Registra los avistamientos para apoyar el monitoreo.</li><li>Cuida las plantas y los árboles del campus.</li></ul>`, tip: "Cada avistamiento que registras aporta datos de ciencia ciudadana útiles para cuidar el campus." }
];

const quizData = [
  { q: "¿Cuál es la principal amenaza para la iguana verde en la UTP?", opts: ["Exceso de lluvia", "Pérdida de hábitat y captura ilegal", "Competencia con otras especies", "Enfermedades fúngicas"], correct: 1, fb: "Correcto. Las mayores amenazas son la pérdida de hábitat y la captura ilegal.", fbw: "La principal amenaza es la pérdida de hábitat y la captura ilegal para el comercio de mascotas." },
  { q: "¿En qué apéndice de la CITES aparece la iguana verde?", opts: ["Apéndice I", "Apéndice II", "Apéndice III", "No está en CITES"], correct: 1, fb: "Exacto. La iguana verde está en el Apéndice II de CITES.", fbw: "La iguana verde figura en el Apéndice II de CITES." },
  { q: "¿Cómo se alimenta principalmente una iguana verde adulta?", opts: ["Carnívora", "Omnívora", "Principalmente herbívora", "Insectívora"], correct: 2, fb: "Muy bien. Las iguanas adultas son principalmente herbívoras: comen hojas, flores y frutos.", fbw: "Las iguanas adultas consumen sobre todo plantas, por eso son principalmente herbívoras." },
  { q: "Si ves una iguana en el guaducto de la UTP, ¿qué debes hacer?", opts: ["Acercarte y darle de comer", "Observarla a distancia y registrar el avistamiento", "Capturarla para protegerla", "Asustarla"], correct: 1, fb: "Exacto. La mejor acción es observarla a distancia y registrar el avistamiento.", fbw: "Debes mantener distancia, respetarla y registrar el avistamiento sin intervenir." },
  { q: "¿Qué quiere decir que la iguana sea ectotérmica?", opts: ["Produce su propio calor", "Depende del sol para regular su temperatura", "Solo se activa de noche", "Mantiene una temperatura constante"], correct: 1, fb: "Correcto. Las iguanas dependen del sol para regular su temperatura corporal.", fbw: "Ser ectotérmica significa que la iguana usa el calor ambiental, especialmente el sol, para mantenerse a la temperatura adecuada." }
];
