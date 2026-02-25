(function ($) {
  'use strict';

  var LOG = '[CtaResourceButton]';

  function getUrlParams() {
    try {
      var parsed = new URL(window.location.href);
      return {
        userId:    parsed.searchParams.get('userId')    || '',
        contactId: parsed.searchParams.get('contactId') || ''
      };
    } catch (e) {
      console.error(LOG, 'Could not parse URL:', e);
      return { userId: '', contactId: '' };
    }
  }

  function redirect(url, target) {
    if (!url || url === '#') return;
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }

  function disableButton($btn) {
    $btn.attr('href', '#').prop('disabled', true).addClass('disabled');
  }

  function updateButtonHref($btn, params) {
    var resourceId = $btn.attr('data-cta-resource-id');

    if (!resourceId) {
      console.warn(LOG, 'Missing data-cta-resource-id on:', $btn.attr('id'));
      disableButton($btn);
      return;
    }

    $.ajax({
      url: 'https://app.rapidfunnel.com/api/api/resources/resource-details/',
      type: 'GET',
      dataType: 'json',
      timeout: 8000,
      data: {
        userId:     params.userId,
        resourceId: resourceId,
        contactId:  params.contactId
      },
      success: function (response) {
        if (response && response.data && response.data.resourceUrl) {
          var url = response.data.resourceUrl;
          if (url.slice(-1) !== '/') url += '/';
          url += params.userId;
          if (params.contactId) url += '/' + params.contactId;
          $btn.attr('href', url).removeClass('disabled');
          console.log(LOG, 'href updated for', $btn.attr('id'), '->', url);
        } else {
          console.warn(LOG, 'No resourceUrl in response for:', resourceId);
          disableButton($btn);
        }
      },
      error: function (xhr, status, error) {
        console.error(LOG, 'Failed to fetch resource URL for', resourceId, '— status:', status, '| error:', error);
        disableButton($btn);
      }
    });
  }

  function handleClick($btn, params) {
    var location    = $btn.attr('data-cta-res-location') || $btn.attr('id') || '';
    var redirectUrl = $btn.attr('href') || '';
    var target      = $btn.attr('target') || '_self';
    var pageName    = document.title || 'Unknown Page';

    if (!params.contactId) {
      redirect(redirectUrl, target);
      return;
    }

    $.ajax({
      url: 'https://apiv2.rapidfunnel.com/v2/contact-details/' + encodeURIComponent(params.contactId),
      type: 'GET',
      dataType: 'json',
      timeout: 5000,
      success: function (response) {
        var d = (response && response.data) ? response.data : {};

        $.ajax({
          url: 'https://app.rapidfunnel.com/api/mail/send-cta-email',
          type: 'POST',
          contentType: 'application/json',
          dataType: 'json',
          timeout: 8000,
          data: JSON.stringify({
            legacyUserId:       Number(params.userId) || 0,
            contactFirstName:   d.firstName  || '',
            contactLastName:    d.lastName   || '',
            contactPhoneNumber: d.phone      || '',
            contactEmail:       d.email      || '',
            ctaLocation:        location,
            ctaPageName:        pageName
          }),
          complete: function () {
            redirect(redirectUrl, target);
          }
        });
      },
      error: function () {
        console.error(LOG, 'Failed to fetch contact details — redirecting anyway.');
        redirect(redirectUrl, target);
      }
    });
  }

  $(function () {
    var params   = getUrlParams();
    var $buttons = $('[id^="ctaResourceButton"]');

    if (!$buttons.length) {
      console.warn(LOG, 'No CTA resource buttons found on page.');
      return;
    }

    console.log(LOG, 'Found', $buttons.length, 'resource button(s). Resolving hrefs...');

    // Resolve each button's href on load
    $buttons.each(function () {
      updateButtonHref($(this), params);
    });

    var isProcessing = false;

    // Handle clicks
    $buttons.on('click', function (e) {
      e.preventDefault();

      if (isProcessing) {
        console.warn(LOG, 'Click already being processed.');
        return;
      }

      var $btn = $(this);

      if ($btn.hasClass('disabled')) {
        console.warn(LOG, 'Button is disabled — click ignored.');
        return;
      }

      isProcessing = true;
      console.log(LOG, 'Clicked:', $btn.attr('id'));

      handleClick($btn, params);

      // Reset processing flag after a short delay to allow redirect to fire
      setTimeout(function () { isProcessing = false; }, 3000);
    });

    console.log(LOG, 'CTA resource button tracking initialized.');
  });

}(jQuery));
