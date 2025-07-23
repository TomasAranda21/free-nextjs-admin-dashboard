# Configuración de Firebase Auth

## Pasos para configurar Firebase Authentication

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication en la sección "Authentication" del menú lateral

### 2. Configurar Authentication

1. En la sección Authentication, ve a "Sign-in method"
2. Habilita "Email/Password" como proveedor de autenticación
3. Opcionalmente, puedes habilitar otros proveedores como Google, Facebook, etc.

### 3. Obtener credenciales de configuración

1. Ve a la configuración del proyecto (ícono de engranaje)
2. Selecciona "Project settings"
3. En la pestaña "General", desplázate hacia abajo hasta "Your apps"
4. Haz clic en el ícono de web (</>) para agregar una app web
5. Registra tu app y copia la configuración

### 4. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### 5. Crear usuarios de prueba

1. En Firebase Console, ve a Authentication > Users
2. Haz clic en "Add user"
3. Ingresa un email y contraseña para crear un usuario de prueba

### 6. Reglas de seguridad (opcional)

Si planeas usar Firestore o Storage, configura las reglas de seguridad apropiadas.

## Uso

Una vez configurado:

1. Los usuarios pueden registrarse en `/signup`
2. Los usuarios pueden iniciar sesión en `/signin`
3. Solo los usuarios autenticados pueden acceder al dashboard
4. Los usuarios pueden cerrar sesión desde el dropdown del usuario en el header
5. El middleware redirige automáticamente a usuarios no autenticados al login
6. Después del login, los usuarios son redirigidos a la página que intentaban acceder

## Flujo de autenticación

1. **Usuario no autenticado intenta acceder a una ruta protegida**
   - El middleware detecta que no hay token de autenticación
   - Redirige al usuario a `/signin?redirect=/ruta-original`

2. **Usuario se autentica**
   - Se crea una cookie segura con el token de Firebase
   - El usuario es redirigido a la ruta original (si existe) o al dashboard

3. **Usuario autenticado intenta acceder a rutas públicas**
   - El middleware redirige automáticamente al dashboard

4. **Usuario cierra sesión**
   - Se elimina la cookie de autenticación
   - El usuario es redirigido al login

## Características implementadas

- ✅ Autenticación con email/password
- ✅ Middleware de protección de rutas
- ✅ Contexto de autenticación
- ✅ Formularios de login y registro
- ✅ Logout funcional
- ✅ Redirección automática con parámetro redirect
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Cookies de autenticación seguras
- ✅ Protección a nivel de servidor (middleware) 