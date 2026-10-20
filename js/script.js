/* =========================================================
   Portfolio Emmanuela — script commun aux deux pages
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  // 1. Lettres du titre PORTFOLIO : décalage de l'animation lettre par lettre
  document.querySelectorAll('.hero-title .l').forEach(function (el, i) {
    el.style.setProperty('--i', i);
  });

  // 2. Année automatique dans le pied de page
  var year = String(new Date().getFullYear());
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = year;
  });

  // 3. Page projets : la pastille du projet visible passe en noir
  var jumpLinks = document.querySelectorAll('.jump a');
  if (jumpLinks.length && 'IntersectionObserver' in window) {
    var targets = new Map();
    jumpLinks.forEach(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) targets.set(target, link);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        jumpLinks.forEach(function (l) { l.classList.remove('is-active'); });
        targets.get(entry.target).classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    targets.forEach(function (_link, target) { observer.observe(target); });
  }

  // 4. Liens pas encore remplis (href="#") : ne pas remonter en haut de page
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
