/**
 * Serdar Balcı, MD - Compact Executive Resume & Print-Ready CV Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CV_DATA === 'undefined') {
    console.error('CV_DATA missing.');
    return;
  }

  initViewModeToggle();
  renderCompactPubs(false);
});

let isExpanded = false;

function initViewModeToggle() {
  const btn = document.getElementById('viewToggleBtn');
  const label = document.getElementById('viewModeLabel');
  const indicator = document.getElementById('pubModeIndicator');

  if (!btn) return;

  // Default to 1-page compact
  document.body.classList.add('mode-1page');

  btn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    document.body.classList.toggle('mode-1page', !isExpanded);
    
    if (label) {
      label.textContent = isExpanded ? 'Show 1-Page Summary' : 'Show Full Dossier';
    }
    if (indicator) {
      indicator.textContent = isExpanded ? '(Showing All Publications)' : '(Showing Key Papers)';
    }

    renderCompactPubs(isExpanded);
  });
}

function renderCompactPubs(fullDossier) {
  const listEl = document.getElementById('compactPubList');
  const titleEl = document.getElementById('pubSectionTitle');
  if (!listEl) return;

  const allPubs = CV_DATA.publications || [];

  if (titleEl) {
    titleEl.textContent = fullDossier 
      ? `Complete Bibliography (${allPubs.length} Publications)` 
      : 'Selected High-Impact Publications';
  }

  // Selected top papers when not expanded
  const toDisplay = fullDossier 
    ? allPubs 
    : allPubs.filter(p => p.highlight || p.year >= 2025).slice(0, 8);

  listEl.innerHTML = toDisplay.map(pub => `
    <li class="compact-pub-item">
      <strong>${escapeHtml(pub.title)}</strong> &middot; 
      <span>${escapeHtml(pub.authors)}</span> &middot; 
      <em>${escapeHtml(pub.journal)}</em> (${pub.year}).
      ${pub.doi ? `<span class="pub-meta-clean"> [doi: ${pub.doi}]</span>` : ''}
    </li>
  `).join('');
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
