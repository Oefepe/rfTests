(function ($) {
  'use strict';

  var LOG = '[BookMe]';
  var checkCount = 0;
  var maxChecks = 20;
  var checkInterval = 500;
  var pollTimer = null;
  var foundBookingLink = false;

  function init() {
    var $btn = $('#customBookingLink');

    if (!$btn.length) {
      console.warn(LOG, '#customBookingLink not found on page');
      return;
    }

    // Initially hide the button
    $btn.hide();

    function getBookingLink() {
      // Check window.sharedData (set by userDetails.js)
      if (window.sharedData && window.sharedData.customBookingLink) {
        var link = window.sharedData.customBookingLink;
        if (link && link !== '#' && link.trim() !== '') {
          return link;
        }
      }

      // Check href attribute on the button itself
      var href = $btn.attr('href');
      if (href && href !== '#' && href.trim() !== '') {
        return href;
      }

      return null;
    }

    function checkAndShowButton() {
      checkCount++;
      var bookingLink = getBookingLink();

      if (bookingLink) {
        foundBookingLink = true;

        // Stop polling once found
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }

        console.log(LOG, 'Booking link found, showing button');
        $btn.show();
      } else {
        $btn.hide();
      }
    }

    // Listen for the customBookingLinkUpdated event
    $(document).on('customBookingLinkUpdated', function () {
      checkAndShowButton();
    });

    // Run initial check
    checkAndShowButton();

    // Start polling if not found yet
    if (!foundBookingLink) {
      pollTimer = setInterval(function() {
        if (foundBookingLink) {
          clearInterval(pollTimer);
          pollTimer = null;
          return;
        }

        if (checkCount >= maxChecks) {
          clearInterval(pollTimer);
          pollTimer = null;
          console.warn(LOG, 'Booking link not found after polling');
          return;
        }

        checkAndShowButton();
      }, checkInterval);
    }
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
