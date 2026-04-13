/* ========================================
   FERRETERÍA EL VECINO — script.js
======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Cursor personalizado ──────────────────────────────
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
    });

    function animateFollower() {
      followerX += (mouseX - followerX - 18) * 0.12;
      followerY += (mouseY - followerY - 18) * 0.12;
      follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Efecto hover en elementos interactivos
    const hoverEls = document.querySelectorAll('a, button, .filter-btn, .product-card, .card-btn');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  // ── 2. Navbar: scroll ────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ── 3. Hamburger (móvil) ─────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.style.display === 'flex';
      navLinks.style.display = open ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'fixed';
      navLinks.style.top = '70px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'rgba(10,10,10,0.98)';
      navLinks.style.padding = '2rem';
      navLinks.style.gap = '1.5rem';
      navLinks.style.zIndex = '999';
      navLinks.style.backdropFilter = 'blur(20px)';
      navLinks.style.borderBottom = '1px solid rgba(201,168,76,0.15)';
    });

    // Cerrar al hacer click en link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.style.display = 'none';
      });
    });
  }

  // ── 4. Partículas flotantes ──────────────────────────────
  const particlesContainer = document.getElementById('particles');
  if (particlesContainer) {
    const count = window.innerWidth < 768 ? 15 : 35;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 3 + 1;
      p.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${Math.random() * 100}%;
        animation-duration: ${Math.random() * 15 + 10}s;
        animation-delay: ${Math.random() * 10}s;
        opacity: 0;
      `;
      particlesContainer.appendChild(p);
    }
  }

  // ── 5. Reveal on scroll (Intersection Observer) ──────────
  const revealEls = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Delay escalonado para elementos del mismo contenedor
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal-up'));
        const delay = siblings.indexOf(entry.target) * 100;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── 6. Contadores animados (Stats) ──────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        animateCounter(el, target);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value.toLocaleString('es-AR');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('es-AR');
    }
    requestAnimationFrame(update);
  }

  // ── 7. Filtros de catálogo ───────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Actualizar botón activo
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-cat');

      productCards.forEach((card, i) => {
        const cardCat = card.getAttribute('data-cat');
        const show = cat === 'all' || cardCat === cat;

        if (show) {
          card.classList.remove('hidden');
          // Animación escalonada
          setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.97)';
            requestAnimationFrame(() => {
              card.style.transition = `opacity 0.4s ease ${i * 40}ms, transform 0.4s ease ${i * 40}ms`;
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            });
          }, 0);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ── 8. Parallax suave en el Hero ─────────────────────────
  const heroBgText = document.querySelector('.hero-bg-text');
  const decoRings = document.querySelectorAll('.deco-ring');
  const decoGears = document.querySelectorAll('.deco-gear');

  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (heroBgText) {
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${sy * 0.3}px))`;
    }
    decoRings.forEach((ring, i) => {
      ring.style.transform = `translateY(${sy * (0.1 + i * 0.05)}px)`;
    });
    decoGears.forEach((gear, i) => {
      const base = sy * (0.08 + i * 0.04);
      gear.style.transform = `translateY(${base}px) rotate(${sy * 0.05}deg)`;
    });
  });

  // ── 9. Smooth scroll para anclas ─────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── 10. Formulario de contacto ───────────────────────────
  const form = document.getElementById('contactForm');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');
  const modalOk = document.getElementById('modalOk');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Animación del botón
      const btn = form.querySelector('.btn-primary');
      btn.textContent = 'Enviando...';
      btn.style.opacity = '0.7';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '¡Enviado! ✓';
        btn.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        setTimeout(() => {
          modalOverlay.classList.add('active');
          btn.textContent = 'Enviar Mensaje ✉';
          btn.style.opacity = '1';
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 800);
      }, 1200);
    });
  }

  function closeModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOk) modalOk.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  // ── 11. Card consultar → WhatsApp ────────────────────────
  document.querySelectorAll('.card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.product-card');
      const product = card.querySelector('.card-title').textContent;
      const phone = '5492944000000'; // Reemplazar con número real
      const msg = encodeURIComponent(`Hola! Quisiera consultar por: ${product}`);
      window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
    });
  });

  // ── 12. Efecto de brillo en hover de cards ───────────────
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(201,168,76,0.07), #1c1c1c 60%)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // ── 13. Animación de entrada del Hero ────────────────────
  const heroItems = document.querySelectorAll('.hero-content .reveal-up');
  heroItems.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, 300 + i * 200);
  });

  console.log('🔧 Ferretería El Vecino — Sitio iniciado correctamente');
});
