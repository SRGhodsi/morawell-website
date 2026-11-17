/* MoraWell GA4 — optional, consent-first analytics for public pages.
 * Only load Google's script after the visitor explicitly accepts analytics.
 * Never send inputs, query strings, hash fragments, interview answers or case identifiers.
 * This file is intentionally separate from the Decision DNA app.js.
 */
(function () {
  'use strict';
  const MEASUREMENT_ID = 'G-N0R69YYB19';
  const STORAGE_KEY = 'morawell_analytics_consent_v1';
  let analyticsStarted = false;

  function loadSavedChoice() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (_e) { return null; }
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(STORAGE_KEY, choice); } catch (_e) { /* Storage may be disabled */ }
  }

  function cleanUrl(urlString) {
    if (!urlString) return '';
    try {
      const url = new URL(urlString, location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return '';
      return url.origin + url.pathname;
    } catch (_e) { return ''; }
  }

  function beginAnalytics() {
    if (analyticsStarted) return;
    analyticsStarted = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    const safeLocation = cleanUrl(window.location.href);
    const safeReferrer = cleanUrl(document.referrer);

    // Basic consent mode: Google tag is NOT loaded before consent.
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('set', {
      page_location: safeLocation,
      page_referrer: safeReferrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      page_location: safeLocation,
      page_referrer: safeReferrer,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    window.gtag('event', 'page_view', {
      page_location: safeLocation,
      page_referrer: safeReferrer,
      page_title: document.title
    });

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    tag.referrerPolicy = 'no-referrer';
    document.head.appendChild(tag);
  }

  function createButton(label, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function showChoices() {
    const old = document.getElementById('morawell-analytics-consent');
    if (old) old.remove();
    const banner = document.createElement('section');
    banner.id = 'morawell-analytics-consent';
    banner.className = 'mw-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics preference');

    const content = document.createElement('div');
    content.className = 'mw-consent-content';
    const heading = document.createElement('strong');
    heading.textContent = 'Optional website analytics';
    const description = document.createElement('p');
    description.textContent = 'May we use Google Analytics to understand visits to our public pages? Analytics is off until you accept. You can change this choice later.';
    content.append(heading, description);

    const actions = document.createElement('div');
    actions.className = 'mw-consent-actions';
    actions.append(
      createButton('Decline', 'mw-consent-button mw-consent-decline', function () { setChoice('declined'); }),
      createButton('Accept analytics', 'mw-consent-button mw-consent-accept', function () { setChoice('accepted'); })
    );
    banner.append(content, actions);
    document.body.appendChild(banner);
  }

  function setChoice(choice) {
    const old = loadSavedChoice();
    saveChoice(choice);
    document.getElementById('morawell-analytics-consent')?.remove();
    if (choice === 'accepted') {
      beginAnalytics();
    } else if (old === 'accepted' && analyticsStarted) {
      // Unload tags and stop future measurement on this page after revocation.
      // Basic consent mode does not transmit 'denied' pings: reload into tag-free state.
      location.reload();
    }
  }

  function addPreferenceButton() {
    const button = createButton('Analytics preferences', 'mw-consent-settings', showChoices);
    button.setAttribute('aria-label', 'Change analytics preferences');
    document.body.appendChild(button);
  }

  function start() {
    addPreferenceButton();
    const choice = loadSavedChoice();
    if (choice === 'accepted') beginAnalytics();
    else if (choice !== 'declined') showChoices();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
