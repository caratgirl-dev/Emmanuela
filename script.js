/* =========================================================
   Portfolio Emmanuela — logique du mini système d'exploitation
   ========================================================= */

/* ---------- À REMPLIR ---------- */

const EMAIL = 'ton.email@exemple.com';

// Tes projets : modifie les textes ici, la fenêtre Projets se met à jour toute seule.
// image : chemin vers une capture (ex. 'images/projet-1.jpg'), laisse '' pour l'aperçu jaune/blanc.
const PROJETS = [
  {
    nom: "Yopougon l'avenir d'Abidjan",
    type: 'Web',
    annee: '[2025]',
    defi: '[Présenter la commune de Yopougon et en faire la promotion touristique.]',
    solution: '[Création d’un site web interactif présentant les attractions touristiques, les événements culturels et les services locaux. Mon rôle : développeuse front-end, intégration des contenus et optimisation de l’expérience utilisateur.]',
    technos: ['[HTML/CSS]', '[JavaScript]', '[Bootstrap]'],
    image: 'images/yopougon.jpg',
    lien: 'https://projet-final-yopougon.vercel.app/',
    code: 'https://github.com/caratgirl-dev/Yopougon-l-avenir-de-yopougon.git'
  },
  {
    nom: 'Light Crepes',
    type: 'Web',
    annee: '[2025]',
    defi: '[Afficher les produits de la pâtisserie en ligne et permettre aux clients de passer des commandes facilement.]',
    solution: "[Developpement d'un site vitrine pour la patisserie Light Crepes , mon rôle : intégration des contenus, mise en place d’un formulaire de contact et optimisation de la navigation.]",
    technos: ['[HTML/CSS]', '[JavaScript]', '[Tailwind CSS]'],
    image: 'images/light-crepes.jpg',
    lien: 'https://lightcrepes.vercel.app/',
    code: 'https://github.com/caratgirl-dev/LIGHT-CREPES'
  },
  {
    nom: 'Les Délices des 3A',
    type: 'E-commerce',
    annee: '[2026]',
    defi: '[Créer une patisserie en ligne spécialisée en mignardises.]',
    solution: '[Creation du branding, du logo et de l’identité visuelle. Gestion des réseaux sociaux et de la communication. Mon rôle : cofondatrice, responsable marketing et communication.]',
    technos: ['[Canva]', '[Capcut]', '[Instagram]'],
    image: 'images/les-delices-des-3a.jpg',
    lien: 'https://www.instagram.com/les_delices_des_3a?utm_source=ig_web_button_share_sheet&srtk=ZDNlZDc0MzIxNw=='
  },
  {
    nom: 'Blac Joyaux',
    type: 'Web',
    annee: '[2026]',
    defi: 'Rebranding du site web de la marque de sacs Blac Joyau.',
    solution: 'Refonte complète du site web, amélioration de l’expérience utilisateur et optimisation du référencement. Mon rôle : développeuse front-end, intégration des contenus et mise en place d’un système de paiement sécurisé.',
    technos: ['[Tailwind CSS]', '[Laravel]', '[PHP]'],
    lien: 'https://github.com/Esther-Anato/blac_joyaux',
    image: 'images/blac-joyau.jpg',
    code: 'https://github.com/Esther-Anato/blac_joyaux'
  }
];

/* ---------- Outils ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const isMobile = () => window.matchMedia('(max-width: 760px)').matches;
const escapeHTML = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const lock = $('#lock');
const os = $('#os');
const desktop = $('#desktop');
const activeAppLabel = $('#active-app');
const APPS = ['apropos', 'projets', 'delices', 'contact', 'terminal'];

/* =========================================================
   Horloge
   ========================================================= */

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const lockDate = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const barDate = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });

  $$('[data-time]').forEach((el) => { el.textContent = time; });
  $$('[data-date]').forEach((el) => { el.textContent = lockDate; });
  $$('[data-clock-long]').forEach((el) => { el.textContent = `${barDate} ${time}`; });
  $$('[data-clock-short]').forEach((el) => { el.textContent = time; });
}
updateClock();
setInterval(updateClock, 15000);

