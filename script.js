/* ============================================================
   PORTFOLIO SCRIPT
   Features:
   - Canvas graph/network animation in hero
   - Typing animation for role text
   - Theme toggle (dark / light)
   - Mobile nav + scroll-spy
   - Scroll progress bar + back-to-top
   - Reveal-on-scroll animations
   - Animated stat counters
   - Skill tabs + animated skill bars
   - Project card 3D tilt
   - Contact form validation + mailto submit
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. THEME TOGGLE
  ---------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  themeToggle.addEventListener('click', () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    root.setAttribute('data-theme', isLight ? 'dark' : 'light');
  });

  /* ----------------------------------------------------------
     2. MOBILE NAV + SCROLL SPY
  ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navbar = document.getElementById('navbar');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');

  function onScroll() {
    // navbar background
    navbar.classList.toggle('scrolled', window.scrollY > 30);

    // scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
    document.getElementById('scrollProgress').style.width = progress + '%';

    // back to top button
    document.getElementById('backToTop').classList.toggle('show', window.scrollY > 500);

    // scroll spy
    let current = '';
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = section.id;
      }
    });

    navAnchors.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll);
  onScroll();

  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     3. TYPING ANIMATION (hero role line)
  ---------------------------------------------------------- */
  const roles = [
    'Web Developer ',
    'Python & DSA learner',
    'AI / ML explorer',
    'B.Tech Math & Computing student',
    'Future problem solver'
  ];

  const typingEl = document.getElementById('typingText');
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    const current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1700);
        return;
      }
      setTimeout(typeLoop, 55);
    } else {
      charIndex--;
      typingEl.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeLoop, 400);
        return;
      }
      setTimeout(typeLoop, 28);
    }
  }

  typeLoop();

  /* ----------------------------------------------------------
     4. REVEAL ON SCROLL
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => revealObserver.observe(el));

  /* ----------------------------------------------------------
     5. ANIMATED STAT COUNTERS
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((el) => counterObserver.observe(el));

  /* ----------------------------------------------------------
     6. SKILL TABS + ANIMATED BARS
  ---------------------------------------------------------- */
  const skillTabs = document.querySelectorAll('.skill-tab');
  const skillPanels = document.querySelectorAll('.skills-panel');

  function fillBars(panel) {
    panel.querySelectorAll('.skill-fill').forEach((bar) => {
      const level = bar.dataset.level;
      requestAnimationFrame(() => {
        bar.style.width = level + '%';
      });
    });
  }

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;

      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      skillPanels.forEach((panel) => {
        const isTarget = panel.id === target;
        panel.classList.toggle('active', isTarget);
        if (isTarget) {
          // reset bars then fill for a nice re-trigger effect
          panel.querySelectorAll('.skill-fill').forEach((bar) => (bar.style.width = '0%'));
          requestAnimationFrame(() => fillBars(panel));
        }
      });
    });
  });

  // fill bars for first panel on scroll into view
  const skillsSection = document.getElementById('skills');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activePanel = document.querySelector('.skills-panel.active');
        if (activePanel) fillBars(activePanel);
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  if (skillsSection) skillsObserver.observe(skillsSection);

  /* ----------------------------------------------------------
     7. PROJECT CARD 3D TILT
  ---------------------------------------------------------- */
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ----------------------------------------------------------
     8. CONTACT FORM VALIDATION + MAILTO
  ---------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  function setError(id, message) {
    const errorEl = document.getElementById(id + 'Error');
    if (errorEl) errorEl.textContent = message;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    let valid = true;

    setError('name', '');
    setError('email', '');
    setError('message', '');

    if (name.length < 2) {
      setError('name', 'Please enter your name.');
      valid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (message.length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      valid = false;
    }

    if (!valid) return;

    // Replace this address with your own email
    const destination = 'your.email@example.com';
    const subject = encodeURIComponent(`Portfolio contact from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);

    window.location.href = `mailto:${destination}?subject=${subject}&body=${body}`;

    showToast("Opening your email app to send the message — thanks for reaching out!");
    form.reset();
  });

  /* ----------------------------------------------------------
     9. HERO CANVAS — graph / node network
  ---------------------------------------------------------- */
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, nodes;
  const mouse = { x: null, y: null, radius: 140 };

  function getColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      cyan: styles.getPropertyValue('--accent-cyan').trim(),
      violet: styles.getPropertyValue('--accent-violet').trim(),
      amber: styles.getPropertyValue('--accent-amber').trim(),
      line: getComputedStyle(document.documentElement).getPropertyValue('--text-faint').trim()
    };
  }

  function resizeCanvas() {
    const hero = document.querySelector('.hero');
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
    initNodes();
  }

  function initNodes() {
    const count = Math.max(28, Math.min(60, Math.floor((width * height) / 22000)));
    const colors = getColors();
    const palette = [colors.cyan, colors.violet, colors.amber];

    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1.5,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    const colors = getColors();

    // update + draw nodes
    nodes.forEach((node) => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      // gentle mouse repulsion
      if (mouse.x !== null) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          node.x += (dx / dist) * force * 1.2;
          node.y += (dy / dist) * force * 1.2;
        }
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // draw connecting lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = colors.line;
          ctx.globalAlpha = (1 - dist / 130) * 0.35;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  resizeCanvas();
  draw();

  /* re-init node colors when theme changes */
  themeToggle.addEventListener('click', () => {
    setTimeout(initNodes, 50);
  });

});
