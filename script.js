/* ============================================================
   HARSHVARDHAN K  —  Portfolio Scripts
   Preloader · Cursor · Nav · Typewriter · Reveal ·
   Counter · Magnetic · Smooth-scroll · Photo fallback
   ============================================================ */

'use strict';

/* ── helpers ─────────────────────────────────────────── */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const ease = (t) => 1 - Math.pow(1 - t, 3); // ease-out cubic

/* ══════════════════════════════════════════════════════
   1. PRELOADER
   ══════════════════════════════════════════════════════ */
(function preloader() {
  const loader   = qs('#preloader');
  const MIN_MS   = 1700;          // minimum display time
  const startAt  = Date.now();

  function revealPage() {
    const wait = Math.max(0, MIN_MS - (Date.now() - startAt));
    setTimeout(() => {
      loader.classList.add('gone');
      /* animate hero text in */
      qsa('.ai').forEach(el => el.classList.add('in'));
      /* start typewriter after a beat */
      setTimeout(typewriter, 650);
    }, wait);
  }

  if (document.readyState === 'complete') {
    revealPage();
  } else {
    window.addEventListener('load', revealPage, { once: true });
    /* hard fallback */
    setTimeout(revealPage, 4500);
  }
})();

/* ══════════════════════════════════════════════════════
   2. CUSTOM CURSOR  (desktop / pointer only)
   ══════════════════════════════════════════════════════ */
(function cursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = qs('#cur-dot');
  const ring = qs('#cur-ring');
  if (!dot || !ring) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
  });

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  })();

  /* hover class on interactive elements */
  const targets = 'a, button, .sk-chip, .card, .contact-email, .soc-btn';
  qsa(targets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('ch'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('ch'));
  });
})();

/* ══════════════════════════════════════════════════════
   3. NAVIGATION  (scroll state + mobile menu)
   ══════════════════════════════════════════════════════ */
(function nav() {
  const navEl  = qs('#nav');
  const burger = qs('#burger');
  const mobNav = qs('#mob-nav');
  let open = false;

  /* scroll state */
  window.addEventListener('scroll', () => {
    navEl.classList.toggle('scrolled', window.scrollY > 44);
  }, { passive: true });

  /* toggle mobile menu */
  function setMenu(state) {
    open = state;
    burger.setAttribute('aria-expanded', String(state));
    mobNav.setAttribute('aria-hidden', String(!state));
    mobNav.classList.toggle('open', state);
    burger.setAttribute('aria-label', state ? 'Close navigation menu' : 'Open navigation menu');
    document.body.style.overflow = state ? 'hidden' : '';
  }

  burger.addEventListener('click', () => setMenu(!open));

  qsa('.mob-link').forEach(l => l.addEventListener('click', () => setMenu(false)));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) setMenu(false);
  });
})();

/* ══════════════════════════════════════════════════════
   4. TYPEWRITER  — cycles through role titles
   ══════════════════════════════════════════════════════ */
function typewriter() {
  const el = qs('#role-text');
  if (!el) return;

  const roles   = ['Video Editor', 'Content Creator', 'Reel Maker'];
  let rIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const role = roles[rIdx];
    if (!deleting) {
      cIdx++;
      el.textContent = role.slice(0, cIdx);
      if (cIdx === role.length) {
        deleting = true;
        return setTimeout(tick, 2400);
      }
    } else {
      cIdx--;
      el.textContent = role.slice(0, cIdx);
      if (cIdx === 0) {
        deleting = false;
        rIdx = (rIdx + 1) % roles.length;
        return setTimeout(tick, 420);
      }
    }
    setTimeout(tick, deleting ? 52 : 92);
  }
  tick();
}

/* ══════════════════════════════════════════════════════
   5. SCROLL REVEAL  (IntersectionObserver)
   ══════════════════════════════════════════════════════ */
(function scrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.13, rootMargin: '0px 0px -40px 0px' });

  qsa('.reveal').forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════════════════════════
   6. COUNTER ANIMATION  (for stats)
   ══════════════════════════════════════════════════════ */
(function counters() {
  const cObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      if (el.dataset.done) return;
      el.dataset.done = '1';
      cObs.unobserve(el);

      const target   = parseInt(el.dataset.target, 10);
      const duration = 1900;
      const startT   = performance.now();

      (function update(now) {
        const t      = Math.min((now - startT) / duration, 1);
        el.textContent = Math.round(ease(t) * target);
        if (t < 1) requestAnimationFrame(update);
      })(startT);
    });
  }, { threshold: 0.6 });

  qsa('.stat-n').forEach(el => cObs.observe(el));
})();

/* ══════════════════════════════════════════════════════
   7. MAGNETIC BUTTONS  (subtle attraction on hover)
   ══════════════════════════════════════════════════════ */
(function magnetic() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const targets = '.btn, .soc-btn, .top-link, .nav-brand';
  qsa(targets).forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const r  = el.getBoundingClientRect();
      const dx = (e.clientX - r.left - r.width  / 2) * 0.22;
      const dy = (e.clientY - r.top  - r.height / 2) * 0.22;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });
})();

/* ══════════════════════════════════════════════════════
   7.5 INTERACTIVE 3D CARD TILT (desktop)
   ══════════════════════════════════════════════════════ */
(function cardTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  qsa('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;
      const rotX = ((y - midY) / midY) * -5;
      const rotY = ((x - midX) / midX) * 5;
      card.style.transition = 'transform 0.12s ease-out, border-color .35s, box-shadow .45s';
      card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color .35s, box-shadow .45s';
      card.style.transform = '';
    });
  });
})();

/* ══════════════════════════════════════════════════════
   8. SMOOTH SCROLL  (offset for fixed nav)
   ══════════════════════════════════════════════════════ */
(function smoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = qs(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--nav-h'),
        10
      ) || 68;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════════════════════════
   9. PROFILE PHOTO FALLBACK
      If assets/photo.jpg doesn't load, show initials
   ══════════════════════════════════════════════════════ */
(function photoFallback() {
  const img   = qs('#profile-img');
  const frame = qs('#photo-frame');
  if (!img || !frame) return;

  img.addEventListener('error', () => {
    img.remove();
    frame.classList.add('err');
    const div = document.createElement('div');
    div.className = 'photo-initials';
    div.setAttribute('aria-hidden', 'true');
    div.textContent = 'HV';
    frame.appendChild(div);
  });
})();

/* ══════════════════════════════════════════════════════
   10. ACTIVE NAV HIGHLIGHT  (highlights current section)
   ══════════════════════════════════════════════════════ */
(function activeNav() {
  const sections = qsa('section[id]');
  const links    = qsa('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 100) current = s.id;
    });
    links.forEach(l => {
      const active = l.getAttribute('href') === `#${current}`;
      l.style.color = active ? 'var(--txt)' : '';
    });
  }, { passive: true });
})();