/* =========================================================
   Fond d'écran : motif {me}
   ========================================================= */

$('#pattern').textContent = '';
for (let i = 0; i < 260; i++) {
  const span = document.createElement('span');
  span.textContent = '{me}';
  $('#pattern').appendChild(span);
}

/* Logo : si images/logo.png manque, on affiche « e. » */
const logoImg = $('#logo img');
const showLogoFallback = () => $('#logo').classList.add('no-img');
logoImg.addEventListener('error', showLogoFallback);
if (logoImg.complete && logoImg.naturalWidth === 0) showLogoFallback();

/* =========================================================
   Écran de verrouillage
   ========================================================= */

let unlocked = false;

function unlock(viaKeyboard = false) {
  if (unlocked) return;
  unlocked = true;
  try { sessionStorage.setItem('emma-unlocked', '1'); } catch (e) { /* stockage indisponible */ }
  os.inert = false;
  lock.classList.add('is-open');
  const done = () => { lock.hidden = true; };
  lock.addEventListener('transitionend', done, { once: true });
  setTimeout(done, 900); // filet de sécurité si l'animation est désactivée
  // Le focus clavier passe sur la première icône seulement si on a déverrouillé au clavier
  const first = $('.icon');
  if (viaKeyboard && first) first.focus({ preventScroll: true });
}

function setupLock() {
  let skip = false;
  try { skip = sessionStorage.getItem('emma-unlocked') === '1'; } catch (e) { /* rien */ }
  const hashApp = location.hash.slice(1);
  if (skip || APPS.includes(hashApp)) {
    unlocked = true;
    lock.hidden = true;
    return;
  }

  os.inert = true;
  $('#unlock').focus({ preventScroll: true });

  // Clic ou tap n'importe où
  lock.addEventListener('click', (e) => unlock(e.detail === 0));

  // Clavier
  document.addEventListener('keydown', (e) => {
    if (!unlocked && ['Enter', ' ', 'ArrowUp'].includes(e.key)) {
      e.preventDefault();
      unlock(true);
    }
  });

  // Glisser vers le haut
  let startY = null;
  lock.addEventListener('pointerdown', (e) => { startY = e.clientY; });
  lock.addEventListener('pointermove', (e) => {
    if (startY === null) return;
    const dy = Math.min(0, e.clientY - startY);
    lock.style.transition = 'none';
    lock.style.transform = `translateY(${dy}px)`;
  });
  const endSwipe = (e) => {
    if (startY === null) return;
    const dy = e.clientY - startY;
    startY = null;
    lock.style.transition = '';
    lock.style.transform = '';
    if (dy < -60) unlock();
  };
  lock.addEventListener('pointerup', endSwipe);
  lock.addEventListener('pointercancel', endSwipe);

  // Molette
  lock.addEventListener('wheel', () => unlock(), { passive: true, once: true });
}

/* =========================================================
   Fenêtres
   ========================================================= */

let zTop = 20;
let lastOpener = null;

const getWin = (app) => document.getElementById(`win-${app}`);

function setRunning(app, running) {
  $$(`[data-dock="${app}"]`).forEach((el) => el.classList.toggle('is-running', running));
}

function placeWindow(win) {
  if (win.dataset.placed) return;
  const rect = desktop.getBoundingClientRect();
  const w = Math.min(win.offsetWidth, rect.width - 32);
  const h = Math.min(win.offsetHeight, rect.height - 120);
  const x = Math.max(16, Math.min(Number(win.dataset.x) || 120, rect.width - w - 16));
  const y = Math.max(12, Math.min(Number(win.dataset.y) || 30, rect.height - h - 110));
  win.style.left = `${x}px`;
  win.style.top = `${y}px`;
  win.dataset.placed = '1';
}

function focusWindow(win) {
  $$('.window').forEach((w) => w.classList.remove('is-active'));
  win.classList.add('is-active');
  win.style.zIndex = ++zTop;
  activeAppLabel.textContent = win.dataset.title;
}

