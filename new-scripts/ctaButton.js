(function ($) {
  'use strict';

  var LOG = '[CtaButton]';

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

  function getPageName() {
    return $('meta[name="page-name"]').attr('content') ||
           $('meta[property="og:title"]').attr('content') ||
           document.title ||
           'Unknown Page';
  }

  function redirect(url, target) {
    if (!url || url === '#') return;
    if (target === '_blank') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = url;
    }
  }

  function sendCtaEmail(params, contactData, buttonLocation, redirectUrl, target) {
    $.ajax({
      url: 'https://app.rapidfunnel.com/api/mail/send-cta-email',
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      timeout: 8000,
      data: JSON.stringify({
        legacyUserId:        Number(params.userId) || 0,
        contactFirstName:    contactData.firstName    || '',
        contactLastName:     contactData.lastName     || '',
        contactPhoneNumber:  contactData.phone        || '',
        contactEmail:        contactData.email        || '',
        ctaLocation:         buttonLocation,
        ctaPageName:         getPageName()
      }),
      complete: function () {
        // Redirect regardless of email success or failure
        redirect(redirectUrl, target);
      }
    });
  }

  $(function () {
    var params    = getUrlParams();
    var $buttons  = $('a[id^="ctaButton"]');

    if (!$buttons.length) {
      console.warn(LOG, 'No CTA buttons found on page.');
      return;
    }

    console.log(LOG, 'Found', $buttons.length, 'CTA button(s).');

    var isProcessing = false;

    $buttons.on('click', function (e) {
      e.preventDefault();

      if (isProcessing) {
        console.warn(LOG, 'Click already being processed.');
        return;
      }

      isProcessing = true;

      var $btn          = $(this);
      var buttonLocation = $btn.attr('data-description') || $btn.attr('id') || '';
      var redirectUrl    = $btn.attr('href') || '';
      var target         = $btn.attr('target') || '_self';

      console.log(LOG, 'Clicked:', $btn.attr('id'));

      if (params.contactId) {
        $.ajax({
          url: 'https://apiv2.rapidfunnel.com/v2/contact-details/' + encodeURIComponent(params.contactId),
          type: 'GET',
          dataType: 'json',
          timeout: 5000,
          success: function (response) {
            isProcessing = false;
            var contactData = (response && response.data) ? response.data : {};
            sendCtaEmail(params, contactData, buttonLocation, redirectUrl, target);
          },
          error: function () {
            isProcessing = false;
            console.error(LOG, 'Failed to fetch contact details — redirecting anyway.');
            redirect(redirectUrl, target);
          }
        });
      } else {
        isProcessing = false;
        redirect(redirectUrl, target);
      }
    });

    console.log(LOG, 'CTA button tracking initialized.');
  });

}(jQuery));
