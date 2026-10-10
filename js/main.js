/**
 * ============================================================================
 * XANICHI LTD — JAVASCRIPT ENGINE
 * Kigali, Rwanda · Founder: Mugisha Elaston Sana
 * Pure Vanilla JavaScript · Zero Dependencies · High Performance
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. ANNOUNCEMENT PILL CONFIGURATION
// Easily edit this single configuration object or set `enabled: false` to hide.
// ----------------------------------------------------------------------------
window.ANNOUNCEMENT_CONFIG = {
  enabled: true,
  tag: "INNOVATE AFRICA 20",
  text: "MY FARM selected for the Innovate Africa 20, pitching Oct 13, Kigali",
  link: "#ventures"
};

// ----------------------------------------------------------------------------
// 2. DOM CONTENT LOADED ENTRYPOINT
// ----------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementPill();
  initThemeToggle();
  initPageIntro();
  initScrollProgress();
  initHeroParticleCanvas();
  initHeroTicker();
  initFloatingCardParallax();
  initScrollReveal();
  initSectionSpy();
  initVentureModals();
  initInteractiveDiagram();
  initContactForm();
  initCursorGlow();
  initBackToTop();
  initMobileNav();
  initAccessCreditDemo();
});

// ----------------------------------------------------------------------------
// 3. ANNOUNCEMENT PILL INITIALIZER
// ----------------------------------------------------------------------------
function initAnnouncementPill() {
  const container = document.getElementById('announcement-banner-container');
  if (!container) return;

  const config = window.ANNOUNCEMENT_CONFIG;
  if (!config || !config.enabled) {
    container.style.display = 'none';
    return;
  }

  container.innerHTML = `
    <a href="${config.link || '#ventures'}" class="announcement-pill" aria-label="${config.text}">
      <span class="announcement-dot" aria-hidden="true"></span>
      <span class="announcement-tag">${config.tag}</span>
      <span class="announcement-text">${config.text}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m9 18 6-6-6-6"/>
      </svg>
    </a>
  `;
}

// ----------------------------------------------------------------------------
// 4. THEME TOGGLE (DARK MODE DEFAULT WITH TRY/CATCH STORAGE GUARD)
// ----------------------------------------------------------------------------
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  let savedTheme = null;
  try {
    savedTheme = localStorage.getItem('xanichi-theme');
  } catch (err) {
    console.warn('Storage access restricted; falling back to default theme.', err);
  }

  // Dark is default
  const activeTheme = savedTheme || 'dark';
  applyTheme(activeTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);

      try {
        localStorage.setItem('xanichi-theme', next);
      } catch (err) {
        // Silent catch for sandboxed environments
      }
    });
  }
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  const iconSun = document.getElementById('theme-icon-sun');
  const iconMoon = document.getElementById('theme-icon-moon');
  if (iconSun && iconMoon) {
    if (theme === 'light') {
      iconSun.style.display = 'none';
      iconMoon.style.display = 'block';
    } else {
      iconSun.style.display = 'block';
      iconMoon.style.display = 'none';
    }
  }
}

// ----------------------------------------------------------------------------
// 5. PAGE LOAD INTRO (FAST & SKIPPABLE < 1.2S)
// ----------------------------------------------------------------------------
function initPageIntro() {
  const overlay = document.getElementById('page-intro-overlay');
  if (!overlay) return;

  function dismissIntro() {
    if (!overlay.classList.contains('dismissed')) {
      overlay.classList.add('dismissed');
      setTimeout(() => {
        overlay.remove();
      }, 700);
    }
  }

  // Auto-dismiss after 1000ms
  const timer = setTimeout(dismissIntro, 1000);

  // Click or keypress skips immediately
  overlay.addEventListener('click', () => {
    clearTimeout(timer);
    dismissIntro();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
      clearTimeout(timer);
      dismissIntro();
    }
  }, { once: true });
}

// ----------------------------------------------------------------------------
// 6. SCROLL PROGRESS BAR
// ----------------------------------------------------------------------------
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

// ----------------------------------------------------------------------------
// 7. HERO 4D FLOATING BACKGROUND ENGINE (TESSERACT & HYPERSPACE MESH)
// Real 4D-to-3D-to-2D stereographic projection with continuous temporal rotation
// ----------------------------------------------------------------------------
function initHeroParticleCanvas() {
  const canvas = document.getElementById('hero-particle-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }

  let width, height;
  let animationId = null;
  let isVisible = true;

  // 4D Rotation Angles
  let angleXW = 0;
  let angleZW = 0;
  let angleXY = 0;
  let angleYZ = 0;

  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animationId) {
      render();
    } else if (!isVisible && animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  }, { threshold: 0.05 });
  observer.observe(canvas);

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth;
    height = canvas.parentElement.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Generate 16 vertices of a 4D Hypercube (Tesseract): (+-1, +-1, +-1, +-1)
  const tesseractVertices = [];
  for (let i = 0; i < 16; i++) {
    tesseractVertices.push([
      (i & 1 ? 1 : -1) * 1.15,
      (i & 2 ? 1 : -1) * 1.15,
      (i & 4 ? 1 : -1) * 1.15,
      (i & 8 ? 1 : -1) * 1.15
    ]);
  }

  // 32 Edges connecting vertices that differ by only 1 bit
  const tesseractEdges = [];
  for (let i = 0; i < 16; i++) {
    for (let j = i + 1; j < 16; j++) {
      const diff = i ^ j;
      if (diff === 1 || diff === 2 || diff === 4 || diff === 8) {
        tesseractEdges.push([i, j]);
      }
    }
  }

  // 18 Floating 4D satellite nodes drifting through hyperspace
  const satelliteNodes = [];
  for (let k = 0; k < 18; k++) {
    const radius = 1.6 + Math.random() * 0.8;
    satelliteNodes.push({
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI * 2,
      psi: Math.random() * Math.PI * 2,
      radius: radius,
      speedTheta: (Math.random() - 0.5) * 0.008,
      speedPhi: (Math.random() - 0.5) * 0.006,
      speedPsi: (Math.random() - 0.5) * 0.007,
      size: Math.random() * 2.5 + 1.5,
      isEmerald: k % 2 === 0
    });
  }

  function rotate4D(pt, aXW, aZW, aXY, aYZ) {
    let [x, y, z, w] = pt;

    // Rotation in XW plane
    let cos = Math.cos(aXW), sin = Math.sin(aXW);
    let x1 = x * cos - w * sin;
    let w1 = x * sin + w * cos;

    // Rotation in ZW plane
    cos = Math.cos(aZW); sin = Math.sin(aZW);
    let z1 = z * cos - w1 * sin;
    let w2 = z * sin + w1 * cos;

    // Rotation in XY plane (driven by mouse X)
    cos = Math.cos(aXY); sin = Math.sin(aXY);
    let x2 = x1 * cos - y * sin;
    let y1 = x1 * sin + y * cos;

    // Rotation in YZ plane (driven by mouse Y)
    cos = Math.cos(aYZ); sin = Math.sin(aYZ);
    let y2 = y1 * cos - z1 * sin;
    let z2 = y1 * sin + z1 * cos;

    return [x2, y2, z2, w2];
  }

  function project4DToScreen(pt4D) {
    const [x, y, z, w] = pt4D;
    // 4D to 3D perspective projection
    const distance4D = 3.0;
    const scale4D = 1 / (distance4D - w);
    const x3D = x * scale4D;
    const y3D = y * scale4D;
    const z3D = z * scale4D;

    // 3D to 2D screen projection
    const distance3D = 3.2;
    const scale3D = 1 / (distance3D - z3D);

    const baseRadius = Math.min(width, height) * 0.44;
    const screenX = width / 2 + x3D * scale3D * baseRadius;
    const screenY = height / 2 + y3D * scale3D * baseRadius;

    return {
      x: screenX,
      y: screenY,
      z: z3D,
      w: w,
      depthAlpha: Math.max(0.12, Math.min(1, (z3D + 1.2) / 2.2))
    };
  }

  function render() {
    if (!isVisible) return;
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Continuous 4th-dimensional time evolution + gentle mouse influence
    angleXW += 0.006;
    angleZW += 0.004;
    angleXY = mouseX * 0.45;
    angleYZ = mouseY * 0.35;

    // 1. Project 16 tesseract vertices
    const projectedVertices = tesseractVertices.map(v => {
      const rotated = rotate4D(v, angleXW, angleZW, angleXY, angleYZ);
      return project4DToScreen(rotated);
    });

    // 2. Draw 4D tesseract edges
    for (let e = 0; e < tesseractEdges.length; e++) {
      const [i, j] = tesseractEdges[e];
      const p1 = projectedVertices[i];
      const p2 = projectedVertices[j];

      const avgAlpha = (p1.depthAlpha + p2.depthAlpha) * 0.5;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);

      // Color shifts based on 4D hyperplane orientation
      if (i < 8 && j < 8) {
        ctx.strokeStyle = `rgba(52, 211, 153, ${avgAlpha * 0.35})`; // Inner emerald frame
        ctx.lineWidth = 1.2;
      } else if (i >= 8 && j >= 8) {
        ctx.strokeStyle = `rgba(34, 211, 238, ${avgAlpha * 0.4})`; // Outer cyan frame
        ctx.lineWidth = 1.4;
      } else {
        ctx.strokeStyle = `rgba(56, 189, 248, ${avgAlpha * 0.25})`; // Cross-dimensional struts
        ctx.lineWidth = 0.9;
      }
      ctx.stroke();
    }

    // 3. Draw tesseract vertex nodes
    for (let v = 0; v < projectedVertices.length; v++) {
      const p = projectedVertices[v];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5 * p.depthAlpha + 1, 0, Math.PI * 2);
      ctx.fillStyle = v % 2 === 0
        ? `rgba(52, 211, 153, ${p.depthAlpha * 0.85})`
        : `rgba(34, 211, 238, ${p.depthAlpha * 0.85})`;
      ctx.fill();
    }

    // 4. Update & draw 4D satellite nodes drifting around the hyper-lattice
    for (let s = 0; s < satelliteNodes.length; s++) {
      const sat = satelliteNodes[s];
      sat.theta += sat.speedTheta;
      sat.phi += sat.speedPhi;
      sat.psi += sat.speedPsi;

      // 4-sphere coordinates
      const x4 = sat.radius * Math.cos(sat.theta) * Math.cos(sat.phi);
      const y4 = sat.radius * Math.sin(sat.theta) * Math.cos(sat.phi);
      const z4 = sat.radius * Math.sin(sat.phi) * Math.cos(sat.psi);
      const w4 = sat.radius * Math.sin(sat.phi) * Math.sin(sat.psi);

      const rotated = rotate4D([x4, y4, z4, w4], angleXW, angleZW, angleXY, angleYZ);
      const screenPt = project4DToScreen(rotated);

      // Draw satellite glow
      ctx.beginPath();
      ctx.arc(screenPt.x, screenPt.y, sat.size * screenPt.depthAlpha + 1.5, 0, Math.PI * 2);
      ctx.fillStyle = sat.isEmerald
        ? `rgba(52, 211, 153, ${screenPt.depthAlpha * 0.6})`
        : `rgba(34, 211, 238, ${screenPt.depthAlpha * 0.6})`;
      ctx.fill();

      // Subtle light halo around nearest satellites
      if (screenPt.depthAlpha > 0.65) {
        ctx.beginPath();
        ctx.arc(screenPt.x, screenPt.y, sat.size * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = sat.isEmerald
          ? `rgba(52, 211, 153, 0.08)`
          : `rgba(34, 211, 238, 0.08)`;
        ctx.fill();
      }
    }

    animationId = requestAnimationFrame(render);
  }

  render();
}

// ----------------------------------------------------------------------------
// 8. LIVE-FEEL ROTATING MISSION TICKER
// ----------------------------------------------------------------------------
function initHeroTicker() {
  const tickerEl = document.getElementById('ticker-rotating-text');
  if (!tickerEl) return;

  const statements = [
    "Unifying solar edge-AI meshes with clinical early warning in Kigali & East Africa.",
    "Biodegradable growing media & IoT soil AI for Kigali peri-urban growers.",
    "Continuous vital-sign monitoring to prevent sepsis and maternal decompensation.",
    "From reactive response to predictive prevention across Africa."
  ];

  let currentIndex = 0;

  setInterval(() => {
    tickerEl.style.opacity = '0';
    tickerEl.style.transform = 'translateY(4px)';
    tickerEl.style.transition = 'opacity 0.25s ease, transform 0.25s ease';

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % statements.length;
      tickerEl.textContent = statements[currentIndex];
      tickerEl.style.opacity = '1';
      tickerEl.style.transform = 'translateY(0)';
    }, 250);
  }, 4200);
}

// ----------------------------------------------------------------------------
// 9. FLOATING CARDS PARALLAX (MOUSE & SCROLL)
// Disabled on touch devices and respects reduced motion.
// ----------------------------------------------------------------------------
function initFloatingCardParallax() {
  const cards = document.querySelectorAll('.floating-card');
  if (!cards.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.innerWidth < 900) return; // Disabled on mobile/tablet per prompt

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    // Normalized coordinates from -1 to 1
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function updateParallax() {
    // Smooth lerp
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    cards.forEach((card, idx) => {
      const depth = (idx % 3 + 1) * 7;
      const offsetX = targetX * depth;
      const offsetY = targetY * depth;
      card.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0)`;
    });

    requestAnimationFrame(updateParallax);
  }

  requestAnimationFrame(updateParallax);
}

// ----------------------------------------------------------------------------
// 10. SCROLL REVEAL (IntersectionObserver)
// ----------------------------------------------------------------------------
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// ----------------------------------------------------------------------------
// 11. SECTION SPY & NAV LINK HIGHLIGHTING
// ----------------------------------------------------------------------------
function initSectionSpy() {
  const navLinks = document.querySelectorAll('.site-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');
  if (!navLinks.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-72px 0px -50% 0px'
  });

  sections.forEach(section => observer.observe(section));
}

// ----------------------------------------------------------------------------
// 12. VENTURE MODALS (LEARN MORE DEEP-DIVE PANELS)
// ----------------------------------------------------------------------------
function initVentureModals() {
  const modalBackdrop = document.getElementById('venture-modal-backdrop');
  const modalTitle = document.getElementById('modal-venture-title');
  const modalStage = document.getElementById('modal-venture-stage');
  const modalContent = document.getElementById('modal-venture-content');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  if (!modalBackdrop || !modalCloseBtn) return;

  const ventureData = {
    sana: {
      title: "SANA",
      stage: "Early Concept · In Prototyping",
      html: `
        <p class="section-description" style="margin-bottom: 1.25rem;">
          <strong>Solar Edge-AI Sensor Mesh with Clinician-in-the-Loop Decision Support</strong>
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.65;">
          <p>
            In tropical agricultural valleys and peri-urban hills around Kigali, micro-climates dictate both crop yields and epidemic vectors. SANA deploys rugged, solar-powered edge sensor nodes directly into rural farm perimeters and village health posts.
          </p>
          <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem;">Core Architecture:</strong>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.875rem;">
              <li><span style="color: var(--color-accent-emerald); font-weight: bold;">•</span> Ultra-low-power edge MCU running on-device environmental anomaly detection.</li>
              <li><span style="color: var(--color-accent-emerald); font-weight: bold;">•</span> Subsurface soil probes paired with ambient humidity, rainfall rate & thermal sensors.</li>
              <li><span style="color: var(--color-accent-emerald); font-weight: bold;">•</span> Mesh telemetry network requiring zero cellular infrastructure between field nodes.</li>
              <li><span style="color: var(--color-accent-cyan); font-weight: bold;">•</span> Clinician early-warning dashboard alerting community health workers up to 14 days prior to expected vector surges.</li>
            </ul>
          </div>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">
            Current Status: Schematic architecture finalized. Sensor mesh component selection underway. Field trials planned in partnership with Kigali agronomy networks.
          </p>
        </div>
      `
    },
    myfarm: {
      title: "MY FARM",
      stage: "In Development · Selected for Innovate Africa 20",
      html: `
        <p class="section-description" style="margin-bottom: 1.25rem;">
          <strong>Crop-Specific Growing Media in Biodegradable Bags + IoT/AI Soil Companion</strong>
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.65;">
          <p>
            Rapid urbanisation across Kigali puts intense pressure on peri-urban land. MY FARM provides modular biodegradable growing bags pre-blended with enriched, crop-specific organic growing media, linked to an accessible smartphone and USSD/IoT advisory service.
          </p>
          <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem;">The Three-Phase Workflow:</strong>
            <ol style="padding-left: 1.2rem; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.875rem;">
              <li><strong>Analyze:</strong> Simple sensor probe reads soil moisture, EC, and pH.</li>
              <li><strong>Formulate:</strong> The lightweight AI algorithm suggests customized soil compost balances for specific crops.</li>
              <li><strong>Cultivate:</strong> Recommends optimal planting windows for smallholder and youth growers with minimal land footprint.</li>
            </ol>
          </div>
          <div style="padding: 0.85rem 1rem; background: rgba(52, 211, 153, 0.08); border-radius: var(--radius-sm); border: 1px solid rgba(52, 211, 153, 0.3);">
            <strong style="color: var(--color-accent-emerald);">Milestone Update:</strong> Selected for Innovate Africa 20. Pitching live in Kigali on October 13.
          </div>
        </div>
      `
    },
    lifesuit: {
      title: "MY HEALTH / LIFE SUIT",
      stage: "Early Concept · Research & Prototyping",
      html: `
        <p class="section-description" style="margin-bottom: 1.25rem;">
          <strong>AI-Powered Wearable Continuous Vital-Sign Monitoring Platform</strong>
        </p>
        <div style="display: flex; flex-direction: column; gap: 1rem; font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.65;">
          <p>
            Inspired by founder Sana's family experience and clinical nursing training, the LIFE SUIT platform bridges the critical telemetry gap between primary health posts and district hospitals in Rwanda.
          </p>
          <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
            <strong style="color: var(--text-primary); display: block; margin-bottom: 0.5rem;">Clinical Focus Areas:</strong>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 0.4rem; font-size: 0.875rem;">
              <li><span style="color: var(--color-accent-cyan); font-weight: bold;">•</span> Continuous optical PPG monitoring (heart rate variability, SpO2, pulse transit time).</li>
              <li><span style="color: var(--color-accent-cyan); font-weight: bold;">•</span> Core body temperature tracking for early febrile infection and sepsis detection.</li>
              <li><span style="color: var(--color-accent-cyan); font-weight: bold;">•</span> Low-complexity edge anomaly scoring to flag maternal and post-operative deterioration before crisis.</li>
            </ul>
          </div>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">
            Current Status: Biometric sensor benchmarking and ergonomics concept phase. Grounded in clinical literature from the Harvard Health Systems Innovation Lab Hackathon.
          </p>
        </div>
      `
    },
    accesscredit: {
      title: "ACCESS CREDIT — THE CREDIT PASSPORT FOR UNDERSERVED BUSINESSES",
      stage: "Proposed Platform · Financial Technology",
      html: `
        <div style="margin-bottom: 1.25rem;">
          <p style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 700; color: var(--color-accent-emerald); margin-bottom: 0.5rem;">
            “Your business has a story. Make it visible to finance.”
          </p>
          <p class="section-description" style="font-size: 0.95rem;">
            Access Credit is a proposed platform that helps underserved entrepreneurs and farmers organize their financial records, understand their financing readiness, and explore suitable funding opportunities.
          </p>
        </div>
        <div style="display: flex; flex-direction: column; gap: 1.15rem; font-size: 0.9375rem; color: var(--text-secondary); line-height: 1.65;">
          <p>
            Instead of focusing only on conventional loan applications or opaque credit scores, the platform helps users build a structured financial profile, understand their credit readiness, identify gaps in their documentation, and explore suitable financing opportunities with transparent guidance.
          </p>
          <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); display: flex; flex-direction: column; gap: 0.75rem;">
            <div>
              <strong style="color: var(--color-accent-cyan); display: block; font-size: 0.85rem; font-family: var(--font-mono); letter-spacing: 0.05em; text-transform: uppercase;">Core Differentiator:</strong>
              <span style="color: var(--text-primary); font-size: 0.9rem;">Helping farmers, entrepreneurs, and small businesses organize evidence of their financial activity into a transparent, explainable financing-readiness profile.</span>
            </div>
            <div style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <strong style="color: var(--color-accent-emerald); display: block; font-size: 0.85rem; font-family: var(--font-mono); letter-spacing: 0.05em; text-transform: uppercase;">Mission &amp; Vision:</strong>
              <span style="color: var(--text-primary); font-size: 0.9rem;">Make the journey to responsible financing clearer, more transparent, and more inclusive—where viable enterprises can better demonstrate their financial potential.</span>
            </div>
          </div>
          <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; margin-top: 0.5rem;">
            <a href="#access-credit" class="btn-primary" onclick="document.getElementById('venture-modal-backdrop').classList.remove('open'); document.body.style.overflow='';" style="font-size:0.85rem; padding:0.6rem 1.2rem;">
              Open Full Credit Passport Experience
            </a>
          </div>
          <p style="font-size: 0.8125rem; color: var(--text-muted);">
            Synergy with Xanichi Ecosystem: Integrates agricultural output records from MY FARM and verified community operational data to help smallholders and youth entrepreneurs build verified financial readiness profiles.
          </p>
        </div>
      `
    }
  };

  document.querySelectorAll('[data-venture-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const key = trigger.getAttribute('data-venture-modal');
      const data = ventureData[key];
      if (!data) return;

      modalTitle.textContent = data.title;
      modalStage.textContent = data.stage;
      modalContent.innerHTML = data.html;

      modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
      modalCloseBtn.focus();
    });
  });

  function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });
}

// ----------------------------------------------------------------------------
// 13. INTERACTIVE SVG CONNECTION DIAGRAM
// ----------------------------------------------------------------------------
function initInteractiveDiagram() {
  const nodes = document.querySelectorAll('.diagram-node');
  const readouts = {
    core: {
      title: "Xanichi Intelligence Bus",
      desc: "Synchronizes data across ventures. Environmental vector risks from SANA trigger early clinic alerts in MY HEALTH, while soil biology insights optimize MY FARM cultivation cycles."
    },
    sana: {
      title: "SANA Mesh Telemetry",
      desc: "Streams hyper-local micro-climate telemetry (temperature, rainfall, soil moisture) to predict pest and disease vectors up to two weeks in advance."
    },
    myfarm: {
      title: "MY FARM Agro-Intelligence",
      desc: "Ingests SANA soil data to dynamically formulate biodegradable growing bag compost blends, optimizing peri-urban harvests."
    },
    lifesuit: {
      title: "MY HEALTH / LIFE SUIT Clinical Stream",
      desc: "Cross-references continuous vital-sign anomaly scores with SANA vector alerts to ensure community clinics are pre-stocked with essential therapies."
    },
    accesscredit: {
      title: "ACCESS CREDIT Financial Readiness Bus",
      desc: "Translates verified operational and harvest track records from MY FARM and local health posts into explainable credit readiness assessments, connecting unbanked growers and entrepreneurs to fair financing."
    }
  };

  const titleEl = document.getElementById('diagram-readout-title');
  const descEl = document.getElementById('diagram-readout-desc');

  if (!nodes.length || !titleEl || !descEl) return;

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      const target = node.getAttribute('data-node-target');
      const data = readouts[target];
      if (!data) return;

      nodes.forEach(n => n.classList.remove('active-node'));
      node.classList.add('active-node');

      titleEl.textContent = data.title;
      descEl.textContent = data.desc;
    });
  });
}

// ----------------------------------------------------------------------------
// 14. CONTACT FORM WITH MAILTO FALLBACK & 1-CLICK EMAIL COPY
// ----------------------------------------------------------------------------
function initContactForm() {
  const form = document.getElementById('contact-form');
  const alertEl = document.getElementById('form-status-alert');
  const copyBtn = document.getElementById('btn-copy-email');
  const founderEmail = "melaston006@gmail.com";

  // 1-Click Copy Email Button
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(founderEmail);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied to clipboard!";
        copyBtn.style.color = "var(--color-accent-emerald)";
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.style.color = "";
        }, 2500);
      } catch (err) {
        // Fallback for clipboard restrictions
        window.location.href = `mailto:${founderEmail}`;
      }
    });
  }

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending inquiry...`;

    const formData = new FormData(form);
    const formValues = Object.fromEntries(formData.entries());

    // Basic validation
    if (!formValues.name || !formValues.email || !formValues.message) {
      showAlert("Please complete all required fields.", "error");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      return;
    }

    // Formspree submission attempt
    const actionUrl = form.getAttribute('action');

    try {
      // Check if action has valid Formspree endpoint or fallback
      if (actionUrl && !actionUrl.includes('TODO_YOUR_FORMSPREE_ID')) {
        const response = await fetch(actionUrl, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showAlert("Thank you! Your message has been received by the Xanichi team.", "success");
          form.reset();
        } else {
          throw new Error('Service returned non-ok response');
        }
      } else {
        // Graceful Mailto Fallback when Formspree ID is still in TODO state
        const mailtoSubject = encodeURIComponent(`[Xanichi Inquiry] ${formValues.interest || 'Partnership'} - ${formValues.name}`);
        const mailtoBody = encodeURIComponent(`Name: ${formValues.name}\nEmail: ${formValues.email}\nTrack: ${formValues.interest}\n\nMessage:\n${formValues.message}`);
        
        window.location.href = `mailto:${founderEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;
        showAlert(`Launching email client to message ${founderEmail}. Thank you!`, "success");
        form.reset();
      }
    } catch (err) {
      console.warn('Form submission fallback:', err);
      // Fallback
      window.location.href = `mailto:${founderEmail}?subject=Xanichi Inquiry from ${formValues.name}&body=${encodeURIComponent(formValues.message)}`;
      showAlert(`Opening your email client to reach ${founderEmail}`, "success");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });

  function showAlert(msg, type) {
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.className = `form-status-alert ${type}`;
    alertEl.style.display = 'block';
  }
}

// ----------------------------------------------------------------------------
// 15. DESKTOP CURSOR GLOW
// ----------------------------------------------------------------------------
function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  if (window.matchMedia('(pointer: coarse)').matches) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.opacity = '1';
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
}

// ----------------------------------------------------------------------------
// 16. BACK TO TOP
// ----------------------------------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById('btn-back-to-top');
  if (!btn) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ----------------------------------------------------------------------------
// 17. MOBILE NAVIGATION DRAWER
// ----------------------------------------------------------------------------
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ----------------------------------------------------------------------------
// 18. ACCESS CREDIT — THE CREDIT PASSPORT INTERACTIVE ENGINE
// Client-side illustrative simulation with safe fictional sample data
// ----------------------------------------------------------------------------
function initAccessCreditDemo() {
  const profileTabs = document.querySelectorAll('[data-ac-profile]');
  const statusTabs = document.querySelectorAll('[data-ac-status]');

  if (!profileTabs.length || !statusTabs.length) return;

  let currentProfile = 'farmer';
  let currentStatus = 'organized';

  const demoData = {
    farmer: {
      initials: "JC",
      name: "Jean-Claude Bizimana",
      sector: "Horticulture & Vegetable Smallholder",
      location: "Gasabo Outskirts, Kigali",
      history: "34 months active continuous cultivation",
      data: {
        organized: {
          turnover: "1,450,000 RWF",
          surplus: "+380,000 RWF",
          transactions: "142 verified sales",
          docs: [
            "6-Month MoMo Merchant trading statements (Digital)",
            "Kigali wholesale market delivery receipts (Signed)",
            "MY FARM organic media purchase records (Verified)",
            "National ID & local cooperative membership card"
          ],
          missing: [
            "Quarterly equipment maintenance logbook",
            "Formal district business activity registration slip"
          ],
          checklist: [
            {
              title: "Trading Consistency (3+ Seasons)",
              status: "ready",
              badge: "Verified",
              why: "Demonstrates cyclical resilience across both rainy and dry seasons in East Africa."
            },
            {
              title: "Cash Flow Traceability",
              status: "ready",
              badge: "High Visibility",
              why: "Digital merchant statements provide empirical proof of revenue inflows and sales frequency."
            },
            {
              title: "Debt Capacity Cushion (> 2.5x Repayment)",
              status: "ready",
              badge: "Documented",
              why: "Average monthly operating surplus exceeds standard seasonal micro-facility installments."
            },
            {
              title: "Formal Registration Documentation",
              status: "progress",
              badge: "In Progress",
              why: "Lenders require standardized identification to open formal commercial micro-credit files."
            }
          ]
        },
        partial: {
          turnover: "780,000 RWF",
          surplus: "+190,000 RWF",
          transactions: "54 recorded sales",
          docs: [
            "Handwritten paper sales ledger (2 seasons)",
            "Occasional mobile-money payment screenshots",
            "Cooperative harvest drop-off slips"
          ],
          missing: [
            "Continuous 90-day digitized transaction statement",
            "Expense receipts for seed, fertilizer, and transport",
            "Separated personal vs business cash accounts"
          ],
          checklist: [
            {
              title: "Trading Consistency (3+ Seasons)",
              status: "ready",
              badge: "Satisfied",
              why: "Continuous harvest history confirmed via cooperative drop-off records."
            },
            {
              title: "Cash Flow Traceability",
              status: "progress",
              badge: "Partial Records",
              why: "Paper notebooks show sales volume, but lack independent third-party timestamps."
            },
            {
              title: "Debt Capacity Cushion (> 2.5x Repayment)",
              status: "progress",
              badge: "Moderate Cushion",
              why: "Documented surplus can service small input advances, but lacks formal expense tracking."
            },
            {
              title: "Input & Supplier Verification",
              status: "action",
              badge: "Needs Action",
              why: "Consolidating input costs helps lenders verify actual farm profitability margins."
            }
          ]
        },
        limited: {
          turnover: "320,000 RWF",
          surplus: "+75,000 RWF",
          transactions: "18 recorded slips",
          docs: [
            "Informal harvest receipt notebook",
            "National ID card"
          ],
          missing: [
            "Consolidated sales ledger for the last 6 months",
            "Digital payment history (MoMo or bank)",
            "Written buyer agreements or cooperative records"
          ],
          checklist: [
            {
              title: "Trading Consistency (3+ Seasons)",
              status: "progress",
              badge: "Needs History",
              why: "Active farming is taking place, but requires 60 additional days of organized logging."
            },
            {
              title: "Cash Flow Traceability",
              status: "action",
              badge: "Cash-Dominant",
              why: "Informal cash payments leave no auditable trail for participating credit institutions."
            },
            {
              title: "Documented Operating Margin",
              status: "action",
              badge: "Unverified",
              why: "Separating farm operating costs from household spending is the essential first step."
            },
            {
              title: "Preparation Action Plan",
              status: "action",
              badge: "Roadmap Active",
              why: "Use the Access Credit 30-Day Starter Template to begin weekly digital sales logging."
            }
          ]
        }
      }
    },
    business: {
      initials: "MU",
      name: "Marie Uwase",
      sector: "Agro-Input & Retail Grocery Shop",
      location: "Kicukiro Commercial Center",
      history: "28 months registered small shop operation",
      data: {
        organized: {
          turnover: "2,850,000 RWF",
          surplus: "+640,000 RWF",
          transactions: "310 merchant payments",
          docs: [
            "Official Merchant Code (PayPack/MoMo) 6-month log",
            "Wholesale distributor inventory invoices",
            "District trade license & RRA TIN certificate",
            "Physical shop tenancy lease agreement"
          ],
          missing: [
            "Consolidated annual stock inventory balance sheet"
          ],
          checklist: [
            {
              title: "Verified Merchant Turn-over",
              status: "ready",
              badge: "Strong History",
              why: "Consistently documented retail velocity demonstrates stable daily consumer foot traffic."
            },
            {
              title: "Regulatory & Tax Compliance",
              status: "ready",
              badge: "Documented",
              why: "Active TIN and district permits allow access to structured formal SME products."
            },
            {
              title: "Operating Working Capital Buffer",
              status: "ready",
              badge: "Healthy Surplus",
              why: "Net monthly trading surplus comfortably services inventory restocking facilities."
            },
            {
              title: "Inventory Auditing Log",
              status: "progress",
              badge: "In Progress",
              why: "Tracking seasonal inventory turnover cycles helps lenders customize facility tenure."
            }
          ]
        },
        partial: {
          turnover: "1,200,000 RWF",
          surplus: "+280,000 RWF",
          transactions: "92 transactions",
          docs: [
            "Recent 60-day mobile money transaction records",
            "Distributor supply receipts (paper)",
            "District trade permit"
          ],
          missing: [
            "Separated merchant vs personal mobile wallet",
            "Inventory restocking receipts for previous quarter"
          ],
          checklist: [
            {
              title: "Trading Presence",
              status: "ready",
              badge: "Established",
              why: "Physical retail location with consistent local customer base established over 12+ months."
            },
            {
              title: "Account Segregation",
              status: "progress",
              badge: "Mixed Accounts",
              why: "Separating personal household transfers from shop sales clarifies net retail margin."
            },
            {
              title: "Supplier Verification",
              status: "progress",
              badge: "Partial Invoices",
              why: "Documenting distributor credit terms demonstrates prompt repayment history."
            },
            {
              title: "Stock Reorder Log",
              status: "action",
              badge: "Needs Action",
              why: "A basic bi-weekly reorder register shows working capital turn-around speed."
            }
          ]
        },
        limited: {
          turnover: "450,000 RWF",
          surplus: "+95,000 RWF",
          transactions: "22 cash notes",
          docs: [
            "Shop notebook counter book",
            "National ID"
          ],
          missing: [
            "Digital transaction logs",
            "Formal district trade permit",
            "Supplier invoices"
          ],
          checklist: [
            {
              title: "Trading Presence",
              status: "progress",
              badge: "Operating",
              why: "Retail stall is active, but sales velocity is not captured in an auditable ledger."
            },
            {
              title: "Payment Digitization",
              status: "action",
              badge: "Needs MoMo Code",
              why: "Activating a dedicated MoMo merchant code will create instant digital trading proof."
            },
            {
              title: "Documentation Organization",
              status: "action",
              badge: "Needs Action",
              why: "Filing wholesale distributor purchase slips provides formal inventory evidence."
            },
            {
              title: "Credit Readiness Roadmap",
              status: "action",
              badge: "Phase 1 Active",
              why: "Follow our 60-day digital onboarding guide to become eligible for initial micro-lines."
            }
          ]
        }
      }
    },
    entrepreneur: {
      initials: "PM",
      name: "Patrick Mugabo",
      sector: "Eco-Packaging & Nursery Seedlings",
      location: "Gisozi Youth Innovation Hub, Kigali",
      history: "16 months emerging enterprise growth",
      data: {
        organized: {
          turnover: "1,980,000 RWF",
          surplus: "+490,000 RWF",
          transactions: "88 business invoices",
          docs: [
            "Business mobile money merchant records",
            "Contract purchase orders from urban nurseries",
            "Equipment asset ownership invoices",
            "National ID & RDB company registration certificate"
          ],
          missing: [
            "Historical tax clearance certificate"
          ],
          checklist: [
            {
              title: "Formal Business Registration (RDB)",
              status: "ready",
              badge: "Registered",
              why: "Establishes institutional legal identity for business borrowing and grant matching."
            },
            {
              title: "Contract Commercial Traction",
              status: "ready",
              badge: "Recurring Clients",
              why: "Signed purchase agreements with local nursery clients prove ongoing market demand."
            },
            {
              title: "Cash Flow Visibility",
              status: "ready",
              badge: "Auditable",
              why: "Bank and merchant transfer statements match billed commercial invoices."
            },
            {
              title: "Working Capital Scaling Plan",
              status: "progress",
              badge: "In Progress",
              why: "Detailed quotation for raw materials (biodegradable fibers) required for facility expansion."
            }
          ]
        },
        partial: {
          turnover: "890,000 RWF",
          surplus: "+210,000 RWF",
          transactions: "35 invoices",
          docs: [
            "Digital invoice copies (PDFs)",
            "RDB incorporation certificate",
            "Personal mobile money logs"
          ],
          missing: [
            "Dedicated enterprise corporate bank / merchant account",
            "Supplier terms agreement"
          ],
          checklist: [
            {
              title: "Legal Formation",
              status: "ready",
              badge: "Verified",
              why: "Incorporation documents on file establishing corporate legal standing."
            },
            {
              title: "Commercial Cash Flow",
              status: "progress",
              badge: "Personal Wallet",
              why: "Commercial income flowing through personal accounts slows verification review."
            },
            {
              title: "Invoice Settlement Verification",
              status: "progress",
              badge: "Pending Receipts",
              why: "Matching delivery acceptance slips with received payments closes the audit loop."
            },
            {
              title: "Asset Ledger",
              status: "action",
              badge: "Needs Action",
              why: "Documenting production machinery value establishes baseline enterprise equity."
            }
          ]
        },
        limited: {
          turnover: "380,000 RWF",
          surplus: "+80,000 RWF",
          transactions: "12 payments",
          docs: [
            "National ID",
            "Prototype design specification portfolio"
          ],
          missing: [
            "Commercial sales history (> 6 months)",
            "Formal RDB registration",
            "Commercial banking log"
          ],
          checklist: [
            {
              title: "Product Viability",
              status: "ready",
              badge: "Prototyped",
              why: "Technical prototype and product concept demonstrated in the field."
            },
            {
              title: "Commercial Trading History",
              status: "action",
              badge: "Early Stage",
              why: "Lenders require at least 90 days of commercial market trading transactions."
            },
            {
              title: "Financial Separation",
              status: "action",
              badge: "Unseparated",
              why: "Establish an independent business account before applying for working facilities."
            },
            {
              title: "Next Preparation Milestone",
              status: "action",
              badge: "Incubation Phase",
              why: "Focus on closing 10 pilot client sales and logging payment vouchers over 60 days."
            }
          ]
        }
      }
    }
  };

  function renderPassport() {
    const profile = demoData[currentProfile];
    const statusData = profile.data[currentStatus];

    // Profile info
    const avatarEl = document.getElementById('ac-avatar');
    const nameEl = document.getElementById('ac-name');
    const sectorEl = document.getElementById('ac-sector');
    const locationEl = document.getElementById('ac-location');
    const historyEl = document.getElementById('ac-history');

    if (avatarEl) avatarEl.textContent = profile.initials;
    if (nameEl) nameEl.textContent = profile.name;
    if (sectorEl) sectorEl.textContent = profile.sector;
    if (locationEl) locationEl.textContent = profile.location;
    if (historyEl) historyEl.textContent = profile.history;

    // Metric counters
    const turnoverEl = document.getElementById('ac-val-turnover');
    const surplusEl = document.getElementById('ac-val-surplus');
    const transEl = document.getElementById('ac-val-trans');

    if (turnoverEl) turnoverEl.textContent = statusData.turnover;
    if (surplusEl) surplusEl.textContent = statusData.surplus;
    if (transEl) transEl.textContent = statusData.transactions;

    // Supporting docs list
    const docsContainer = document.getElementById('ac-docs-list');
    if (docsContainer) {
      docsContainer.innerHTML = statusData.docs.map(doc => `
        <li style="display:flex; align-items:flex-start; gap:0.55rem; font-size:0.8125rem; color:var(--text-secondary);">
          <span style="color:var(--color-accent-emerald); font-weight:bold; flex-shrink:0;">✓</span>
          <span>${doc}</span>
        </li>
      `).join('');
    }

    // Missing information list
    const missingContainer = document.getElementById('ac-missing-list');
    if (missingContainer) {
      missingContainer.innerHTML = statusData.missing.map(item => `
        <li style="display:flex; align-items:flex-start; gap:0.55rem; font-size:0.8125rem; color:#f87171;">
          <span style="flex-shrink:0;">!</span>
          <span>${item}</span>
        </li>
      `).join('');
    }

    // Checklist items
    const checklistContainer = document.getElementById('ac-checklist-container');
    if (checklistContainer) {
      checklistContainer.innerHTML = statusData.checklist.map(item => `
        <div class="ac-check-item">
          <div class="ac-check-status-icon ${item.status}" aria-hidden="true">
            ${item.status === 'ready' ? '✓' : item.status === 'progress' ? '◐' : '○'}
          </div>
          <div class="ac-check-text-wrap">
            <div class="ac-check-title-row">
              <span class="ac-check-title">${item.title}</span>
              <span class="ac-why-tag">${item.badge}</span>
            </div>
            <p class="ac-check-why">
              <strong>Why lenders evaluate this:</strong> ${item.why}
            </p>
          </div>
        </div>
      `).join('');
    }
  }

  // Profile tabs event listeners
  profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      profileTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentProfile = tab.getAttribute('data-ac-profile');
      renderPassport();
    });
  });

  // Status tabs event listeners
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      statusTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStatus = tab.getAttribute('data-ac-status');
      renderPassport();
    });
  });

  // Initial render
  renderPassport();
}
