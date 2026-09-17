/**
 * Serdar Balcı, MD - Interactive Executive Portfolio Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check that CV_DATA is loaded
  if (typeof CV_DATA === 'undefined') {
    console.error('CV_DATA not found. Please ensure cv-data.js is loaded.');
    return;
  }

  initTheme();
  initStatsCounters();
  renderTimeline('all');
  initTimelineFilters();
  renderEducation();
  renderSoftware();
  initPublications();
  initBackToTop();
});

/* ==========================================================================
   Theme Management (Light / Dark Mode)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  setTheme(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    themeToggleBtn.setAttribute('title', `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
  }
}

/* ==========================================================================
   Stats Counter Animation
   ========================================================================== */
function initStatsCounters() {
  const statValues = document.querySelectorAll('.stat-value');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statValues.forEach(el => animateCounter(el));
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  } else {
    statValues.forEach(el => animateCounter(el));
  }
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10) || 0;
  const suffix = el.getAttribute('data-suffix') || '';
  const duration = 1600;
  const start = 0;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(easeProgress * (target - start) + start);
    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================================================
   Timeline Rendering & Filtering
   ========================================================================== */
function initTimelineFilters() {
  const filterBtns = document.querySelectorAll('#timelineFilters .filter-pill');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      renderTimeline(filter);
    });
  });
}

function renderTimeline(filter) {
  const container = document.getElementById('timelineList');
  if (!container) return;

  const expList = CV_DATA.experience || [];
  
  const filtered = expList.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'clinical') {
      return item.role.toLowerCase().includes('pathology') || 
             item.role.toLowerCase().includes('specialist') || 
             item.role.toLowerCase().includes('consultant');
    }
    if (filter === 'academic') {
      return item.role.toLowerCase().includes('professor') || 
             item.role.toLowerCase().includes('head') || 
             item.role.toLowerCase().includes('director');
    }
    if (filter === 'fellowship') {
      return item.role.toLowerCase().includes('scholar') || 
             item.role.toLowerCase().includes('fellow') || 
             item.institution.toLowerCase().includes('emory');
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="text-muted">No appointments found for this filter.</p>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="timeline-item">
      <div class="timeline-card glass-panel">
        <div class="timeline-header">
          <h3 class="timeline-role">${item.role}</h3>
          <span class="timeline-period">${item.period}</span>
        </div>
        <div class="timeline-institution">
          <i class="fa-solid fa-hospital-user"></i> ${item.institution} &middot; ${item.department} (${item.location})
        </div>
        <p class="timeline-desc">${item.description}</p>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Education & Credentials Rendering
   ========================================================================== */
function renderEducation() {
  const container = document.getElementById('educationGrid');
  if (!container) return;

  const eduList = CV_DATA.education || [];
  container.innerHTML = eduList.map(item => `
    <div class="edu-card glass-panel">
      <div class="edu-period"><i class="fa-regular fa-calendar"></i> ${item.period}</div>
      <div class="edu-degree">${item.degree}</div>
      <div class="edu-inst">${item.institution}</div>
      <div class="edu-field text-muted" style="font-size:0.85rem; margin-top:4px;">${item.field}</div>
    </div>
  `).join('');
}

/* ==========================================================================
   Software & Tools Rendering
   ========================================================================== */
function renderSoftware() {
  const container = document.getElementById('softwareGrid');
  if (!container) return;

  const swList = CV_DATA.software || [];
  container.innerHTML = swList.map(item => `
    <div class="software-card glass-panel">
      <div class="sw-top">
        <div class="sw-badge-row">
          <span class="sw-tag">${item.tag}</span>
          <span class="sw-status"><i class="fa-solid fa-circle-check"></i> ${item.badge}</span>
        </div>
        <h3 class="sw-title">${item.name}</h3>
        <p class="sw-desc">${item.description}</p>
      </div>
      <div class="sw-actions">
        ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener" class="btn btn-primary btn-xs"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Live</a>` : ''}
        ${item.repo ? `<a href="${item.repo}" target="_blank" rel="noopener" class="btn btn-outline btn-xs"><i class="fa-brands fa-github"></i> Repository</a>` : ''}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Publications Explorer & Filter
   ========================================================================== */
let activeTopic = 'all';
let searchQuery = '';
let highlightsOnly = false;

function initPublications() {
  updateCategoryCounts();

  const searchInput = document.getElementById('pubSearchInput');
  const clearBtn = document.getElementById('clearSearchBtn');
  const chips = document.querySelectorAll('#pubCategoryChips .chip');
  const highlightBtn = document.getElementById('toggleHighlightsOnlyBtn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
      renderPublications();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        renderPublications();
      }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeTopic = chip.getAttribute('data-topic');
      renderPublications();
    });
  });

  if (highlightBtn) {
    highlightBtn.addEventListener('click', () => {
      highlightsOnly = !highlightsOnly;
      highlightBtn.classList.toggle('active', highlightsOnly);
      highlightBtn.innerHTML = highlightsOnly 
        ? '<i class="fa-solid fa-star text-warning"></i> Showing High-Impact' 
        : '<i class="fa-solid fa-star"></i> High-Impact Only';
      renderPublications();
    });
  }

  renderPublications();
}

