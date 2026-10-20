// Mission Aviation Academy — shared nav interactions
(function () {
  var ham = document.getElementById('maaHamburger');
  var navLinks = document.getElementById('maaNavLinks');
  var dropdowns = document.querySelectorAll('.maa-dropdown');

  function closeAll() {
    dropdowns.forEach(function (d) { d.classList.remove('open'); });
    if (navLinks) navLinks.classList.remove('open');
    if (ham) { ham.classList.remove('open'); ham.setAttribute('aria-expanded', 'false'); }
  }

  // Hamburger
  if (ham && navLinks) {
    ham.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = navLinks.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Dropdowns
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.maa-dd-btn');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasOpen = dd.classList.contains('open');
      dropdowns.forEach(function (d) { d.classList.remove('open'); });
      if (!wasOpen) dd.classList.add('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', closeAll);

  // Close mobile menu when a nav link is followed
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeAll);
    });
  }
})();
