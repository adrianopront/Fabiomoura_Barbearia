/* ============================================
   FÁBIO MOURA BARBEARIA — script.js
   ============================================ */

// ── 1. Loading Screen ────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loading-screen');
  // Aguarda animação da barra (1.8s) + pequeno delay extra
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2200);
});

// ── 2. Navbar scroll effect ──────────────────
const mainNav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
});

// ── 3. Scroll Reveal ─────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Delay escalonado por ordem entre irmãos
        const siblings = [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'));
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 80}ms`;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── 4. Smooth scroll para links da navbar ────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // altura da navbar
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });

      // Fecha menu mobile se estiver aberto
      const navCollapse = document.getElementById('navMenu');
      if (navCollapse && navCollapse.classList.contains('show')) {
        const toggler = document.querySelector('.navbar-toggler');
        toggler && toggler.click();
      }
    }
  });
});

// ── 5. Agendamento via WhatsApp ───────────────
function enviarWhatsApp() {
  // Captura dos campos
  const nome      = document.getElementById('aNome').value.trim();
  const telefone  = document.getElementById('aTelefone').value.trim();
  const servico   = document.getElementById('aServico').value;
  const dataRaw   = document.getElementById('aData').value;
  const horario   = document.getElementById('aHorario').value;
  const obs       = document.getElementById('aObs').value.trim();

  // Validação básica
  if (!nome || !telefone || !servico || !dataRaw || !horario) {
    shakeForm();
    showAlert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  // Formata a data para dd/mm/aaaa
  const [ano, mes, dia] = dataRaw.split('-');
  const dataFormatada = `${dia}/${mes}/${ano}`;

  // Monta a mensagem formatada
  const mensagem =
    `Olá, gostaria de agendar um horário! 💈\n\n` +
    `*Nome:* ${nome}\n` +
    `*Telefone:* ${telefone}\n` +
    `*Serviço:* ${servico}\n` +
    `*Data:* ${dataFormatada}\n` +
    `*Horário:* ${horario}\n` +
    (obs ? `*Observações:* ${obs}\n` : '') +
    `\nAguardo confirmação!`;

  // Número do WhatsApp — ALTERE para o número real da barbearia
  const numero = '5521999999999';

  // Codifica e abre o WhatsApp
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');
}

// Animação de erro no formulário
function shakeForm() {
  const wrapper = document.querySelector('.agendamento-form-wrapper');
  wrapper.style.animation = 'shake 0.4s ease';
  wrapper.addEventListener('animationend', () => {
    wrapper.style.animation = '';
  }, { once: true });
}

// Alert estilizado (sem alert() nativo)
function showAlert(msg) {
  // Remove alert anterior se existir
  const existing = document.getElementById('custom-alert');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'custom-alert';
  el.style.cssText = `
    position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%);
    background: #C9A14A; color: #000;
    padding: 0.9rem 2rem; z-index: 9999;
    font-family: 'Montserrat', sans-serif;
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
    animation: slideUp 0.3s ease;
  `;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// Injeta keyframes de shake e slideUp no <head>
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-8px); }
    40%       { transform: translateX(8px); }
    60%       { transform: translateX(-5px); }
    80%       { transform: translateX(5px); }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translate(-50%, 20px); }
    to   { opacity: 1; transform: translate(-50%, 0); }
  }
`;
document.head.appendChild(style);

// ── 6. Destaca link ativo na navbar ao rolar ──
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(sec => activeObserver.observe(sec));

// CSS para link ativo
const activeStyle = document.createElement('style');
activeStyle.textContent = `.nav-link.active-link { color: var(--gold) !important; }`;
document.head.appendChild(activeStyle);
