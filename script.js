/* ═══════════════════════════════════════════
   1. BACKGROUND — Floating Particles + Connections
═══════════════════════════════════════════ */
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(127,255,212,', 'rgba(167,139,250,', 'rgba(244,114,182,', 'rgba(56,189,248,'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = -Math.random() * 0.4 - 0.1;
      this.r = Math.random() * 1.5 + 0.3;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.life = 0;
      this.maxLife = Math.random() * 300 + 200;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      const progress = this.life / this.maxLife;
      this.currentAlpha = this.alpha * Math.sin(Math.PI * progress);
      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.currentAlpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function drawConnections() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.06;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(127,255,212,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function drawMouseRepel() {
    particles.forEach(p => {
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120 * 0.8;
        p.vx += (dx / dist) * force * 0.04;
        p.vy += (dy / dist) * force * 0.04;
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawMouseRepel();
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ═══════════════════════════════════════════
   2. CURSOR — Magnetic Plasma Orb + Comet Trail
═══════════════════════════════════════════ */
(function () {
  const outerEl = document.getElementById('cursor-outer');
  const innerEl = document.getElementById('cursor-inner');
  const trailCanvas = document.getElementById('cursor-trail-canvas');
  const ctx = trailCanvas.getContext('2d');

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let ox = mx, oy = my;
  let trail = [];
  const TRAIL_LEN = 22;

  function resize() {
    trailCanvas.width = window.innerWidth;
    trailCanvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    innerEl.style.left = mx + 'px';
    innerEl.style.top = my + 'px';
  });

  (function animOuter() {
    ox += (mx - ox) * 0.1;
    oy += (my - oy) * 0.1;
    outerEl.style.left = ox + 'px';
    outerEl.style.top = oy + 'px';

    trail.push({ x: ox, y: oy, age: 0 });
    if (trail.length > TRAIL_LEN) trail.shift();

    ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
    for (let i = 1; i < trail.length; i++) {
      const t = i / trail.length;
      const prev = trail[i - 1];
      const curr = trail[i];
      const alpha = t * 0.25;
      const width = t * 3;
      const r = Math.round(127 + (167 - 127) * t);
      const g = Math.round(255 + (139 - 255) * t);
      const b = Math.round(212 + (250 - 212) * t);

      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(curr.x, curr.y);
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    requestAnimationFrame(animOuter);
  })();

  document.querySelectorAll('a,button,.project-card,.skill-chip,.contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ═══════════════════════════════════════════
   3. NAV SCROLL
═══════════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 40));

/* ═══════════════════════════════════════════
   4. REVEAL ON SCROLL
═══════════════════════════════════════════ */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .timeline-item').forEach(el => obs.observe(el));

/* ═══════════════════════════════════════════
   5. CV MODAL
═══════════════════════════════════════════ */
const cvOverlay = document.getElementById('cvModalOverlay');

document.getElementById('cvModalClose').addEventListener('click', () => {
  cvOverlay.classList.remove('open');
  document.body.style.overflow = '';
});

cvOverlay.addEventListener('click', e => {
  if (e.target === cvOverlay) {
    cvOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ═══════════════════════════════════════════
   6. PROJECT DATA + MODAL
═══════════════════════════════════════════ */
const projects = [
  {
    badge: '01 — Thesis Project',
    title: 'Contrastive Learning Based Malware Detection in IoT Networks',
    period: 'Jan 2025 – Jan 2026',
    supervisor: 'Supervised by Fatema Tuj Johora, Assistant Professor, Dept. of CSE, DIU',
    overview: 'A research-grade thesis exploring contrastive learning techniques for malware detection in IoT network environments. The core innovation reduces dependency on large labeled datasets — a persistent challenge in cybersecurity — by leveraging self-supervised representation learning.',
    highlights: [
      'Applied SCARF and TCL to IoT network traffic for self-supervised feature learning',
      'Implemented and benchmarked CNN, RNN, and MLP architectures as downstream classifiers',
      'Demonstrated significant accuracy in low-label regimes compared to fully supervised baselines',
      'Performed extensive data preprocessing and feature engineering on IoT network traffic datasets',
      'Utilized Google Colab for GPU-accelerated training and experiment tracking',
    ],
    stack: ['Python', 'TensorFlow', 'Keras', 'Scikit-learn', 'Pandas', 'NumPy', 'Google Colab', 'CNN', 'RNN', 'MLP', 'SCARF', 'TCL'],
    github: 'https://github.com/merajulalam/Contrastive-Learning-Based-Malware-Detection-in-IoT-Network',
  },
  {
    badge: '02 — Network Engineering',
    title: 'Network Security Management System',
    period: 'Jul – Dec 2024',
    overview: 'Designed and simulated a comprehensive smart city network infrastructure using Cisco Packet Tracer, focused on enterprise-grade security, scalability, and fault tolerance through redundant failover mechanisms.',
    highlights: [
      'Designed multi-layer network using hierarchical model (core, distribution, access layers)',
      'Configured EIGRP and OSPF routing protocols with cross-protocol route redistribution',
      'Set up ASA Firewalls with ACLs and NAT policies for segmented network security zones',
      'Deployed VLANs with inter-VLAN routing and WPA2-PSK wireless for IoT device access',
      'Engineered redundant failover paths ensuring zero-downtime for critical city services',
    ],
    stack: ['Cisco Packet Tracer', 'ASA Firewalls', 'FTP Servers', 'EIGRP', 'OSPF', 'DHCP', 'VLANs', 'WPA2-PSK', 'Hierarchical Design'],
    github: 'https://github.com/merajulalam/Network-Security-Management',
  },
  {
    badge: '03 — Systems Programming',
    title: 'EduTrack: Student Management System',
    period: 'Jul – Dec 2024',
    overview: 'A fully shell-scripted student management portal built in Bash on Ubuntu OS, featuring multi-role access control and CSV-based persistent storage — no external database or web framework required.',
    highlights: [
      'Implemented role-based access control for admin, faculty, and student portal views',
      'Automated student registration, grade entry, and academic report generation workflows',
      'Designed CSV flat-file database with robust input validation and error handling',
      'Integrated ShellCheck for static analysis ensuring script reliability across environments',
      'Versioned with Git and deployed with portal-based menu-driven navigation system',
    ],
    stack: ['Bash', 'Shell Scripting', 'Ubuntu OS', 'CSV Files', 'Git', 'ShellCheck', 'Role-Based Access Control', 'File-Based Database'],
    github: 'https://github.com/merajulalam/EduTrack-A-Student-Management-System',
  },
  {
    badge: '04 — Machine Learning',
    title: 'Student Performance Prediction',
    period: 'Jul – Dec 2024',
    overview: 'An end-to-end ML pipeline for predicting student academic performance, deployed as a live Streamlit web application allowing real-time predictions by educators and students.',
    highlights: [
      'Thorough EDA revealed prior exam scores and study hours as dominant performance predictors',
      'Built Multiple Linear Regression model with cross-validation and residual diagnostics',
      'Created rich visualizations with Matplotlib and Seaborn to communicate model insights',
      'Deployed interactive Streamlit app enabling real-time input and instant prediction output',
      'Serialized model with Joblib for efficient production loading and reuse',
    ],
    stack: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Streamlit', 'Joblib', 'Multiple Linear Regression', 'EDA'],
    github: 'https://github.com/merajulalam/Student-Performance-Prediction',
  }
];

const overlay       = document.getElementById('modalOverlay');
const modalContent  = document.getElementById('modalContent');

document.getElementById('modalClose').addEventListener('click', closeModal);
overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    cvOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
});

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => {
    const p = projects[+card.dataset.project];
    modalContent.innerHTML = `
      <div class="modal-badge">${p.badge}</div>
      <div class="modal-title">${p.title}</div>
      <div class="modal-period">${p.period}${p.supervisor ? '<br>' + p.supervisor : ''}</div>
      <div class="modal-section-head">Overview</div>
      <div class="modal-body"><p>${p.overview}</p></div>
      <div class="modal-section-head">Key Contributions</div>
      <div class="modal-body"><ul>${p.highlights.map(h => `<li>${h}</li>`).join('')}</ul></div>
      <div class="modal-section-head">Tech Stack</div>
      <div class="modal-stack">${p.stack.map(s => `<span class="tag highlight">${s}</span>`).join('')}</div>
      <div class="modal-links">
        <a href="${p.github}" target="_blank" rel="noopener" class="modal-link primary">View on GitHub ↗</a>
      </div>
    `;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ═══════════════════════════════════════════
   7. EMAILJS
═══════════════════════════════════════════ */
const EMAILJS_PUBLIC_KEY   = 'iLHoFPv6a85KxfxQf';
const EMAILJS_SERVICE_ID   = 'service_eo55arx';
const EMAILJS_TEMPLATE_ID  = 'template_sdiku7l';

(function () { emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY }); })();

if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  const notice = document.getElementById('setupNotice');
  if (notice) notice.style.display = 'none';
}

document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn      = document.getElementById('submitBtn');
  const btnText  = document.getElementById('btnText');
  const btnArrow = document.getElementById('btnArrow');
  const success  = document.getElementById('formSuccess');
  const error    = document.getElementById('formError');

  success.classList.remove('show');
  error.classList.remove('show');

  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    error.textContent = '⚙ EmailJS not configured yet.';
    error.classList.add('show');
    return;
  }

  btn.disabled = true;
  btn.classList.add('loading');
  btnText.textContent = 'Sending...';
  btnArrow.style.display = 'none';

  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
    .then(() => {
      btn.classList.remove('loading');
      btnText.textContent = 'Sent!';
      success.classList.add('show');
      this.reset();
      setTimeout(() => {
        btn.disabled = false;
        btnText.textContent = 'Send Message';
        btnArrow.style.display = '';
        success.classList.remove('show');
      }, 5000);
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      btn.classList.remove('loading');
      btn.disabled = false;
      btnText.textContent = 'Send Message';
      btnArrow.style.display = '';
      error.textContent = '✕ Failed to send. Please email me directly.';
      error.classList.add('show');
      setTimeout(() => error.classList.remove('show'), 6000);
    });
});
