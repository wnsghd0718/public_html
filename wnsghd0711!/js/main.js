/**
 * main.js - 테마 토글, 동적 렌더링, 스크롤 애니메이션, 클립보드 복사
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderProjects();
  initNavigation();
  initEmailCopy();
  initVideoControls();
});

/* --------------------------------------------------------------------------
   1. Theme Toggle (Dark / Light) with localStorage
   -------------------------------------------------------------------------- */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeIcon) return;
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggleBtn.setAttribute('title', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
  }
}

/* --------------------------------------------------------------------------
   2. Render Scalable Project Cards from projects.js
   -------------------------------------------------------------------------- */
function renderProjects() {
  const container = document.getElementById('additionalProjectsContainer');
  if (!container || typeof projectsData === 'undefined') return;

  // featured가 아닌 프로젝트들 렌더링
  const nonFeatured = projectsData.filter(p => !p.featured);
  if (nonFeatured.length === 0) return;

  container.innerHTML = nonFeatured.map(proj => `
    <div class="project-card">
      <div class="project-card-header">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.35rem;">
          <span class="project-category">${proj.category}</span>
          <span style="font-size: 0.775rem; color: var(--text-muted); font-weight: 500;">${proj.period}</span>
        </div>
        <h4 class="project-title">${proj.title}</h4>
      </div>
      <p class="project-desc">${proj.summary}</p>
      <div>
        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1.25rem;">
          ${(proj.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('')}
        </div>
        <button class="btn btn-secondary" style="width: 100%; font-size: 0.85rem; padding: 0.65rem 1rem;" onclick="openProjectModal('${proj.id}')">
          자세히 보기 →
        </button>
      </div>
    </div>
  `).join('');
}

/* --------------------------------------------------------------------------
   3. Navigation, Mobile Menu & Active Link Highlighting
   -------------------------------------------------------------------------- */
function initNavigation() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks = document.querySelector('.nav-links');
  const navLinkItems = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (hamburgerBtn && navLinks) {
    hamburgerBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '4.5rem';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.background = 'var(--bg-card)';
        navLinks.style.flexDirection = 'column';
        navLinks.style.padding = '1.5rem';
        navLinks.style.borderBottom = '1px solid var(--border-color)';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
      }
    });

    // 메뉴 클릭 시 모바일 메뉴 닫기
    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = 'none';
        }
      });
    });
  }

  // 스크롤 시 활성 섹션 하이라이트
  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinkItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   4. One-click Email Copy with Toast Alert
   -------------------------------------------------------------------------- */
function initEmailCopy() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('userEmail');
  const toast = document.getElementById('toastNotice');

  if (!copyBtn || !emailText) return;

  copyBtn.addEventListener('click', () => {
    const textToCopy = emailText.textContent.trim();
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('이메일 주소가 클립보드에 복사되었습니다! ✨');
    }).catch(() => {
      // 폴백
      showToast('이메일: ' + textToCopy);
    });
  });

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/* --------------------------------------------------------------------------
   5. Video Controls
   -------------------------------------------------------------------------- */
function initVideoControls() {
  const video = document.getElementById('teaserVideo');
  const toggleBtn = document.getElementById('toggleVideoBtn');

  if (!video || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      toggleBtn.textContent = '⏸ 일시정지';
    } else {
      video.pause();
      toggleBtn.textContent = '▶ 재생';
    }
  });

  video.addEventListener('ended', () => {
    toggleBtn.textContent = '🔄 다시보기';
  });
}