function updateCategoryCounts() {
  const pubs = CV_DATA.publications || [];
  
  const countAll = document.getElementById('countAll');
  const countPancreas = document.getElementById('countPancreas');
  const countDigital = document.getElementById('countDigital');
  const countGI = document.getElementById('countGI');
  const countQuality = document.getElementById('countQuality');
  const countSurg = document.getElementById('countSurg');

  if (countAll) countAll.textContent = pubs.length;
  if (countPancreas) countPancreas.textContent = pubs.filter(p => p.topic === 'Pancreatobiliary').length;
  if (countDigital) countDigital.textContent = pubs.filter(p => p.topic === 'Digital Pathology & AI').length;
  if (countGI) countGI.textContent = pubs.filter(p => p.topic === 'Gastrointestinal').length;
  if (countQuality) countQuality.textContent = pubs.filter(p => p.topic === 'Quality & Methods').length;
  if (countSurg) countSurg.textContent = pubs.filter(p => p.topic === 'Surgical Pathology').length;
}

function renderPublications() {
  const listContainer = document.getElementById('publicationsList');
  const resultCount = document.getElementById('pubResultCount');
  if (!listContainer) return;

  const allPubs = CV_DATA.publications || [];

  const filtered = allPubs.filter(pub => {
    // Topic filter
    if (activeTopic !== 'all' && pub.topic !== activeTopic) {
      return false;
    }
    // High-impact toggle
    if (highlightsOnly && !pub.highlight) {
      return false;
    }
    // Search query filter
    if (searchQuery) {
      const haystack = (
        pub.title + ' ' + 
        pub.authors + ' ' + 
        pub.journal + ' ' + 
        pub.year + ' ' + 
        (pub.doi || '') + ' ' + 
        (pub.pmid || '') + ' ' + 
        pub.topic
      ).toLowerCase();
      if (!haystack.includes(searchQuery)) {
        return false;
      }
    }
    return true;
  });

  if (resultCount) {
    resultCount.textContent = `Showing ${filtered.length} of ${allPubs.length} publications`;
  }

  if (filtered.length === 0) {
    listContainer.innerHTML = `
      <div class="glass-panel" style="padding: 40px; text-align: center;">
        <i class="fa-solid fa-file-circle-xmark" style="font-size:2.5rem; color: var(--text-muted); margin-bottom: 12px;"></i>
        <h3>No matching publications found</h3>
        <p class="text-muted">Try refining your search keyword or clearing the topic filters.</p>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = filtered.map(pub => {
    // Highlight Balci in authors
    const highlightedAuthors = escapeHtml(pub.authors).replace(
      /(Balci S|Balcı S|Balci, S)/g, 
      '<span class="author-highlight">$1</span>'
    );

    return `
      <article class="pub-card glass-panel" id="${pub.id}">
        <div class="pub-meta-row">
          <span class="pub-year-badge">${pub.year}</span>
          <span class="pub-journal-badge"><i class="fa-solid fa-newspaper"></i> ${escapeHtml(pub.journal)}</span>
          <span class="pub-topic-pill">${pub.topic}</span>
          ${pub.highlight ? '<span class="tag-pill tag-accent" style="font-size:0.7rem; padding:2px 8px;"><i class="fa-solid fa-star"></i> Featured</span>' : ''}
        </div>

        <h3 class="pub-title">${escapeHtml(pub.title)}</h3>
        <p class="pub-authors">${highlightedAuthors}</p>

        <div class="pub-actions">
          ${pub.doi ? `
            <a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener" class="pub-link-btn" title="Open Publisher Article">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> DOI: ${pub.doi}
            </a>
          ` : ''}

          ${pub.pmid ? `
            <a href="https://pubmed.ncbi.nlm.nih.gov/${pub.pmid}/" target="_blank" rel="noopener" class="pub-link-btn" title="View on PubMed">
              <i class="fa-solid fa-book-medical"></i> PMID: ${pub.pmid}
            </a>
          ` : ''}

          <button class="copy-citation-btn" data-id="${pub.id}" title="Copy full citation to clipboard">
            <i class="fa-regular fa-copy"></i> Copy Citation
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Attach copy listeners
  document.querySelectorAll('.copy-citation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pubId = btn.getAttribute('data-id');
      const pub = allPubs.find(p => p.id === pubId);
      if (pub) {
        const citation = formatCitation(pub);
        copyToClipboard(citation, btn);
      }
    });
  });
}

function formatCitation(pub) {
  const doiStr = pub.doi ? ` doi: ${pub.doi}.` : '';
  const pmidStr = pub.pmid ? ` PMID: ${pub.pmid}.` : '';
  return `${pub.authors}. ${pub.title}. ${pub.journal}. ${pub.year}.${doiStr}${pmidStr}`;
}

function copyToClipboard(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Citation copied to clipboard!');
    if (btnElement) {
      const originalHTML = btnElement.innerHTML;
      btnElement.innerHTML = '<i class="fa-solid fa-check text-success"></i> Copied!';
      setTimeout(() => {
        btnElement.innerHTML = originalHTML;
      }, 2000);
    }
  }).catch(err => {
    console.error('Clipboard copy failed:', err);
    showToast('Failed to copy citation');
  });
}

function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

function escapeHtml(string) {
  if (!string) return '';
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ==========================================================================
   Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.opacity = '1';
      backToTopBtn.style.pointerEvents = 'auto';
    } else {
      backToTopBtn.style.opacity = '0.7';
    }
  });
}
