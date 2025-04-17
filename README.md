# GymApp 🏋️‍♂️

GymApp es una aplicación web para la gestión de rutinas de gimnasio, diseñada para profesores y alumnos. Los profesores pueden crear y editar rutinas, gestionar ejercicios y usuarios, mientras que los alumnos pueden ver sus rutinas asignadas. Este proyecto es un MVP (Minimum Viable Product) desarrollado como parte de un sistema para facilitar el seguimiento de entrenamientos.

## 🚀 Características del MVP

- **Dashboard para Profesores**: Los profesores (`PROFESSOR` y `ADMIN`) pueden gestionar usuarios (ver lista, editar roles, activar/desactivar cuentas).
- **Gestión de Rutinas**: Los profesores pueden crear, editar y eliminar rutinas para los alumnos en `/routines` y `/routines/edit/[id]`.
- **Página para Alumnos**: Los alumnos (`ALUMNO`) pueden ver sus rutinas asignadas en `/alumnos`, con días y nombres de ejercicios.
- **Gestión de Ejercicios**: Los profesores pueden agregar, editar y eliminar ejercicios en `/exercises`.
- **Perfil de Usuario**: Todos los usuarios autenticados pueden editar su información (nombre) en `/profile`.
- **Seguridad de Roles**: Verificación de roles en todas las páginas y rutas API para restringir acceso según el tipo de usuario.
- **Diseño Responsive**: La interfaz es responsive y usa un diseño oscuro con detalles en amarillo, siguiendo una estética moderna.

## 🛠 Tecnologías Utilizadas

- **Frontend**: Next.js (React Framework), Tailwind CSS para estilos.
- **Backend**: Next.js API Routes, Prisma ORM para la base de datos.
- **Autenticación**: Clerk para gestión de usuarios y sesiones.
- **Base de Datos**: MySQL (o la base de datos configurada con Prisma).
- **Despliegue**: Vercel (recomendado para despliegue automático).

## 📦 Instalación

Sigue estos pasos para instalar y ejecutar el proyecto localmente.

### Prerrequisitos

- Node.js (versión 18.x o superior)
- npm o yarn
- Una base de datos MySQL (o la que uses con Prisma)
- Una cuenta de Clerk para autenticación (obtén tus claves en [Clerk Dashboard](https://dashboard.clerk.dev/))

### Pasos

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/[tu-usuario]/gymapp.git
   cd gymapp
2. **Instala las dependencias**:
     ```bash
   npm install
   # o
   yarn install
3. **Configura las variables de entorno**:
Crea un archivo .env.local en la raíz del proyecto y agrega las siguientes variables:
  # Clerk (reemplaza con tus claves)
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxx
  CLERK_SECRET_KEY=sk_test_xxxxxxxxxx
  CLERK_WEBHOOK_SIGNING_SECRET= sk_test_xxxxxxxxxx
  NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
  NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
  NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
  
  # Base de datos (reemplaza con tu URL de conexión)
  DATABASE_URL="mysql://usuario:contraseña@localhost:5432/gymapp"

4. **Configura la base de datos**:
Asegúrate de que tu base de datos esté corriendo y ejecuta las migraciones de Prisma:
     ```bash
   npx prisma migrate dev --name init

5.- Inicia el servidor de desarrollo:
     ```bash
   npm run dev

## 🌐 Uso

1. **Inicia sesión**:
   - Accede a `http://localhost:3000/sign-in` para iniciar sesión con Clerk.
   - Si eres un profesor (`PROFESSOR` o `ADMIN`), serás redirigido a `/dashboard`.
   - Si eres un alumno (`Alumno`), serás redirigido a `/alumnos`.

2. **Funcionalidades principales**:
   - **Profesores**:
     - Gestiona usuarios en `/dashboard`.
     - Crea y edita rutinas en `/routines` y `/routines/edit/[id]`.
     - Administra ejercicios en `/exercises`.
   - **Alumnos**:
     - Ve tus rutinas asignadas en `/alumnos`.
   - **Todos los usuarios**:
     - Edita tu perfil (nombre) en `/profile`.

3. **Roles y permisos**:
   - `PROFESSOR` y `ADMIN`: Acceso a `/dashboard`, `/routines`, `/exercises`.
   - `STUDENT`: Acceso a `/alumnos` y `/profile`.
   - Usuarios no autenticados son redirigidos a `/sign-in`.
  
## 📂 Estructura de Carpetas

gymapp/
├── app/                    # Páginas y rutas API de Next.js
│   ├── api/                # Rutas API
│   │   ├── exercises/
│   │   ├── routines/
│   │   └── users/
│   │   └── alumno/
│   │   └── sync-users/     
│   │   └── upload-profile-pic/
│   │   └── webhooks/      
│   ├── alumnos/            # Página para alumnos
│   ├── dashboard/          # Dashboard para profesores
│   ├── exercises/          # Página de gestión de ejercicios
│   ├── profile/            # Página de perfil
│   ├── routines/           # Página de gestión de rutinas
│   └── Home/               # Home Page
├── components/             # Componentes reutilizables
│   ├── Alumnos/            # Componentes para la página /alumnos
│   ├── Admin/              # Componentes para /dashboard
│   ├── ExercisesPage/      # Componentes para /exercises
│   ├── ProfilePage/        # Componentes para /profile
│   └── RoutinesPage/       # Componentes para /routines
│   └── RoutinesEditPage/   # Componentes para /routines
│   └── HomePageComponets/  # Componentes para /home
├── lib/                    # Utilidades y configuración
│   └── prisma.js           # Configuración de Prisma
├── public/                 # Archivos estáticos
└── prisma/                 # Esquema y migraciones de Prisma
│   └── schema.prisma
├── types/                 # Administrar types de clerk

