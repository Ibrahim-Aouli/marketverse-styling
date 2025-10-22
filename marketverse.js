// Simple JS to demo tabs, toast, loading states, and a fake progress job.
(function(){
  // Tabs
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const tabs = group.querySelectorAll('.mv-tab');
    const panels = group.querySelectorAll('.mv-tabpanel');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-tab');
        tabs.forEach(t => t.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));
        tab.classList.add('is-active');
        const panel = group.querySelector('[data-panel="'+target+'"]');
        if(panel) panel.classList.add('is-active');
      });
    });
  });

  // Loading button state
  document.querySelectorAll('[data-loading]').forEach(btn => {
    btn.addEventListener('click', () => {
      const original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Running…';
      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = original;
      }, 1500);
    });
  });

  // Toast
  const toast = document.getElementById('toast');
  const toastBtn = document.getElementById('toastBtn');
  if (toastBtn && toast) {
    toastBtn.addEventListener('click', () => {
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 1600);
    });
  }

  // Fake progress
  const startBtn = document.getElementById('startJobBtn');
  const bar = document.getElementById('progressBar');
  const label = document.getElementById('progressLabel');
  if (startBtn && bar && label) {
    startBtn.addEventListener('click', () => {
      let p = 0;
      bar.style.width = '0%';
      label.textContent = '0%';
      const iv = setInterval(() => {
        p += Math.random() * 12;
        if (p >= 100) { p = 100; clearInterval(iv); }
        bar.style.width = p.toFixed(0) + '%';
        label.textContent = p.toFixed(0) + '%';
      }, 250);
    });
  }
})();
