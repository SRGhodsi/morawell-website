/* MoraWell sharing — only shares the approved public article URL; no analytics. */
(function () {
  'use strict';
  const title = "Leading Through Whitewater: Rethinking Management When Control Is Limited";
  const url = "https://morawell.com/articles/leading-through-whitewater.html";
  const shareButton = document.getElementById('mw-share-native');
  const copyButton = document.getElementById('mw-copy-link');
  const status = document.getElementById('mw-share-status');
  if (!shareButton || !copyButton || !status) return;
  function updateStatus(message) { status.textContent = message; }
  async function copyLink() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const temporary = document.createElement('textarea');
        temporary.value = url;
        temporary.setAttribute('aria-hidden', 'true');
        temporary.style.position = 'fixed';
        temporary.style.opacity = '0';
        document.body.appendChild(temporary);
        temporary.select();
        const success = document.execCommand('copy');
        temporary.remove();
        if (!success) throw new Error('Copy not available');
      }
      updateStatus('Article link copied.');
    } catch (_error) {
      updateStatus('Copy unavailable. Select the URL in your browser address bar to share it.');
    }
  }
  copyButton.addEventListener('click', copyLink);
  shareButton.addEventListener('click', async function () {
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: title, url: url }); updateStatus('Article shared.'); }
      catch (error) { if (error && error.name !== 'AbortError') await copyLink(); }
    } else { await copyLink(); }
  });
})();
