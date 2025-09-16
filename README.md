# 20minCoach — Frontend Architecture (Caso #1)


**Curso:** Diseño del Software / IC-6821

**Grupo:** 3 integrantes
## Integrantes
- Fiorella Chinchilla Ortiz - fichinchilla@estudiantec.cr
- Javier Rodriguez Menjivar - ja.rodriguez@estudiantec.cr
- Josue Salazar Quiros - jo.salazar@estudiantec.cr

## Descripción breve
Plataforma de conexión instantánea entre usuarios y coaches por sesiones de 20 minutos. Este repositorio contiene la arquitectura frontend propuesta, PoCs, pruebas unitarias y documentación para implementación.

## Tecnologías 
- Framework Frontend: React + TypeScript
- Gestión de Estado: Redux Toolkit + RTK Query
- Estilos: Tailwind CSS
- Video en Tiempo Real: WebRTC (Simple-Peer)
- Notificaciones: Socket.io
- Testing Unitario: Jest + React Testing Library
- Testing E2E: Cypress
- Autenticación: Auth0 / AWS Cognito
- Prototipado UX: Figma
- Testeo UX: Maze
- Linter: ESLint + Prettier
- Logging: Sentry
- Bundling: Vite
- Deployment: Vercel
- Gestión de Paquetes: Yarn
- Control de Versiones: Github

## Justificación de tecnologías
#### React + TypeScript
React es ideal para aplicaciones dinámicas y en tiempo real gracias a su virtual DOM y ecosistema. TypeScript añade tipado estático para mayor robustez y mantenibilidad.

#### Redux Toolkit + RTK Query
Para manejar estado global (ej: sesiones de usuario, disponibilidad de coaches) y caching de datos de APIs. RTK Query simplifica las llamadas asíncronas.

#### Tailwind CSS
Facilita el diseño responsive y consistente con utilidades CSS. Se integra bien con React y permite customización temática (light/dark mode).

#### WebRTC
Estándar para video y audio peer-to-peer. Se usará con librerías como Simple-Peer o Mediasoup para gestionar conexiones.

#### Socket.io
Se usará para notificaciones push y cambios en tiempo real

#### Jest
Framework líder para pruebas en React. Se integra con React Testing Library para tests centrados en UX.

#### Cypress
Framework de pruebas para flujos críticos, como agendar sesiones o autenticación.

#### Auth0
Soluciones robustas con MFA, roles preconfigurados (BasicUser/PremiumUser) y SDKs para React. Auth0 ofrece interfaz de login personalizable.

#### Figma
Permite colaboración en equipo y genera código cercano a React. Plugins para generar componentes desde diseños.

#### Maze
Para pruebas con usuarios. Genera heatmaps y métricas de usabilidad (ej: tasa de finalización de tareas).

#### ESLint + Prettier
Mantienen consistencia en el código. Configuración personalizada con reglas para TypeScript y React.

#### Sentry
Captura errores en frontend con detalles de contexto. Ideal para debugging en producción.

#### Vite
Más rápido que Webpack para desarrollo y builds.

#### Vercel
Para entornos staging/producción. Tiene integración con GitHub y despliegue automático.

#### Yarn
Gestor de paquetes seleccionado por performance y workspaces si se escala a monorepo.

#### Github
Convencional para mensajes claros en commits

## Estructura del repositorio


## Fechas importantes
- Última fecha para preguntas: Lunes 22 de septiembre
- Fecha límite de commits: Sábado 27 de septiembre

