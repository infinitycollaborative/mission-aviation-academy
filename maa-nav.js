(function () {
  var toggle = document.querySelector('.maa-nav-toggle');
  var links = document.querySelector('.maa-nav-links, .nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', function () {
    var open = links.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('nav-open')) {
      links.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('nav') && links.classList.contains('nav-open')) {
      links.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