function refreshState() {
  const open = $$('.window').filter((w) => !w.hidden);
  document.body.classList.toggle('app-open', open.length > 0);
  if (!open.length) {
    activeAppLabel.textContent = 'Bureau';
    return;
  }
  const top = open.sort((a, b) => (Number(b.style.zIndex) || 0) - (Number(a.style.zIndex) || 0))[0];
  focusWindow(top);
}

function openApp(app, opener) {
  const win = getWin(app);
  if (!win) return;
  if (!unlocked) unlock();
  if (opener) lastOpener = opener;

  // Sur mobile, une seule app ouverte à la fois
  if (isMobile()) {
    $$('.window').forEach((w) => { if (w !== win) w.hidden = true; });
  }

  win.hidden = false;
  placeWindow(win);
  focusWindow(win);
  setRunning(app, true);
  document.body.classList.add('app-open');
  history.replaceState(null, '', `#${app}`);

  if (app === 'terminal') {
    $('#term-input').focus({ preventScroll: true });
  } else {
    $('.window__body', win).focus({ preventScroll: true });
  }
}

function closeApp(app, { keepRunning = false } = {}) {
  const win = getWin(app);
  if (!win) return;
  win.hidden = true;
  win.classList.remove('is-active');
  if (!keepRunning) {
    setRunning(app, false);
    win.classList.remove('is-max');
    if (app === 'projets') renderProjectGrid();
  }
  history.replaceState(null, '', location.pathname + location.search);
  refreshState();
  if (lastOpener && document.contains(lastOpener)) lastOpener.focus({ preventScroll: true });
}

// Boutons qui ouvrent une app
document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open]');
  if (opener) {
    e.preventDefault();
    openApp(opener.dataset.open, opener);
    return;
  }
  const action = e.target.closest('[data-action]');
  if (action) {
    const win = action.closest('.window');
    const app = win.id.replace('win-', '');
    if (action.dataset.action === 'close') closeApp(app);
    if (action.dataset.action === 'min') closeApp(app, { keepRunning: true });
    if (action.dataset.action === 'max') win.classList.toggle('is-max');
  }
});

// Le logo ramène au bureau (tout réduire)
$('#logo').addEventListener('click', (e) => {
  e.preventDefault();
  $$('.window').forEach((w) => { if (!w.hidden) closeApp(w.id.replace('win-', ''), { keepRunning: true }); });
});

// Cliquer dans une fenêtre la passe au premier plan
$$('.window').forEach((win) => {
  win.addEventListener('pointerdown', () => focusWindow(win));
});

// Double-clic sur la barre : agrandir
$$('[data-drag]').forEach((bar) => {
  bar.addEventListener('dblclick', (e) => {
    if (e.target.closest('button') || isMobile()) return;
    bar.closest('.window').classList.toggle('is-max');
  });
});

// Échap ferme la fenêtre active
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape' || !unlocked) return;
  const active = $('.window.is-active:not([hidden])');
  if (active) closeApp(active.id.replace('win-', ''));
});

/* ---------- Déplacer les fenêtres ---------- */

$$('[data-drag]').forEach((bar) => {
  const win = bar.closest('.window');
  let start = null;

  bar.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target.closest('button') || isMobile() || win.classList.contains('is-max')) return;
    start = { x: e.clientX, y: e.clientY, left: win.offsetLeft, top: win.offsetTop };
    bar.setPointerCapture(e.pointerId);
  });

  bar.addEventListener('pointermove', (e) => {
    if (!start) return;
    const rect = desktop.getBoundingClientRect();
    const left = start.left + e.clientX - start.x;
    const top = start.top + e.clientY - start.y;
    win.style.left = `${Math.max(-win.offsetWidth + 100, Math.min(left, rect.width - 100))}px`;
    win.style.top = `${Math.max(0, Math.min(top, rect.height - 60))}px`;
  });

  const stop = () => { start = null; };
  bar.addEventListener('pointerup', stop);
  bar.addEventListener('pointercancel', stop);
});

