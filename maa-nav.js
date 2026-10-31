// maa-nav.js — Mission Aviation Academy shared navigation
// Usage: <script src="/maa-nav.js"></script> in every page <head>
// Injects full nav with dropdowns + mobile hamburger automatically

(function () {
  const CSS = `
#maa-nav-global {
  position: sticky; top: 0; z-index: 999;
  background: #0D2240; border-bottom: 3px solid #C9A227;
  font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
}
#maa-nav-inner {
  max-width: 1140px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; height: 64px; gap: 8px;
}
.maa-nav-logo {
  color: #C9A227; font-weight: 800; font-size: 15px;
  text-decoration: none; letter-spacing: 0.04em; white-space: nowrap; flex-shrink: 0;
}
.maa-nav-links {
  display: flex !important; align-items: center; gap: 2px !important; flex: 1; justify-content: center;
  position: static !important; background: transparent !important;
  top: auto !important; left: auto !important; right: auto !important;
  flex-direction: row !important; padding: 0 !important;
  box-shadow: none !important; border-top: none !important;
  list-style: none; z-index: auto !important;
}
.maa-nav-item { position: relative; }
.maa-nav-link {
  color: rgba(255,255,255,0.65); font-size: 13px; font-weight: 600;
  padding: 6px 11px; border-radius: 5px; text-decoration: none;
  cursor: pointer; display: flex; align-items: center; gap: 4px;
  background: transparent; border: none; font-family: inherit;
  transition: color 0.15s, background 0.15s; white-space: nowrap;
}
.maa-nav-link:hover, .maa-nav-link.active {
  color: #C9A227; background: rgba(201,162,39,0.08);
}
.maa-nav-arrow {
  font-size: 9px; opacity: 0.6; transition: transform 0.2s;
  display: inline-block;
}
.maa-nav-item.open .maa-nav-arrow { transform: rotate(180deg); }
.maa-nav-dropdown {
  position: absolute; top: calc(100% + 8px); left: 0;
  min-width: 210px; background: #0D2240;
  border: 1px solid rgba(201,162,39,0.2);
  border-radius: 8px; padding: 6px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.5);
  opacity: 0; visibility: hidden; pointer-events: none;
  transform: translateY(-6px); transition: all 0.18s ease;
  z-index: 1000;
}
.maa-nav-item.open .maa-nav-dropdown {
  opacity: 1; visibility: visible; pointer-events: all; transform: translateY(0);
}
.maa-nav-dd-link {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; border-radius: 5px;
  color: rgba(255,255,255,0.75); font-size: 12.5px; font-weight: 500;
  text-decoration: none; transition: background 0.12s, color 0.12s;
  gap: 8px;
}
.maa-nav-dd-link:hover { background: rgba(201,162,39,0.1); color: #C9A227; }
.maa-nav-dd-badge {
  font-size: 9px; font-weight: 700; letter-spacing: 1px;
  padding: 2px 6px; border-radius: 3px; flex-shrink: 0;
}
.maa-nav-dd-sep {
  height: 1px; background: rgba(201,162,39,0.12); margin: 4px 6px;
}
.maa-nav-cta {
  background: #C9A227; color: #0D2240; font-size: 12px; font-weight: 800;
  padding: 9px 16px; border-radius: 6px; text-decoration: none;
  white-space: nowrap; flex-shrink: 0; letter-spacing: 0.03em;
  transition: opacity 0.15s;
}
.maa-nav-cta:hover { opacity: 0.88; }
#maa-hamburger {
  display: none; flex-direction: column; gap: 5px;
  cursor: pointer; padding: 8px; background: none; border: none;
}
#maa-hamburger span {
  display: block; width: 22px; height: 2px;
  background: rgba(255,255,255,0.8); border-radius: 2px;
  transition: all 0.25s;
}
#maa-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
#maa-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
#maa-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
#maa-mobile-menu {
  display: none; background: #0D2240; border-top: 1px solid rgba(201,162,39,0.15);
  padding: 12px 16px 20px;
}
#maa-mobile-menu.open { display: block; }
.maa-mobile-section-label {
  font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #C9A227;
  padding: 12px 8px 4px; text-transform: uppercase;
}
.maa-mobile-link {
  display: block; color: rgba(255,255,255,0.75); font-size: 13.5px; font-weight: 500;
  padding: 9px 8px; border-radius: 5px; text-decoration: none;
  transition: background 0.12s;
}
.maa-mobile-link:hover { background: rgba(201,162,39,0.08); color: #C9A227; }
.maa-mobile-cta {
  display: block; text-align: center; background: #C9A227; color: #0D2240;
  font-weight: 800; font-size: 14px; padding: 13px 20px; border-radius: 7px;
  text-decoration: none; margin-top: 14px;
}
@media (max-width: 820px) {
  .maa-nav-links, .maa-nav-cta { display: none !important; }
  #maa-hamburger { display: flex !important; }
}
`;

  const NAV_DATA = [
    {
      label: 'Programs', items: [
        { href: '/saturday',        label: 'Saturday Open House',      badge: 'Free',    badgeColor: '#1A5C2A' },
        { href: '/programs',        label: 'All Programs' },
        { href: '/scholarships',    label: 'Scholarships & SUFS' },
        { href: '/sufs',             label: 'SUFS Calculator',            badge: '$0', badgeColor: '#16a34a' },
        { sep: true },
        { href: '/discovery-flight',label: 'Book a Discovery Flight' },
        { href: '/ground-school',   label: 'Ground School' },
        { href: '/jrotc',           label: 'JROTC Partnership' },
        { href: '/aerospace',       label: 'Aerospace Engineering',    badge: '2027',    badgeColor: '#555' },
      ]
    },
    {
      label: 'Career', items: [
        { href: '/career',           label: 'Career Platform' },
        { href: '/career-evaluator', label: 'Free Career Evaluator',   badge: 'AI',      badgeColor: '#4B0082' },
        { sep: true },
        { href: '/yab',              label: 'Your Aviation Blueprint' },
        { href: '/ricky',            label: 'Ricky the Explorer' },
        { href: '/books',            label: 'All Books' },
        { sep: true },
        { href: '/join',             label: 'Join Our Team',              badge: 'Hiring', badgeColor: '#8B0000' },
        { href: '/join#ambassador',     label: 'Become an Ambassador' },
        { sep: true },
        { href: '/tuskegee',         label: 'Tuskegee Airmen Legacy' },
      ]
    },
    {
      label: 'Partners', items: [
        { href: '/partners',         label: 'Partners & Bulk Orders' },
        { href: '/enroll',           label: 'Enroll / Co-Op Partner' },
        { href: '/tpa-connect',      label: 'TPA Career Connection' },
        { sep: true },
        { href: '/support',          label: 'Donate / Support',         badge: 'Give',   badgeColor: '#1A5C2A' },
      ]
    },
    {
      label: 'Media', items: [
        { href: '/press',            label: 'Press & Media' },
        { href: '/community',        label: 'Community & Events' },
        { href: '/stories',          label: 'Student Stories' },
        { href: '/tour',             label: 'Tour Schedule' },
      ]
    },
    { label: 'About', href: '/about' },
  ];

  // Detect current page for active state
  function isActive(href) {
    if (!href) return false;
    const path = window.location.pathname;
    return path === href || (href !== '/' && path.startsWith(href));
  }

  function buildDesktopNav() {
    return NAV_DATA.map(item => {
      if (item.href) {
        return `<a class="maa-nav-link${isActive(item.href) ? ' active' : ''}" href="${item.href}">${item.label}</a>`;
      }
      const active = item.items.some(i => i.href && isActive(i.href));
      const ddLinks = item.items.map(i => {
        if (i.sep) return '<div class="maa-nav-dd-sep"></div>';
        const badge = i.badge ? `<span class="maa-nav-dd-badge" style="background:${i.badgeColor||'#333'};color:#fff">${i.badge}</span>` : '';
        return `<a class="maa-nav-dd-link" href="${i.href}">${i.label}${badge}</a>`;
      }).join('');
      return `<div class="maa-nav-item${active ? ' open' : ''}" data-dropdown>
        <button class="maa-nav-link${active ? ' active' : ''}">${item.label}<span class="maa-nav-arrow">▾</span></button>
        <div class="maa-nav-dropdown">${ddLinks}</div>
      </div>`;
    }).join('');
  }

  function buildMobileNav() {
    return NAV_DATA.map(item => {
      if (item.href) {
        return `<a class="maa-mobile-link" href="${item.href}">${item.label}</a>`;
      }
      const links = item.items.filter(i => !i.sep).map(i =>
        `<a class="maa-mobile-link" href="${i.href}" style="padding-left:20px">${i.label}</a>`
      ).join('');
      return `<div class="maa-mobile-section-label">${item.label}</div>${links}`;
    }).join('');
  }

  function inject() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    // Remove any existing site nav so we don't duplicate
    const existingNav = document.querySelector('nav.site-nav, nav#maa-nav-global, nav[class*="site-nav"]');
    if (existingNav) existingNav.remove();

    // Build nav HTML
    const nav = document.createElement('div');
    nav.id = 'maa-nav-global';
    nav.innerHTML = `
      <div id="maa-nav-inner">
        <a class="maa-nav-logo" href="/">Mission Aviation Academy</a>
        <nav class="maa-nav-links" aria-label="Main navigation">${buildDesktopNav()}</nav>
        <a class="maa-nav-cta" href="/saturday#rsvp">Start Your Flight Path</a>
        <button id="maa-hamburger" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div id="maa-mobile-menu" aria-hidden="true">
        ${buildMobileNav()}
        <a class="maa-mobile-cta" href="/saturday#rsvp">Start Your Flight Path</a>
      </div>
    `;

    // Insert at top of body
    document.body.insertBefore(nav, document.body.firstChild);

    function iframes() { return document.querySelectorAll('iframe'); }

    function closeDropdowns() {
      nav.querySelectorAll('[data-dropdown]').forEach(d => {
        d.classList.remove('open');
        const btn = d.querySelector('button');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      // Restore iframe pointer-events
      iframes().forEach(f => { f.style.pointerEvents = ''; });
    }

    // Dropdown toggle
    nav.querySelectorAll('[data-dropdown]').forEach(item => {
      const btn = item.querySelector('button');
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = item.classList.contains('open');
        closeDropdowns();
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
          // Disable iframe pointer-events so outside clicks propagate to document
          iframes().forEach(f => { f.style.pointerEvents = 'none'; });
        }
      });
    });

    // Close dropdowns immediately when a dropdown link is clicked (before navigation)
    nav.querySelectorAll('.maa-nav-dropdown').forEach(dd => {
      dd.addEventListener('click', (e) => {
        if (e.target.closest('a')) closeDropdowns();
      });
    });

    // Close dropdowns on outside click (iframes are click-through when dropdown is open)
    document.addEventListener('click', closeDropdowns);

    // Mobile hamburger
    const burger = nav.querySelector('#maa-hamburger');
    const mobileMenu = nav.querySelector('#maa-mobile-menu');
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      mobileMenu.setAttribute('aria-hidden', String(!open));
    });

    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
