(function ($) {
  'use strict';

  var LOG = '[PlaceholderScript]';

  function init() {
    var userId, contactId;

    try {
      var parsed = new URL(window.location.href);
      userId    = parsed.searchParams.get('userId')    || '';
      contactId = parsed.searchParams.get('contactId') || '';
    } catch (e) {
      console.error(LOG, 'Could not parse current URL:', e);
      return;
    }

    console.log(LOG, 'Replacing placeholders — userId:', userId, '| contactId:', contactId);

    var replaced = 0;

    $('a[href]').each(function () {
      var original = $(this).attr('href');

      if (!original || typeof original !== 'string') return;

      var updated = original
        .replace(/\[user-id\]/g,   userId)
        .replace(/\[userId\]/g,    userId)
        .replace(/\[contactId\]/g, contactId);

      if (updated !== original) {
        $(this).attr('href', updated);
        replaced++;
      }
    });

    console.log(LOG, 'Done. ' + replaced + ' link(s) updated.');
  }

  // Safe initialization - works with dynamic script injection
  function safeInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      // DOM already loaded, execute immediately
      init();
    }
  }

  // Check if jQuery is available, otherwise wait for it
  if (typeof jQuery !== 'undefined') {
    safeInit();
  } else {
    // Wait for jQuery to load
    var checkJQuery = setInterval(function() {
      if (typeof jQuery !== 'undefined') {
        clearInterval(checkJQuery);
        safeInit();
      }
    }, 50);
  }

}(typeof jQuery !== 'undefined' ? jQuery : null));
