(function ($) {
  'use strict';

  var LOG = '[BookMe]';

  $(function () {
    var $btn = $('#bookMeBtn');

    if (!$btn.length) {
      console.warn(LOG, '#bookMeBtn not found on page — script skipped.');
      return;
    }

    // Hide on load; visibility is determined by booking link availability
    $btn.hide();

    function checkAndShowButton() {
      var href = $btn.attr('href');
      if (href && href.trim() !== '' && href.trim() !== '#') {
        $btn.show();
        console.log(LOG, 'Button shown with href:', href);
      } else {
        $btn.hide();
        console.log(LOG, 'Button hidden — no valid href.');
      }
    }

    // React to booking link being updated by userDetails.js
    $(document).on('customBookingLinkUpdated', function () {
      console.log(LOG, 'customBookingLinkUpdated event received.');
      checkAndShowButton();
    });

    // Run initial check in case href is already set on load
    checkAndShowButton();
  });

}(jQuery));
