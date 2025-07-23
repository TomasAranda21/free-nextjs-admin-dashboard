# Dashboard Features

## Funcionalidades Implementadas

### 1. Dashboard Principal (`/`)

#### Tarjetas de Estadísticas
- **Total Users**: Muestra el número total de usuarios en la base de datos
- **Premium Users**: Muestra el número de usuarios premium
- **Free Users**: Muestra el número de usuarios gratuitos
- **Couples**: Muestra el número de parejas (usuarios con myCoupleId)

#### Tabla de Usuarios
- **Nombre del usuario**: Nombre completo del usuario
- **Email**: Dirección de correo electrónico
- **Dispositivo**: Icono y texto del dispositivo (iOS, Android, Web, Unknown)
- **Status**: Badge que indica si es Premium o Free
- **Fecha de creación**: Formato legible de la fecha de registro
- **Última actividad**: Formato legible de la última actividad

**Características de la tabla:**
- Paginación (10 usuarios por página)
- Estados de carga
- Formato de fechas en español
- Badges de estado con colores diferenciados

### 2. Página de Reviews (`/reviews`)

#### Tabla de Reviews
- **Couple Name**: Nombre de la pareja
- **Couple ID**: ID único de la pareja
- **Status**: Badge con el estado actual (Pending, With Image, Approved, Rejected)
- **Telegram ID**: ID de Telegram
- **Language**: Idioma (Español, English, Português)
- **Created**: Fecha de creación
- **Image Added**: Fecha cuando se agregó la imagen
- **Approved**: Fecha de aprobación

#### Filtros
- **Filtro por Status**: Select dropdown para filtrar por estado
  - All Status
  - Pending
  - With Image
  - Approved
  - Rejected

**Características:**
- Filtrado en tiempo real
- Estados de carga
- Manejo de fechas de Firestore
- Badges de estado con colores diferenciados

### 3. Navegación

#### Sidebar Actualizado
- **Dashboard**: Vista general con estadísticas y tabla de usuarios
- **Management**: Nueva sección con Reviews

## Estructura de Datos

### Tipos TypeScript
```typescript
// Usuario
interface IUser {
  id: string;
  name: string;
  goal: UserGoal;
  email: string;
  createdAt: string;
  lastActivityAt: string;
  streakDays: number;
  chatsTodayCount: number;
  language: keyof typeof Language | "en";
  isPremium: boolean;
  codeCouple: string;
  myCoupleId: string | null;
  challengesTodayCount: number;
  availableDailyChallenges: boolean;
  deviceType?: "android" | "ios" | "web" | "unknown";
  lastOfferShown: {
    type: OfferType;
    at: string;
  };
}

// Review
interface IReview {
  coupleId: string;
  telegramId: number;
  coupleName: string;
  language: ReviewLanguage;
  firebaseImageUrl?: string;
  status: ReviewStatus;
  createdAt: Timestamp;
  imageAddedAt?: Timestamp;
  approvedAt?: Timestamp;
  rejectionReason?: string;
}
```

## Servicios de Firestore

### Funciones Disponibles
- `getUsers()`: Obtiene todos los usuarios
- `getDashboardStats()`: Calcula estadísticas del dashboard
- `getReviews()`: Obtiene todas las reviews
- `getReviewsByStatus(status)`: Filtra reviews por estado
- `updateReviewStatus(reviewId, status)`: Actualiza el estado de una review

## Componentes Creados

### Dashboard
- `StatsCards`: Tarjetas de estadísticas
- `UsersTable`: Tabla de usuarios con paginación
- `useDashboardData`: Hook personalizado para datos del dashboard

### Reviews
- `ReviewsPage`: Página completa de reviews con filtros

## Configuración Requerida

### Variables de Entorno
```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

### Colecciones de Firestore
- `users`: Colección de usuarios
- `reviews`: Colección de reviews

## Próximos Pasos

### Funcionalidades Pendientes
1. **Actualización de Status de Reviews**: Implementar la funcionalidad para cambiar el estado de las reviews
2. **Búsqueda y Filtros Avanzados**: Agregar búsqueda por nombre, email, etc.
3. **Exportación de Datos**: Funcionalidad para exportar datos a CSV/Excel
4. **Notificaciones**: Sistema de notificaciones para nuevas reviews
5. **Analytics**: Gráficos y métricas más detalladas

### Mejoras Técnicas
1. **Caching**: Implementar cache para mejorar el rendimiento
2. **Real-time Updates**: Actualizaciones en tiempo real con Firestore listeners
3. **Optimización**: Lazy loading y virtualización para tablas grandes
4. **Testing**: Tests unitarios y de integración 