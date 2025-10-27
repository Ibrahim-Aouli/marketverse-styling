/* =======================================================
   MARKETVERSE — CORE JS FRAMEWORK
   Version: 1.0.0
   ======================================================= */

(function(){
  'use strict';

  const MV = {
    // Tabs
    initTabs(){
      document.querySelectorAll('[data-tabs]').forEach(group=>{
        const tabs = group.querySelectorAll('.mv-tab');
        const panels = group.querySelectorAll('.mv-tabpanel');
        tabs.forEach(tab=>{
          tab.addEventListener('click',()=>{
            const target = tab.getAttribute('data-tab');
            tabs.forEach(t=>t.classList.remove('is-active'));
            panels.forEach(p=>p.classList.remove('is-active'));
            tab.classList.add('is-active');
            const panel = group.querySelector('[data-panel="'+target+'"]');
            if(panel) panel.classList.add('is-active');
          });
        });
      });
    },

    // Loading button
    initLoadingButtons(){
      document.querySelectorAll('[data-loading]').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const original = btn.textContent;
          btn.disabled = true;
          btn.textContent = 'Running…';
          setTimeout(()=>{
            btn.disabled = false;
            btn.textContent = original;
          },1500);
        });
      });
    },

    // Toast notifications
    toast(msg="Action complete",duration=1600){
      let toast=document.createElement('div');
      toast.className='mv-toast';
      toast.textContent=msg;
      document.body.appendChild(toast);
      requestAnimationFrame(()=>toast.classList.add('is-visible'));
      setTimeout(()=>toast.classList.remove('is-visible'),duration);
      setTimeout(()=>toast.remove(),duration+500);
    },

    // Copy helper
    copy(text){
      navigator.clipboard.writeText(text).then(()=>MV.toast('Copied to clipboard!'));
    },

    // Fake progress
    initProgress(){
      const startBtn=document.getElementById('startJobBtn');
      const bar=document.getElementById('progressBar');
      const label=document.getElementById('progressLabel');
      if(!startBtn||!bar||!label)return;
      startBtn.addEventListener('click',()=>{
        let p=0;
        bar.style.width='0%';
        label.textContent='0%';
        const iv=setInterval(()=>{
          p+=Math.random()*12;
          if(p>=100){p=100;clearInterval(iv);}
          bar.style.width=p.toFixed(0)+'%';
          label.textContent=p.toFixed(0)+'%';
        },250);
      });
    },

    // Countdown timers
    initCountdowns(){
      setInterval(()=>{
        const now=Math.floor(Date.now()/1000);
        document.querySelectorAll('[data-next-ts]').forEach(el=>{
          const ts=parseInt(el.getAttribute('data-next-ts'));
          const label=el.querySelector('.mv-countdown');
          if(!ts||!label)return;
          const diff=ts-now;
          if(diff<=0){label.textContent=' (running soon)';return;}
          const m=Math.floor(diff/60),s=diff%60;
          label.textContent=` (${m}m ${s}s remaining)`;
        });
      },1000);
    },

    // =======================================================
    // LOG VIEWER
    // =======================================================
    logViewer: {
      el: null,
      lastCount: 0,

      init(selector = '#mv-log') {
        this.el = document.querySelector(selector);
        if (!this.el) return;
        this.refresh(true);
        setInterval(() => this.refresh(), 5000);
      },

      async refresh(force = false) {
        if (!this.el) return;
        const fd = new FormData();
        fd.append('action', 'mv_sws_get_logs');
        fd.append('_ajax_nonce', window.MVSWS?.nonce || '');

        try {
          const r = await fetch(window.MVSWS?.ajaxurl || 'admin-ajax.php', { method: 'POST', body: fd });
          const j = await r.json();
          const logs = j?.data?.logs || [];
          if (!force && logs.length === this.lastCount) return;
          this.lastCount = logs.length;
          this.render(logs);
        } catch (err) {
          console.error('Error refreshing logs', err);
        }
      },

      render(logs) {
        if (!logs.length) {
          this.el.innerHTML = '<div class="mv-log-empty">No log entries yet.</div>';
          return;
        }

        const iconMap = {
          info: 'ℹ️',
          success: '✔️',
          warn: '⚠️',
          error: '❌',
          sync: '🔄',
          system: '💻',
          action: '⚙️'
        };

        const frag = document.createDocumentFragment();
        logs.forEach(log => {
          const wrap = document.createElement('div');
          wrap.className = 'mv-log-item';
          wrap.dataset.type = log.type || 'info';
          wrap.addEventListener('click', () => wrap.classList.toggle('is-expanded'));

          const head = document.createElement('div');
          head.className = 'mv-log-summary';
          head.innerHTML = `
            <span class="mv-log-icon">${iconMap[log.type] || '▶️'}</span>
            <span class="mv-log-time">${log.time}</span>
            <span class="mv-log-label">${log.label}</span>
          `;

          wrap.appendChild(head);

          if (log.data && log.data !== 'null' && log.data !== '') {
            const details = document.createElement('pre');
            details.className = 'mv-log-details';
            details.textContent =
              typeof log.data === 'object'
                ? JSON.stringify(log.data, null, 2)
                : log.data;
            wrap.appendChild(details);
          }

          frag.appendChild(wrap);
        });

        this.el.innerHTML = '';
        this.el.appendChild(frag);
      }
    }
  };

  // Init everything on DOM ready
  document.addEventListener('DOMContentLoaded',()=>{
    MV.initTabs();
    MV.initLoadingButtons();
    MV.initProgress();
    MV.initCountdowns();
    MV.logViewer.init();
  });

  window.MarketVerse = MV;
})();