/* =========================================================
   App À propos : navigation entre les notes
   ========================================================= */

const notesPage = $('.notes__page');
const noteLinks = $$('.notes__link');

noteLinks.forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.getElementById(link.dataset.note);
    notesPage.scrollTo({ top: target.offsetTop - 24, behavior: 'smooth' });
  });
});

if ('IntersectionObserver' in window) {
  const notesObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      noteLinks.forEach((l) => l.classList.toggle('is-active', l.dataset.note === entry.target.id));
    });
  }, { root: notesPage, rootMargin: '-10% 0px -70% 0px' });
  $$('section', notesPage).forEach((s) => notesObserver.observe(s));
}

/* =========================================================
   App Projets
   ========================================================= */

const photos = $('#photos');
const pad = (n) => String(n + 1).padStart(2, '0');

function renderProjectGrid() {
  const cards = PROJETS.map((p, i) => {
    const color = i % 2 === 0 ? 'yellow' : 'white';
    const r = [-3, 2.5, -1.5, 3.5][i % 4];
    const visual = p.image
      ? `<img src="${escapeHTML(p.image)}" alt="">`
      : escapeHTML(p.nom);
    return `
      <button class="pcard" type="button" data-project="${i}">
        <span class="pcard__num" aria-hidden="true">${pad(i)}</span>
        <span class="pcard__shot pcard__shot--${color}" style="--r: ${r}deg">${visual}</span>
        <span class="pcard__name">${escapeHTML(p.nom)}</span>
        <span class="pcard__type">${escapeHTML(p.type)}, ${escapeHTML(p.annee)}</span>
      </button>`;
  }).join('');

  photos.innerHTML = `
    <div class="photos__head">
      <h3>Projets</h3>
      <span class="photos__count">${PROJETS.length} projets</span>
    </div>
    <div class="photos__grid">${cards}</div>`;
}

function renderProjectDetail(i) {
  const p = PROJETS[i];
  const visual = p.image
    ? `<img src="${escapeHTML(p.image)}" alt="Capture de ${escapeHTML(p.nom)}">`
    : '[Capture du projet]';
  photos.innerHTML = `
    <button class="pdetail__back" type="button" data-back>‹ Tous les projets</button>
    <article class="pdetail">
      <div class="pdetail__shot"><span class="tape" aria-hidden="true"></span>${visual}</div>
      <div class="pdetail__info">
        <span class="pdetail__meta">${pad(i)} · ${escapeHTML(p.type)}, ${escapeHTML(p.annee)}</span>
        <h3>${escapeHTML(p.nom)}</h3>
        <p class="pdetail__label">Le défi</p>
        <p>${escapeHTML(p.defi)}</p>
        <p class="pdetail__label">Ce que j’ai construit</p>
        <p>${escapeHTML(p.solution)}</p>
        <div class="chips">${p.technos.map((t) => `<span class="chip">${escapeHTML(t)}</span>`).join('')}</div>
        <div class="btn-row">
          <a class="btn btn--yellow" href="${escapeHTML(p.lien)}" target="_blank" rel="noopener">Voir le projet</a>
          <a class="btn btn--ghost-light" href="${escapeHTML(p.code)}" target="_blank" rel="noopener">Code source</a>
        </div>
      </div>
    </article>`;
  $('.window__body', getWin('projets')).scrollTop = 0;
  $('[data-back]', photos).focus({ preventScroll: true });
}

photos.addEventListener('click', (e) => {
  const card = e.target.closest('[data-project]');
  if (card) {
    renderProjectDetail(Number(card.dataset.project));
    return;
  }
  if (e.target.closest('[data-back]')) {
    renderProjectGrid();
    $('.pcard', photos).focus({ preventScroll: true });
  }
});

renderProjectGrid();

/* =========================================================
   App Contact : le formulaire ouvre la messagerie
   ========================================================= */

$$('[data-email]').forEach((el) => { el.textContent = EMAIL; });

