(() => {
  'use strict';

  let deferredPrompt = null;
  const isAdmin = /\/admin\.html$/i.test(location.pathname);
  const label = isAdmin ? 'تثبيت لوحة الإدارة' : 'تثبيت بوابة نور';

  const isStandalone = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

  function createInstallButton() {
    if (document.getElementById('pwaInstallButton') || isStandalone()) return null;

    const button = document.createElement('button');
    button.id = 'pwaInstallButton';
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-label', label);

    Object.assign(button.style, {
      position: 'fixed',
      left: '16px',
      bottom: '16px',
      zIndex: '9999',
      border: '0',
      borderRadius: '14px',
      padding: '13px 17px',
      background: '#4f46e5',
      color: '#ffffff',
      fontWeight: '800',
      fontFamily: 'inherit',
      boxShadow: '0 10px 24px rgba(15,23,42,.25)',
      cursor: 'pointer'
    });

    button.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (choice.outcome === 'accepted') button.remove();
        return;
      }

      if (isIOS()) {
        alert('لتثبيت بوابة نور: افتح الصفحة في Safari، ثم اضغط زر المشاركة، واختر «إضافة إلى الشاشة الرئيسية».');
      } else {
        alert('لتثبيت بوابة نور: افتح قائمة المتصفح، ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».');
      }
    });

    document.body.appendChild(button);
    return button;
  }

  // Create a visible button on every public page. If the browser provides the
  // native prompt, the same button uses it. Otherwise it shows manual steps.
  window.addEventListener('DOMContentLoaded', createInstallButton);

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    createInstallButton();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    document.getElementById('pwaInstallButton')?.remove();
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./service-worker.js', { scope: './' })
        .catch(error => console.error('Service Worker registration failed:', error));
    });
  }
})();
