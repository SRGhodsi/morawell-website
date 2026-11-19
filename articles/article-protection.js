/* Deterrent only: public HTML cannot be protected against all copying. */
(function () {
  'use strict';
  const body = document.querySelector('.mw-article-body');
  if (!body) return;
  body.addEventListener('copy', function (event) { event.preventDefault(); });
  body.addEventListener('cut', function (event) { event.preventDefault(); });
  body.addEventListener('contextmenu', function (event) { event.preventDefault(); });
})();
