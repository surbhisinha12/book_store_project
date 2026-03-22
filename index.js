/* ─── NAVIGATION ─── */
document.getElementById('fb-success').style.display = 'none';
function showPage(id, linkEl) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (linkEl) linkEl.classList.add('active');
  resetMessages();
  closeNav();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleNav() {
  document.getElementById('main-nav').classList.toggle('open');
  document.getElementById('hamburger').classList.toggle('open');
}

function closeNav() {
  document.getElementById('main-nav').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

function resetMessages() {
  ['reg-error','fb-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.style.display = 'none'; el.textContent = ''; }
  });
}

document.querySelectorAll('nav a').forEach(a =>
  a.addEventListener('click', e => e.preventDefault())
);

/* ─── BOOK SEARCH ─── */
const tbody  = document.getElementById('books-tbody');
const rows   = Array.from(tbody.querySelectorAll('tr:not(#no-results-row)'));
const noRow  = document.getElementById('no-results-row');

// Cache plain-text per row (title idx=1, author idx=2, year idx=3)
const rowData = rows.map(tr => {
  const cells = tr.querySelectorAll('td');
  return {
    title:  cells[1] ? cells[1].textContent.trim() : '',
    author: cells[2] ? cells[2].textContent.trim() : '',
    year:   cells[3] ? cells[3].textContent.trim() : '',
  };
});

function searchBooks() {
  const raw      = document.getElementById('book-search').value;
  const query    = raw.trim().toLowerCase();
  const clearBtn = document.getElementById('clear-search');
  const countEl  = document.getElementById('search-count');

  clearBtn.style.display = query ? 'inline-block' : 'none';

  let visible = 0;

  rows.forEach((tr, i) => {
    const d     = rowData[i];
    const hay   = (d.title + ' ' + d.author + ' ' + d.year).toLowerCase();
    const match = !query || hay.includes(query);

    tr.classList.toggle('hidden-row', !match);

    const cells = tr.querySelectorAll('td');
    if (match) {
      visible++;
      if (cells[1]) cells[1].innerHTML = highlight(d.title,  query);
      if (cells[2]) cells[2].innerHTML = highlight(d.author, query);
    } else {
      if (cells[1]) cells[1].textContent = d.title;
      if (cells[2]) cells[2].textContent = d.author;
    }
  });

  if (!query) {
    countEl.innerHTML = '';
    noRow.style.display = 'none';
  } else {
    countEl.innerHTML =
      `Showing <strong>${visible}</strong> of ${rows.length} books for "<strong>${escHtml(raw)}</strong>"`;
    if (visible === 0) {
      noRow.style.display = '';
      document.getElementById('no-results-term').textContent = '"' + raw + '"';
    } else {
      noRow.style.display = 'none';
    }
  }
}

function clearSearch() {
  document.getElementById('book-search').value = '';
  searchBooks();
  document.getElementById('book-search').focus();
}

function highlight(text, query) {
  if (!query) return escHtml(text);
  const re = new RegExp('(' + escRx(query) + ')', 'gi');
  return escHtml(text).replace(re, '<mark>$1</mark>');
}

function escHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function escRx(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
}

/* ─── REGISTRATION VALIDATION ─── */
function validateRegistration() {
  document.getElementById('reg-error').style.display  = 'none';
  document.getElementById('reg-success').style.display = 'none';

  const name      = document.getElementById('reg-name').value.trim();
  const phone     = document.getElementById('reg-phone').value.trim();
  const interests = document.querySelectorAll('input[name="interest"]:checked');

  if (!name)             return showError('reg-error', '⚠ Please enter your full name.');
  if (!interests.length) return showError('reg-error', '⚠ Please select at least one book interest.');
  if (!phone)            return showError('reg-error', '⚠ Please enter your contact number.');
  if (!/^\d{10}$/.test(phone))
    return showError('reg-error', '⚠ Contact number must be exactly 10 digits (numbers only).');

  // ── Show success banner, hide form fields ──
  document.getElementById('reg-welcome-name').textContent = name;
  document.getElementById('reg-success').style.display = 'block';

  // Hide input fields and submit button (keep card for the banner)
  ['fg-name','fg-interest','fg-phone','reg-submit-btn','reg-title','reg-subtitle']
    .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });

  // Pre-fill feedback name
  document.getElementById('fb-name').value = name;
}

function goToFeedbackFromReg() {
  showPage('feedback', document.querySelector('[data-page=feedback]'));
}

function resetRegForm() {
  ['fg-name','fg-interest','fg-phone','reg-submit-btn','reg-title','reg-subtitle']
    .forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
  document.getElementById('reg-success').style.display = 'none';
  document.getElementById('reg-name').value  = '';
  document.getElementById('reg-phone').value = '';
  document.querySelectorAll('input[name="interest"]').forEach(cb => cb.checked = false);
  document.getElementById('reg-error').style.display = 'none';
}

/* ─── FEEDBACK VALIDATION ─── */
function validateFeedback() {
  document.getElementById('fb-error').style.display  = 'none';
  document.getElementById('fb-success').style.display = 'block';

  const name = document.getElementById('fb-name').value.trim();
  const text = document.getElementById('fb-text').value.trim();

  if (!name)         return showError('fb-error', '⚠ Please enter your name before submitting.');
  if (!text)         return showError('fb-error', '⚠ Please write your feedback before submitting.');
  if (text.length<10)return showError('fb-error', '⚠ Feedback is too short — please write at least 10 characters.');

  document.getElementById('fb-success').style.display = 'block';
  document.getElementById('fb-name').value = '';
  document.getElementById('fb-text').value = '';
}

/* ─── HELPER ─── */
function showError(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg; el.style.display = 'block';
  el.scrollIntoView({ behavior:'smooth', block:'nearest' });
}