$('#mail-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const name = form.elements['name'].value.trim();
  const subject = form.elements['subject'].value.trim();
  const body = `${form.elements['body'].value.trim()}\n\n${name}`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  $('#mail-status').textContent = 'Ta messagerie s’ouvre avec le message prêt à partir.';
});

/* =========================================================
   App Terminal
   ========================================================= */

const termOut = $('#term-out');
const termInput = $('#term-input');
const history_ = [];
let historyIndex = 0;

function print(text, cls = '') {
  const p = document.createElement('p');
  if (cls) p.className = cls;
  p.textContent = text;
  termOut.appendChild(p);
}

const COMMANDS = {
  aide: () => {
    print('Commandes disponibles :', 'term__y');
    print('  qui        qui je suis');
    print('  apropos    ouvre « À propos »');
    print('  projets    liste mes projets');
    print('  delices    Les Délices des 3A');
    print('  contact    comment me joindre');
    print('  ouvrir X   ouvre une app (apropos, projets, delices, contact)');
    print('  effacer    vide le terminal');
  },
  qui: () => print('Emmanuela, développeuse web & mobile, Abidjan. Étudiante à l’IFRAN.'),
  apropos: () => { print('Ouverture de « À propos »…'); openApp('apropos'); },
  projets: () => {
    PROJETS.forEach((p, i) => print(`  ${pad(i)}  ${p.nom}  (${p.type})`));
    print('Tape « ouvrir projets » pour les voir.', 'term__y');
  },
  delices: () => print('Les Délices des 3A : pâtisserie en ligne spécialisée en mignardises. Je suis cofondatrice.'),
  contact: () => { print(`Mail : ${EMAIL}`); print('Tape « ouvrir contact » pour m’écrire.', 'term__y'); },
  effacer: () => { termOut.textContent = ''; },
  clear: () => { termOut.textContent = ''; }
};

function runCommand(raw) {
  const input = raw.trim();
  print(`emmanuela@abidjan ~ % ${input}`);
  if (!input) return;
  const [cmd, arg] = input.toLowerCase().split(/\s+/);

  if (cmd === 'ouvrir') {
    if (APPS.includes(arg) && arg !== 'terminal') {
      print(`Ouverture de « ${arg} »…`);
      openApp(arg);
    } else {
      print('Usage : ouvrir apropos | projets | delices | contact');
    }
  } else if (COMMANDS[cmd]) {
    COMMANDS[cmd]();
  } else {
    print(`Commande inconnue : ${cmd}. Tape « aide ».`);
  }
}

print('Bienvenue ! Tape « aide » pour voir les commandes.', 'term__y');

$('#term-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const value = termInput.value;
  if (value.trim()) history_.push(value);
  historyIndex = history_.length;
  runCommand(value);
  termInput.value = '';
  $('#term').scrollTop = $('#term').scrollHeight;
});

termInput.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && historyIndex > 0) {
    e.preventDefault();
    termInput.value = history_[--historyIndex];
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    historyIndex = Math.min(history_.length, historyIndex + 1);
    termInput.value = history_[historyIndex] || '';
  }
});

$('#term').addEventListener('click', (e) => {
  if (!window.getSelection().toString() && !e.target.closest('button')) termInput.focus();
});

/* =========================================================
   Fonds d'écran en image (repli sur le fond jaune si absents)
   ========================================================= */

function useWallpaper(src, className) {
  const img = new Image();
  img.onload = () => document.body.classList.add(className);
  img.src = src;
}
useWallpaper('images/wallpaper.jpg', 'has-wall-desk');
useWallpaper('images/lock.jpg', 'has-wall-lock');
/* =========================================================
   Démarrage
   ========================================================= */

setupLock();

// Lien direct : monsite.com/#projets ouvre directement l'app
const startApp = location.hash.slice(1);
if (APPS.includes(startApp)) openApp(startApp);

window.addEventListener('hashchange', () => {
  const app = location.hash.slice(1);
  if (APPS.includes(app)) openApp(app);
});
