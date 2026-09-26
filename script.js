(function () {
  var NUM = '573015087564';
  var wa = function (msg) { return 'https://wa.me/' + NUM + '?text=' + encodeURIComponent(msg); };

  /* Every element with data-wa opens WhatsApp with that message */
  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.href = wa(el.dataset.wa);
    el.target = '_blank';
    el.rel = 'noopener';
  });

  /* Mobile menu */
  var btn = document.querySelector('.menu-btn'), nav = document.getElementById('nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); } });
  }

  /* Close open dropdown <details> (nav "Alojamientos", Home CTA) on outside click or Escape */
  document.addEventListener('click', function (e) {
    document.querySelectorAll('details[open]').forEach(function (d) {
      if (!d.contains(e.target)) d.removeAttribute('open');
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('details[open]').forEach(function (d) { d.removeAttribute('open'); });
    }
  });

  /* Quote form (Home only) */
  var f = document.getElementById('cotizar');
  if (f) {
    var a = document.getElementById('llegada'), s = document.getElementById('salida'), err = document.getElementById('q-err');
    var today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    a.min = today; s.min = today;
    a.addEventListener('change', function () { s.min = a.value || today; });
    var fmt = function (d) { var p = d.split('-'); return p[2] + '/' + p[1] + '/' + p[0]; };
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      err.textContent = '';
      if (!a.value || !s.value) { err.textContent = 'Elige la fecha de llegada y la de salida.'; return; }
      var nights = Math.round((new Date(s.value) - new Date(a.value)) / 86400000);
      if (nights < 1) { err.textContent = 'La salida debe ser después de la llegada.'; return; }
      var msg = 'Hola Villa Patry, quiero cotizar una estadía.\n' +
        'Llegada: ' + fmt(a.value) + '\n' +
        'Salida: ' + fmt(s.value) + ' (' + nights + (nights === 1 ? ' noche' : ' noches') + ')\n' +
        'Personas: ' + document.getElementById('personas').value + '\n' +
        'Alojamiento: ' + document.getElementById('tipo').value + '\n' +
        '¿Tienen disponibilidad?';
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  /* Lightbox (any page with a dialog#lb) */
  var lb = document.getElementById('lb');
  if (lb) {
    var img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    var group = [], i = 0;
    function show() {
      var el = group[i];
      img.src = el.getAttribute('href');
      img.alt = el.dataset.alt || '';
      cap.textContent = (i + 1) + ' de ' + group.length + '. ' + img.alt;
    }
    function step(n) { i = (i + n + group.length) % group.length; show(); }
    document.addEventListener('click', function (e) {
      var el = e.target.closest('a.lb');
      if (!el) return;
      e.preventDefault();
      group = Array.prototype.slice.call(document.querySelectorAll('a.lb[data-group="' + el.dataset.group + '"]'));
      i = group.indexOf(el);
      show();
      lb.showModal();
      document.body.style.overflow = 'hidden';
    });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.close(); });
    lb.querySelector('.lb-prev').addEventListener('click', function () { step(-1); });
    lb.querySelector('.lb-next').addEventListener('click', function () { step(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', function () { document.body.style.overflow = ''; });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }
})();
