/**
 * Serdar Balcı, MD - Computational Pathologist & Open Source Dossier Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  if (typeof CV_DATA === 'undefined') {
    console.error('CV_DATA not found.');
    return;
  }

  initDevTheme();
  renderRepos();
  initCliTabs();
  initDevPublications();
});

/* Theme Management (Defaults to Dark) */
function initDevTheme() {
  const themeBtn = document.getElementById('themeToggleBtn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  setDevTheme(savedTheme);

  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setDevTheme(current === 'dark' ? 'light' : 'dark');
  });
}

function setDevTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
  }
}

/* Render Open Source Repositories */
function renderRepos() {
  const container = document.getElementById('reposGrid');
  if (!container) return;

  const softwareList = CV_DATA.software || [];
  container.innerHTML = softwareList.map(item => `
    <div class="repo-card">
      <div>
        <div class="repo-badge-row">
          <span class="repo-lang">${escapeHtml(item.tag)}</span>
          <span class="repo-status"><i class="fa-solid fa-code-commit"></i> ${escapeHtml(item.badge)}</span>
        </div>
        <h3 class="repo-title">${escapeHtml(item.name)}</h3>
        <p class="repo-desc">${escapeHtml(item.description)}</p>
      </div>
      <div class="repo-actions">
        ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" class="repo-btn repo-btn-primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
        ${item.repo ? `<a href="${item.repo}" target="_blank" rel="noopener" class="repo-btn repo-btn-ghost"><i class="fa-brands fa-github"></i> Source</a>` : ''}
      </div>
    </div>
  `).join('');
}

/* Interactive CLI Tabs */
const CLI_SNIPPETS = {
  'jamovi': `# 1. Open jamovi
# 2. Click the '+' button on the top right (Modules)
# 3. Choose 'jamovi library'
# 4. Search for 'ClinicoPath' or 'jsurvival' or 'meddecide'
# 5. Click 'INSTALL' - Ready to use immediately!`,

  'r-install': `# Install directly via R / RStudio console:
if (!requireNamespace("devtools", quietly = TRUE)) install.packages("devtools")
devtools::install_github("sbalci/ClinicoPathJamoviModule")
devtools::install_github("sbalci/jsurvival")
devtools::install_github("sbalci/meddecide")`,

  'wsi-atlas': `# Patoloji Atlası — Turkey's 1st Open Digital Pathology Atlas
# Web interface: https://www.patolojiatlasi.com/
# Leanpub ebook: https://leanpub.com/patolojiatlasi
# Access 1,000+ deep-zoom Whole Slide Images (WSI) in your browser.`
};

function initCliTabs() {
  const tabs = document.querySelectorAll('.cli-tabs .cli-tab');
  const codeDisplay = document.getElementById('cliCodeDisplay');
  const copyBtn = document.getElementById('copyCliBtn');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const snippetKey = tab.getAttribute('data-tab');
      if (codeDisplay && CLI_SNIPPETS[snippetKey]) {
        codeDisplay.textContent = CLI_SNIPPETS[snippetKey];
      }
    });
  });

  if (copyBtn && codeDisplay) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeDisplay.textContent).then(() => {
        showDevToast('Terminal command copied!');
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
        setTimeout(() => copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy', 2000);
      });
    });
  }
}

/* Publications in Dev View */
function initDevPublications() {
  const searchInput = document.getElementById('devPubSearch');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderDevPubs(searchInput.value.trim().toLowerCase());
    });
  }
  renderDevPubs('');
}

function renderDevPubs(query) {
  const listEl = document.getElementById('devPubList');
  const countEl = document.getElementById('devMatchCount');
  if (!listEl) return;

  const allPubs = CV_DATA.publications || [];

  // Filter for digital pathology, AI, methodology, or search query
  const filtered = allPubs.filter(pub => {
    const text = (pub.title + ' ' + pub.authors + ' ' + pub.journal + ' ' + pub.topic + ' ' + (pub.doi || '')).toLowerCase();
    if (query) {
      return text.includes(query);
    }
    // Default show computational, digital pathology, quality, or recent high-impact
    return pub.topic === 'Digital Pathology & AI' || 
           pub.topic === 'Quality & Methods' || 
           pub.year >= 2024 || 
           pub.highlight;
  });

  if (countEl) {
    countEl.textContent = `[${filtered.length} matching entries]`;
  }

  if (filtered.length === 0) {
    listEl.innerHTML = `<div style="padding:20px; text-align:center; color:var(--text-muted);">No entries matching your query.</div>`;
    return;
  }

  listEl.innerHTML = filtered.map(pub => `
    <div class="dev-pub-card">
      <div class="dev-pub-meta">
        <span>[${pub.year}]</span>
        <span>// ${escapeHtml(pub.journal)}</span>
        <span>#${pub.topic}</span>
      </div>
      <h4 class="dev-pub-title">${escapeHtml(pub.title)}</h4>
      <p class="dev-pub-authors">${escapeHtml(pub.authors)}</p>
      <div class="dev-pub-links">
        ${pub.doi ? `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="dev-pub-link">doi:${pub.doi}</a>` : ''}
        ${pub.pmid ? `<a href="https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/" target="_blank" rel="noopener" class="dev-pub-link">PMID:${pub.pmid}</a>` : ''}
      </div>
    </div>
  `).join('');
}

function showDevToast(msg) {
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
