(function ($) {
  'use strict';

  var LOG = '[Branding]';

  // Maps API response fields to their target CSS classes
  var COLOR_MAP = {
    primaryColor:        '.rf_primaryColor',
    primaryColorOffset:  '.rf_primaryColorOff',
    secondaryColor:      '.rf_secondaryColor',
    secondaryColorOffset:'.rf_secondaryColorOff',
    tertiaryColor:       '.rf_tertiaryColor',
    tertiaryColorOffset: '.rf_tertiaryColorOff'
  };

  function applyBranding(data) {
    Object.keys(COLOR_MAP).forEach(function (field) {
      var value = data[field];
      if (value && typeof value === 'string' && value.trim() !== '') {
        $(COLOR_MAP[field]).css('background', value.trim());
        console.log(LOG, field + ' applied:', value);
      }
    });

    // "Powered by RF" logo — show by default, hide if flag is set
    var $logo = $('#pbrf_logo');
    if ($logo.length) {
      if (data.hidePoweredByRFLogoOnResources === true) {
        $logo.hide();
        console.log(LOG, '"Powered by RF" logo hidden.');
      } else {
        $logo.show();
      }
    }
  }

  $(function () {
    var userId;

    try {
      userId = new URL(window.location.href).searchParams.get('userId');
    } catch (e) {
      console.error(LOG, 'Could not parse current URL:', e);
      return;
    }

    if (!userId) {
      console.warn(LOG, 'No userId in URL — branding skipped.');
      return;
    }

    $.ajax({
      url: 'https://app.rapidfunnel.com/api/branding/user/' + encodeURIComponent(userId),
      type: 'GET',
      dataType: 'json',
      timeout: 8000,
      success: function (response) {
        if (!response || response.status !== 0 || !response.data) {
          console.warn(LOG, 'Invalid or unsuccessful branding response:', response);
          return;
        }
        applyBranding(response.data);
      },
      error: function (xhr, status, error) {
        console.error(LOG, 'Failed to fetch branding data — status:', status, '| error:', error);
      }
    });
  });

}(jQuery));
