# Sistema de Gestión de Activos TI
**Municipalidad de Coyhaique — Unidad de Informática**

Plataforma web para registrar y consultar actas de asignación de equipos y periféricos. Incluye historial completo por equipo, generación de actas imprimibles y búsqueda por funcionario, tipo o número de inventario.

---

## Requisitos

- [Node.js](https://nodejs.org) v18 o superior

---

## Instalación en servidor

```bash
git clone https://github.com/Otakonch/gestion-activos-ti.git
cd gestion-activos-ti
npm install
node server.js
```

La primera vez que inicie, el sistema crea automáticamente la base de datos (`actas.json`) cargando los **71 registros históricos** incluidos en `seed.json`. No se requiere ninguna configuración adicional.

La plataforma queda disponible en: `http://localhost:3000`  
Para exponer al resto de la red municipal, apuntar el servidor o proxy (nginx, IIS, etc.) a ese puerto.

---

## Uso local en Windows

Doble clic en **`iniciar.bat`** — instala dependencias si es necesario, inicia el servidor y abre el navegador automáticamente.

---

## Estructura de archivos

```
gestion-activos-ti/
├── public/
│   └── index.html      # Plataforma web (frontend)
├── server.js           # Servidor Node.js + API REST
├── package.json        # Dependencias (solo Express)
├── seed.json           # 71 registros históricos (datos iniciales)
├── iniciar.bat         # Arranque rápido en Windows
└── .gitignore
```

> `actas.json` — base de datos en vivo, se genera automáticamente y **no está en el repositorio**. Los datos persisten entre reinicios del servidor.

---

## API REST

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/actas` | Todos los registros |
| GET | `/api/actas/:id` | Un registro |
| POST | `/api/actas` | Crear nueva acta |
| PUT | `/api/actas/:id` | Editar acta |
| DELETE | `/api/actas/:id` | Eliminar acta |
| GET | `/api/stats` | Estadísticas |

---

## Actualizar el sistema

```bash
git pull origin main
node server.js
```

Los datos existentes en `actas.json` no se tocan al actualizar.
