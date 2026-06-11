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
