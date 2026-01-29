# Micuartito - App de Alquiler de Cuartos

Aplicación web para la gestión de alquiler de cuartos entre propietarios e inquilinos.

## 📁 Estructura del Proyecto

```
micuartito/
│
├── index.html          # Página principal (Login + Dashboard)
├── publicar.html       # Página para publicar cuartos
├── styles.css          # Estilos unificados de toda la app
├── app.js             # JavaScript del login y dashboard
├── publicar.js        # JavaScript de la página de publicar
└── logo encabezado.png # Logo de la aplicación
```

## 🚀 Cómo Usar

### 1. Abrir la Aplicación
- Abre `index.html` en tu navegador web
- Se mostrará la pantalla de login

### 2. Iniciar Sesión

**Usuarios de prueba disponibles:**

**Propietario:**
- Usuario: `propietario`
- Contraseña: `propietario123`

**Inquilino:**
- Usuario: `inquilino`
- Contraseña: `inquilino123`

### 3. Dashboard

Después de iniciar sesión, verás diferentes opciones según tu tipo de usuario:

**Panel de Propietario:**
- ✅ **Publicar Cuarto** - Crear nuevas publicaciones (FUNCIONAL)
- 🏠 Mis Cuartos - Ver tus publicaciones (Próximamente)
- 👤 Mi Perfil - Editar información (Próximamente)
- ❓ Ayuda/Reglas - Información (Próximamente)

**Panel de Inquilino:**
- 🔍 Buscar Cuartos - Buscar con filtros (Próximamente)
- ❤️ Mis Favoritos - Cuartos guardados (Próximamente)
- 👤 Mi Perfil - Editar información (Próximamente)

### 4. Publicar un Cuarto (Solo Propietarios)

1. Click en "Publicar Cuarto" desde el dashboard
2. Completa el formulario:
   - **Fotografías**: Agrega hasta 6 fotos
   - **Tipo de habitación**: Privada o Compartida
   - **Capacidad**: Número de personas
   - **Servicios**: WiFi, agua, luz, etc.
   - **Ubicación**: Cerca de universidad, transporte, etc.
   - **Precio**: Precio mensual en Bs.
   - **Reglas**: Describe las reglas de la casa
   - **Disponibilidad**: Inmediata o desde una fecha
3. Click en "Publicar Cuarto"
4. Se guardará y volverás al dashboard

## 🔧 Características Técnicas

### Tecnologías Usadas
- HTML5
- CSS3 (con gradientes y animaciones)
- JavaScript Vanilla (ES6+)
- LocalStorage para persistencia de datos

### Funcionalidades Implementadas
- ✅ Sistema de login con validación
- ✅ Detección automática de tipo de usuario
- ✅ Dashboard personalizado por rol
- ✅ Formulario completo de publicación de cuartos
- ✅ Carga de múltiples imágenes
- ✅ Validación de formularios
- ✅ Persistencia de sesión con localStorage
- ✅ Navegación entre pantallas
- ✅ Diseño responsive (max-width 480px)
- ✅ Animaciones y transiciones suaves

### Almacenamiento de Datos

Los datos se guardan en localStorage del navegador:
- `currentUser`: Usuario actualmente logueado
- `cuartos`: Array de cuartos publicados

## 📱 Diseño Responsive

La aplicación está optimizada para:
- Dispositivos móviles (hasta 480px de ancho)
- Vista tipo "app móvil"
- Navegación inferior fija
- Diseño centrado en pantallas grandes

## 🎨 Paleta de Colores

- Azul principal: `#2563a8`
- Naranja/Coral: `#d9764a`
- Fondo claro: `#f5f5f5`
- Textos: `#333` y `#666`

## 🔒 Seguridad

**Nota**: Esta es una versión demo. En producción deberías:
- Implementar autenticación real con backend
- Cifrar contraseñas
- Usar tokens JWT
- Validar datos en el servidor
- Implementar protección CSRF
- Usar HTTPS

## 📝 Próximas Funcionalidades

- [ ] Búsqueda de cuartos con filtros
- [ ] Sistema de favoritos
- [ ] Perfil de usuario editable
- [ ] Chat entre propietarios e inquilinos
- [ ] Sistema de calificaciones y reseñas
- [ ] Mapa de ubicaciones
- [ ] Notificaciones
- [ ] Pasarela de pagos

## 🐛 Solución de Problemas

### Las imágenes no cargan
- Asegúrate de que el archivo `logo encabezado.png` esté en la misma carpeta

### No se guarda la sesión
- Verifica que tu navegador tenga habilitado localStorage
- No uses modo incógnito

### Los estilos no se aplican
- Verifica que `styles.css` esté en la misma carpeta que los HTML
- Limpia la caché del navegador (Ctrl + F5)

## 👨‍💻 Desarrollo

Para continuar desarrollando:

1. Abre los archivos en Visual Studio Code
2. Instala la extensión "Live Server"
3. Click derecho en `index.html` > "Open with Live Server"
4. Los cambios se reflejarán automáticamente

## 📄 Licencia

Proyecto educativo/demo - Uso libre

---

**Desarrollado con ❤️ para facilitar el alquiler de cuartos**
