# IguanaUTP

Aplicación web para el monitoreo de la iguana verde (*Iguana iguana*) en el campus de la Universidad Tecnológica de Pereira.

## Descripción

Esta aplicación permite a la comunidad de la UTP:

- Registrarse con nombre y correo institucional.
- Registrar avistamientos de iguanas en 30 puntos de referencia del campus.
- Consultar información educativa sobre la especie.
- Realizar un quiz interactivo para reforzar conocimientos.
- Ver estadísticas básicas de avistamientos.

## Requisitos

- Docker y Docker Compose (para la versión con base de datos).
- O bien PowerShell (para servidor local sin Docker).

## Inicio rápido con Docker

```bash
docker compose up -d
```

Esto levanta tres servicios:
| Servicio    | Puerto | URL                         |
|-------------|--------|-----------------------------|
| App PHP     | 8080   | http://localhost:8080        |
| phpMyAdmin  | 8081   | http://localhost:8081        |
| MySQL       | 3307   | (interno, puerto 3306)       |

Credenciales de MySQL: usuario `iguana`, contraseña `iguana123`.

### Primer uso

1. Abre http://localhost:8080
2. Se mostrará un modal para registrar tu nombre y correo institucional.
3. Selecciona un punto rojo en el mapa para registrar un avistamiento.
4. Los datos se guardan en MySQL y se consultan vía API PHP.

### Detener

```bash
docker compose down
```

Para borrar también los datos de la BD:

```bash
docker compose down -v
```

## Sin Docker (solo frontend estático)

Usa `server.ps1` desde PowerShell:

```powershell
.\server.ps1
```

Luego abre http://localhost:8080. En este modo los datos solo se guardan en memoria (sin persistencia).

## Estructura del proyecto

```
├── docker-compose.yml    # Orquestación de servicios
├── Dockerfile            # Imagen PHP-Apache con PDO MySQL
├── www/
│   ├── index.php         # Aplicación principal
│   ├── assets/
│   │   └── mapa-utp.jpg  # Mapa satelital del campus UTP
│   ├── css/
│   │   └── style.css     # Estilos de la aplicación
│   ├── js/
│   │   ├── data.js       # Puntos de referencia, contenido educativo, quiz
│   │   └── app.js        # Lógica: mapa, registro, API, modal estudiante
│   ├── api/
│   │   ├── db.php        # Conexión a MySQL (PDO)
│   │   ├── student.php   # Registro de estudiantes
│   │   └── sighting.php  # CRUD de avistamientos
│   └── sql/
│       └── schema.sql    # Esquema de base de datos
├── server.ps1            # Servidor HTTP local (PowerShell)
└── README.md
```

## Puntos de referencia

El mapa contiene 30 puntos rojos que corresponden a ubicaciones estratégicas del campus donde se han registrado avistamientos de iguanas, incluyendo edificios, zonas verdes y áreas de alimentación.

## Base de datos

Tabla `students`:
- `id`, `name`, `email` (único), `created_at`

Tabla `sightings`:
- `id`, `student_id` (FK → students), `zone`, `hora`, `cantidad`, `tamano`, `comportamiento`, `observaciones`, `created_at`

Accede a phpMyAdmin en http://localhost:8081 (usuario: `root`, contraseña: `iguana123`).

## Objetivo

Mejorar la gestión de biodiversidad en el campus de la UTP a través del registro ciudadano de observaciones.
