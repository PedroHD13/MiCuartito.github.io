// ============================================
// ADMIN.JS — Panel de usuarios registrados
// ============================================

let pendingDeleteUser = null;

// Carga usuarios del localStorage (propios del registro)
function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers') || '{}');
}

// ── RENDER TABLE ──────────────────────────────────────────────
function renderTable() {
    const search = document.getElementById('search-input').value.toLowerCase();
    const roleFilter = document.getElementById('filter-role').value;
    const tbody = document.getElementById('users-tbody');
    const emptyState = document.getElementById('empty-state');
    const tableWrap = document.getElementById('table-wrapper');
    const countEl = document.getElementById('users-count');

    const all = Object.values(getRegisteredUsers());
    const filtered = all.filter(u => {
        const matchSearch = !search ||
            u.name.toLowerCase().includes(search) ||
            u.email.toLowerCase().includes(search) ||
            u.username.toLowerCase().includes(search);
        const matchRole = !roleFilter || u.type === roleFilter;
        return matchSearch && matchRole;
    });

    countEl.textContent = `${all.length} usuario${all.length !== 1 ? 's' : ''} registrado${all.length !== 1 ? 's' : ''}`;

    if (all.length === 0) {
        emptyState.style.display = 'block';
        tableWrap.style.display = 'none';
        return;
    }

    emptyState.style.display = 'none';
    tableWrap.style.display = 'block';

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; color:#aaa; padding:30px;">
                    No se encontraron usuarios con esos filtros.
                </td>
            </tr>`;
        return;
    }

    tbody.innerHTML = filtered.map((u, i) => `
        <tr id="row-${u.username}">
            <td class="td-index">${i + 1}</td>
            <td class="td-name">${escHtml(u.name)}</td>
            <td class="td-username">@${escHtml(u.username)}</td>
            <td>${escHtml(u.email)}</td>
            <td>
                <div class="pwd-wrapper">
                    <span class="pwd-text" id="pwd-${escHtml(u.username)}">••••••••</span>
                    <button class="btn-eye" onclick="togglePwd('${escHtml(u.username)}', '${escHtml(u.password)}')" title="Mostrar/ocultar">👁</button>
                </div>
            </td>
            <td>
                <span class="role-badge ${escHtml(u.type)}">
                    ${u.type === 'inquilino' ? '🔍 Inquilino' : '🏠 Propietario'}
                </span>
            </td>
            <td>
                <button class="btn-delete" onclick="confirmDelete('${escHtml(u.username)}')">🗑 Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// ── TOGGLE CONTRASEÑA EN TABLA ────────────────────────────────
function togglePwd(username, realPwd) {
    const span = document.getElementById('pwd-' + username);
    if (!span) return;
    span.textContent = span.textContent === '••••••••' ? realPwd : '••••••••';
}

// ── ELIMINAR USUARIO ──────────────────────────────────────────
function confirmDelete(username) {
    pendingDeleteUser = username;
    document.getElementById('modal-username-text').textContent =
        `Se eliminará al usuario "@${username}". Esta acción no se puede deshacer.`;
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    pendingDeleteUser = null;
    document.getElementById('modal-overlay').style.display = 'none';
}

document.getElementById('btn-confirm-delete').addEventListener('click', () => {
    if (!pendingDeleteUser) return;
    const users = getRegisteredUsers();
    delete users[pendingDeleteUser];
    localStorage.setItem('registeredUsers', JSON.stringify(users));
    closeModal();
    renderTable();
});

// ── DESCARGA TXT ──────────────────────────────────────────────
function downloadUsers() {
    const entries = Object.values(getRegisteredUsers());
    if (entries.length === 0) {
        alert('ℹ️ No hay usuarios registrados aún.');
        return;
    }
    const lines = entries.map(u => `${u.name} - ${u.email} - ${u.password}`);
    const content = lines.join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_registrados.txt';
    a.click();
    URL.revokeObjectURL(url);
}

// ── HELPER ────────────────────────────────────────────────────
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ── INIT ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', renderTable);
