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
    // First check if jQuery is available
    if (typeof window.jQuery === 'undefined') {
      console.warn(LOG, 'jQuery not loaded yet, waiting...');
      setTimeout(safeInit, 50);
      return;
    }

    // jQuery is available, now check DOM state
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        init();
      });
    } else {
      // DOM already loaded, execute immediately
      init();
    }
  }

  // Start initialization
  safeInit();

}(window.jQuery));
