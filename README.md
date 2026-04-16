# Frontend - Auxilio Mecánico

## Descripción

Este proyecto corresponde al frontend de una aplicación web orientada a la gestión de servicios mecánicos y atención de emergencias (choques, grúas, entrega de repuestos y reparaciones en el momento).

La aplicación permite a los dueños de talleres mecánicos visualizar solicitudes de servicio en tiempo real, gestionarlas y administrar recursos como inventario, personal y analíticas.

## Tecnologías utilizadas

* Angular (estructura basada en módulos y features)
* TypeScript
* HTML5
* CSS3

## Estructura del proyecto

```
src/
 ├── app/
 │   ├── core/
 │   │   ├── guards/
 │   │   ├── interceptors/
 │   │   ├── models/
 │   │   └── services/
 │   ├── features/
 │   │   ├── auth/
 │   │   └── dashboard/
 │   └── main.ts
 ├── index.html
 └── styles.css
```

### Core

Contiene elementos reutilizables en toda la aplicación:

* **Guards**: Control de acceso a rutas.
* **Interceptors**: Manejo de tokens y errores HTTP.
* **Models**: Definición de estructuras de datos.
* **Services**: Lógica de negocio y comunicación con el backend.

### Features

Organiza la aplicación por funcionalidades:

#### Auth

* Registro de usuarios
* Inicio de sesión

#### Dashboard

* Panel principal
* Gestión de personal
* Análisis de inventario
* Analíticas generales

## Funcionalidades principales

* Autenticación de usuarios (login y registro)
* Gestión de solicitudes de servicio
* Administración de inventario
* Gestión de mecánicos y personal
* Visualización de analíticas
* Manejo de notificaciones

## Instalación

1. Clonar el repositorio:

```
git clone <url-del-repositorio>
```

2. Ingresar al directorio:

```
cd frontend
```

3. Instalar dependencias:

```
npm install
```

4. Ejecutar la aplicación:

```
ng serve
```
ó
```
npm start
```

5. Abrir en el navegador:

```
http://localhost:4200
```

## Configuración

Asegúrate de configurar correctamente la URL del backend en los servicios (por ejemplo, en `auth.service.ts` o archivos de entorno).

## Arquitectura

El proyecto sigue una arquitectura modular basada en features, lo que permite:

* Escalabilidad
* Separación de responsabilidades
* Mantenibilidad del código

## Buenas prácticas implementadas

* Uso de interceptores para manejo global de errores
* Separación de lógica en servicios
* Tipado fuerte mediante modelos
* Protección de rutas mediante guards

## Licencia

Este proyecto es de uso académico.

---

Desarrollado como parte de un sistema de gestión de servicios mecánicos.
