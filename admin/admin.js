const { createClient } = supabase;
const db = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

async function requireAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (!session) {
    window.location.href = '/admin';
    return;
  }
  return session;
}

async function signOut() {
  await db.auth.signOut();
  window.location.href = '/admin';
}

function formatCurrency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}

function getDateRange(period, customStart, customEnd) {
  const today = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (period === 'today') {
    const iso = toISO(today);
    return { start: iso, end: iso };
  }
  if (period === 'week') {
    const start = new Date(today);
    const dayOfWeek = today.getDay();
    const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    start.setDate(today.getDate() - offset);
    return { start: toISO(start), end: toISO(today) };
  }
  if (period === 'month') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { start: toISO(start), end: toISO(today) };
  }
  if (period === 'custom') {
    return { start: customStart, end: customEnd };
  }
  // fallback: month
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  return { start: toISO(start), end: toISO(today) };
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function todayISO() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDateBR(isoDate) {
  if (!isoDate) return '';
  const [y, m, d] = isoDate.split('-');
  return `${d}/${m}/${y}`;
}

function showToast(message, type = 'success') {
  let container = document.getElementById('bp-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'bp-toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `bp-toast bp-toast--${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add('show'));
  });
  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hide');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, 3500);
}

function showConfirm(message, confirmLabel = 'Confirmar') {
  return new Promise((resolve) => {
    const overlay = document.createElement('div');
    overlay.className = 'bp-confirm-overlay';
    overlay.innerHTML = `
      <div class="bp-confirm-dialog">
        <p>${message}</p>
        <div class="bp-confirm-actions">
          <button class="btn bp-confirm-btn-cancel">Cancelar</button>
          <button class="bp-confirm-btn-ok">${confirmLabel}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);

    const close = (result) => {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
      resolve(result);
    };

    const onKey = (e) => { if (e.key === 'Escape') close(false); };
    document.addEventListener('keydown', onKey);
    overlay.querySelector('.bp-confirm-btn-cancel').addEventListener('click', () => close(false));
    overlay.querySelector('.bp-confirm-btn-ok').addEventListener('click', () => close(true));
  });
}

function handleDbError(error) {
  if (
    error.status === 401 ||
    error.status === 403 ||
    error.code === 'PGRST301' ||
    error.message?.includes('JWT')
  ) {
    showToast('Sessão expirada. Faça login novamente.', 'info');
    setTimeout(() => { window.location.href = '/admin'; }, 2000);
  } else {
    showToast(error.message || 'Erro desconhecido', 'error');
  }
  return false;
}

function setTableLoading(tbodyId, colspan) {
  const tbody = document.getElementById(tbodyId);
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="${colspan}" class="loading-cell"><span class="bp-spinner"></span></td></tr>`;
}
