// Shared tab switcher for subnav on concept pages (Intro / working area / etc.)
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.style.display = (panel.id === 'tab-' + target) ? '' : 'none';
      });
    });
  });
});
