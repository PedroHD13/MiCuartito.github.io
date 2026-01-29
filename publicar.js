// Variables globales
let photos = [];

// ============================================
// VERIFICAR AUTENTICACIÓN
// ============================================

window.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem('currentUser');
    if (!savedUser) {
        alert('⚠️ Debes iniciar sesión primero');
        window.location.href = 'index.html';
        return;
    }

    const user = JSON.parse(savedUser);
    if (user.type !== 'propietario') {
        alert('⚠️ Solo los propietarios pueden publicar cuartos');
        window.location.href = 'index.html';
        return;
    }

    // Agregar clase al body para estilos específicos
    document.body.classList.add('publish-page');
});

// ============================================
// NAVEGACIÓN
// ============================================

function goBack() {
    if (confirm('¿Seguro que quieres salir? Se perderán los cambios no guardados.')) {
        window.location.href = 'index.html';
    }
}

function goToHome() {
    if (confirm('¿Seguro que quieres salir? Se perderán los cambios no guardados.')) {
        window.location.href = 'index.html';
    }
}

function goToMyRooms() {
    if (confirm('¿Seguro que quieres salir? Se perderán los cambios no guardados.')) {
        alert('Próximamente: Mis Cuartos');
        // window.location.href = 'mis-cuartos.html';
    }
}

function goToProfile() {
    if (confirm('¿Seguro que quieres salir? Se perderán los cambios no guardados.')) {
        alert('Próximamente: Tu perfil');
        // window.location.href = 'perfil.html';
    }
}

// ============================================
// MANEJO DE OPCIONES
// ============================================

function selectOption(element, group) {
    const options = element.parentElement.querySelectorAll('.option-btn');
    options.forEach(opt => opt.classList.remove('selected'));
    element.classList.add('selected');

    // Mostrar/ocultar fecha si es necesario
    if (group === 'disponibilidad') {
        const fechaDiv = document.getElementById('fecha-disponibilidad');
        const radio = element.querySelector('input');
        if (radio.value === 'fecha') {
            fechaDiv.style.display = 'block';
        } else {
            fechaDiv.style.display = 'none';
        }
    }
}

function toggleService(element) {
    element.classList.toggle('selected');
}

// ============================================
// MANEJO DE FOTOS
// ============================================

function handlePhotos(event) {
    const files = Array.from(event.target.files);
    const maxPhotos = 6;

    if (photos.length + files.length > maxPhotos) {
        alert(`Solo puedes subir un máximo de ${maxPhotos} fotos`);
        return;
    }

    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            photos.push(e.target.result);
            renderPhotos();
        };
        reader.readAsDataURL(file);
    });
}

function renderPhotos() {
    const grid = document.getElementById('photo-grid');
    grid.innerHTML = photos.map((photo, index) => `
        <div class="photo-item">
            <img src="${photo}" alt="Foto ${index + 1}">
            <button class="remove-photo" onclick="removePhoto(${index})">×</button>
        </div>
    `).join('');
}

function removePhoto(index) {
    photos.splice(index, 1);
    renderPhotos();
}

// ============================================
// PUBLICAR CUARTO
// ============================================

function publicarCuarto() {
    const form = document.getElementById('publish-form');
    
    // Validar que tenga al menos una foto
    if (photos.length === 0) {
        alert('⚠️ Debes agregar al menos una foto del cuarto');
        return;
    }

    // Validar precio
    const precio = document.getElementById('precio').value;
    if (!precio || precio <= 0) {
        alert('⚠️ Debes ingresar un precio válido');
        return;
    }

    // Validar capacidad
    const capacidad = document.getElementById('capacidad').value;
    if (!capacidad) {
        alert('⚠️ Debes seleccionar la capacidad');
        return;
    }

    // Recopilar datos
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    
    const servicios = Array.from(document.querySelectorAll('input[name="servicios"]:checked'))
        .map(s => s.value);
    
    const cercaDe = Array.from(document.querySelectorAll('input[name="cercaDe"]:checked'))
        .map(s => s.value);
    
    const reglas = document.getElementById('reglas').value;
    const disponibilidad = document.querySelector('input[name="disponibilidad"]:checked').value;
    const fecha = document.getElementById('fecha').value;

    const data = {
        fotos: photos,
        tipo,
        capacidad,
        servicios,
        cercaDe,
        precio,
        reglas,
        disponibilidad: disponibilidad === 'fecha' ? fecha : 'inmediata'
    };

    // Guardar en localStorage (simulación de base de datos)
    let cuartos = JSON.parse(localStorage.getItem('cuartos') || '[]');
    cuartos.push(data);
    localStorage.setItem('cuartos', JSON.stringify(cuartos));

    console.log('Datos del cuarto:', data);
    
    alert('✅ ¡Cuarto publicado exitosamente!\n\n' +
          'Fotos: ' + photos.length + '\n' +
          'Tipo: ' + tipo + '\n' +
          'Capacidad: ' + capacidad + ' persona(s)\n' +
          'Precio: Bs. ' + precio);
    
    // Redirigir al dashboard después de publicar
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}