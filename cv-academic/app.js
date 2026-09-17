/**
 * Serdar Balcı, MD - Academic Dossier Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CV_DATA === 'undefined') {
    console.error('CV_DATA is missing.');
    return;
  }

  initAcademicTheme();
  initAcademicPublications();
  initCitationModal();
});

/* Theme Management */
function initAcademicTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('theme') || 'light';
  setAcademicTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setAcademicTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function setAcademicTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
}

/* Publications Filter & Search */
let currentCategory = 'all';
let currentSearch = '';

function initAcademicPublications() {
  const searchInput = document.getElementById('scholarSearchInput');
  const tabs = document.querySelectorAll('#categoryTabs .tab-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value.trim().toLowerCase();
      renderAcademicPubs();
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-cat');
      renderAcademicPubs();
    });
  });

  renderAcademicPubs();
}

function renderAcademicPubs() {
  const listEl = document.getElementById('academicPubList');
  const totalBadge = document.getElementById('pubTotalBadge');
  if (!listEl) return;

  const allPubs = CV_DATA.publications || [];

  const filtered = allPubs.filter(pub => {
    if (currentCategory !== 'all' && pub.category !== currentCategory) {
      return false;
    }
    if (currentSearch) {
      const fullText = (pub.title + ' ' + pub.authors + ' ' + pub.journal + ' ' + pub.year + ' ' + (pub.doi || '')).toLowerCase();
      if (!fullText.includes(currentSearch)) {
        return false;
      }
    }
    return true;
  });

  if (totalBadge) {
    totalBadge.textContent = `Showing: ${filtered.length} of ${allPubs.length} Articles`;
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `<li style="list-style:none; padding:20px; text-align:center; color:var(--text-muted);">No publications matching your query.</li>`;
    return;
  }

  listEl.innerHTML = filtered.map(pub => {
    const authorsFormatted = escapeHtml(pub.authors).replace(/(Balci S|Balcı S|Balci, S)/g, '<strong>$1</strong>');
    return `
      <li class="academic-pub-item" id="${pub.id}">
        <div class="pub-item-authors">${authorsFormatted} (${pub.year}).</div>
        <div class="pub-item-title">${escapeHtml(pub.title)}</div>
        <div class="pub-item-journal">
          <em>${escapeHtml(pub.journal)}</em>${pub.doi ? ` &middot; doi:${pub.doi}` : ''}${pub.pmid ? ` &middot; PMID:${pub.pmid}` : ''}
        </div>
        <div class="pub-item-links">
          ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="pub-doi-link"><i class="fa-solid fa-arrow-up-right-from-square"></i> Publisher DOI</a>` : ''}
          ${pub.pmid ? `<a href="https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/" target="_blank" rel="noopener" class="pub-doi-link"><i class="fa-solid fa-book-medical"></i> PubMed</a>` : ''}
          <button class="pub-cite-btn" data-id="${pub.id}"><i class="fa-solid fa-quote-left"></i> Cite</button>
        </div>
      </li>
    `;
  }).join('');

  // Attach Cite Modal buttons
  document.querySelectorAll('.pub-cite-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const pub = allPubs.find(p => p.id === id);
      if (pub) openCitationModal(pub);
    });
  });
}

/* Citation Modal & Formats */
let selectedPub = null;
let selectedFmt = 'apa';

function initCitationModal() {
  const modal = document.getElementById('citationModal');
  const closeBtn = document.getElementById('closeModalBtn');
  const tabs = document.querySelectorAll('.citation-format-tabs .modal-tab');
  const copyBtn = document.getElementById('copyModalCitationBtn');
  const openBibtexBtn = document.getElementById('openBibtexModalBtn');

  if (!modal) return;

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('show');
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedFmt = tab.getAttribute('data-fmt');
      updateModalContent();
    });
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const textarea = document.getElementById('citationText');
      if (textarea) {
        navigator.clipboard.writeText(textarea.value).then(() => {
          showAcademicToast('Citation copied to clipboard!');
          modal.classList.remove('show');
        });
      }
    });
  }

  if (openBibtexBtn) {
    openBibtexBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectedPub = null; // Full BibTeX export
      selectedFmt = 'bibtex';
      tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-fmt') === 'bibtex'));
      updateModalContent();
      modal.classList.add('show');
    });
  }
}

function openCitationModal(pub) {
  selectedPub = pub;
  const modal = document.getElementById('citationModal');
  if (!modal) return;
  updateModalContent();
  modal.classList.add('show');
}

function updateModalContent() {
  const title = document.getElementById('modalTitle');
  const textarea = document.getElementById('citationText');
  if (!textarea) return;

  if (!selectedPub) {
    // Export full bibliography in BibTeX
    if (title) title.textContent = 'Full Bibliography (BibTeX Export)';
    const allPubs = CV_DATA.publications || [];
    textarea.value = allPubs.slice(0, 30).map(p => generateBibtex(p)).join('\n\n');
    return;
  }

  if (title) title.textContent = 'Cite Article';

  if (selectedFmt === 'apa') {
    textarea.value = `${selectedPub.authors} (${selectedPub.year}). ${selectedPub.title}. ${selectedPub.journal}.${selectedPub.doi ? ` https://doi.org/${selectedPub.doi}` : ''}`;
  } else if (selectedFmt === 'ama') {
    textarea.value = `${selectedPub.authors}. ${selectedPub.title}. ${selectedPub.journal}. ${selectedPub.year}.${selectedPub.doi ? ` doi:${selectedPub.doi}` : ''}`;
  } else if (selectedFmt === 'bibtex') {
    textarea.value = generateBibtex(selectedPub);
  }
}

function generateBibtex(p) {
  const citeKey = 'balci' + p.year + (p.doi ? p.doi.replace(/[^a-zA-Z0-9]/g, '').slice(-5) : 'article');
  return `@article{${citeKey},
  author = {${p.authors}},
  title = {${p.title}},
  journal = {${p.journal}},
  year = {${p.year}}${p.doi ? `,\n  doi = {${p.doi}}` : ''}${p.pmid ? `,\n  pmid = {${p.pmid}}` : ''}
}`;
}

function showAcademicToast(msg) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(s) {
  if (!s) return '';
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
