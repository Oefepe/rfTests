(function ($) {
  'use strict';

  // ============================================================
  // Contact Form GDPR — Two-Part Script
  //
  // Part 1: Validates form fields and GDPR consent, then hands
  //         off to Part 2 via window.createContactAfterValidation().
  //
  // Part 2: Creates the RapidFunnel contact via API after
  //         Part 1 confirms validation is complete.
  // ============================================================

  var LOG = '[ContactFormGdpr]';
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ── Helpers ────────────────────────────────────────────────────────────────

  function getUrlParams() {
    try {
      var parsed = new URL(window.location.href);
      return {
        userId:     parsed.searchParams.get('userId')     || '',
        resourceId: parsed.searchParams.get('resourceId') || ''
      };
    } catch (e) {
      console.error(LOG, 'Could not parse URL:', e);
      return { userId: '', resourceId: '' };
    }
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  }

  function setButtonLoading(loading) {
    var $btn = $('#contactFormSubmitBtn');
    $btn.prop('disabled', loading);
    $btn.find('.btn-text').toggle(!loading);
    $btn.find('.spinner').toggle(loading);
  }

  function resetState() {
    window.validationComplete = false;
    window.isValidating = false;
  }

  // ── Part 1: Validation ─────────────────────────────────────────────────────

  $(function () {
    var $btn = $('#contactFormSubmitBtn');

    if (!$btn.length) {
      console.warn(LOG, '#contactFormSubmitBtn not found — Part 1 skipped.');
      return;
    }

    $btn.on('click', function (e) {
      e.preventDefault();

      if (window.isValidating) {
        console.warn(LOG, 'Validation already in progress.');
        return;
      }

      var firstName = $('#contactFirstName').val().trim();
      var lastName  = $('#contactLastName').val().trim();
      var email     = $('#contactEmail').val().trim();
      var phone     = $('#contactPhone').val().trim();
      var gdpr      = $('#gdprConsent').is(':checked');

      var errors = [];
      if (!firstName)                        errors.push('First Name');
      if (!lastName)                         errors.push('Last Name');
      if (!email)                            errors.push('Email');
      if (email && !EMAIL_REGEX.test(email)) errors.push('Email (invalid format)');
      if (!phone)                            errors.push('Phone');
      if (!gdpr)                             errors.push('GDPR consent (required)');

      if (errors.length > 0) {
        alert('Please correct the following:\n- ' + errors.join('\n- '));
        return;
      }

      console.log(LOG, 'Part 1 — Validation passed. Handing off to Part 2.');
      window.isValidating = true;
      window.validationComplete = true;

      if (typeof window.createContactAfterValidation === 'function') {
        window.createContactAfterValidation();
      } else {
        console.error(LOG, 'window.createContactAfterValidation is not defined. Is Part 2 loaded?');
        resetState();
      }
    });

    console.log(LOG, 'Part 1 (validation) initialized.');
  });

  // ── Part 2: Contact Creation ───────────────────────────────────────────────

  // Guard: only proceed if Part 1 has already set validationComplete
  if (!window.validationComplete) {
    console.log(LOG, 'Part 2 loaded — waiting for Part 1 to complete validation.');
  }

  var isSubmitting = false;

  window.createContactAfterValidation = function () {
    console.log(LOG, 'Part 2 — createContactAfterValidation called.');

    if (!window.validationComplete) {
      console.error(LOG, 'Part 2 called without validation being complete. Aborting.');
      alert('Validation error. Please try submitting the form again.');
      resetState();
      return;
    }

    if (isSubmitting) {
      console.warn(LOG, 'Submission already in progress.');
      return;
    }

    isSubmitting = true;
    setButtonLoading(true);

    var params = getUrlParams();
    var $container = $('#contactFormContainer');

    if (!$container.length) {
      console.error(LOG, '#contactFormContainer not found.');
      alert('Form configuration error. Please contact support.');
      isSubmitting = false;
      resetState();
      setButtonLoading(false);
      return;
    }

    var campaignId = $container.attr('data-campaign') || $container.data('campaign') || '';
    var labelId    = $container.attr('data-label')    || $container.data('label')    || '';
    var redirectUrl = $container.attr('data-redirect') || '';

    if (!campaignId || campaignId === 'YOUR_CAMPAIGN_ID') {
      console.error(LOG, 'Campaign ID is missing or invalid.');
      alert('Form configuration error: Campaign ID is missing or invalid.');
      isSubmitting = false;
      resetState();
      setButtonLoading(false);
      return;
    }

    var firstName = $('#contactFirstName').val().trim();
    var lastName  = $('#contactLastName').val().trim();
    var email     = $('#contactEmail').val().trim();
    var phone     = $('#contactPhone').val().trim();

    var formData = [
      'firstName='  + encodeURIComponent(firstName),
      'lastName='   + encodeURIComponent(lastName),
      'email='      + encodeURIComponent(email),
      'phone='      + encodeURIComponent(phone),
      'campaign='   + encodeURIComponent(campaignId),
      'contactTag=' + encodeURIComponent(labelId)
    ].join('&');

    console.log(LOG, 'Submitting contact to API...');

    $.ajax({
      url: 'https://my.rapidfunnel.com/landing/resource/create-custom-contact',
      method: 'POST',
      dataType: 'json',
      timeout: 10000,
      data: {
        formData:   formData,
        resourceId: params.resourceId,
        senderId:   params.userId,
        sentFrom:   'customPage'
      },
      success: function (response) {
        isSubmitting = false;
        resetState();
        console.log(LOG, 'API response:', response);

        if (response && response.contactId > 0) {
          console.log(LOG, 'Contact created. ID:', response.contactId);

          if (redirectUrl && isValidUrl(redirectUrl)) {
            var separator = redirectUrl.includes('?') ? '&' : '?';
            var finalUrl  = redirectUrl + separator +
              'userId='     + encodeURIComponent(params.userId) +
              '&resourceId=' + encodeURIComponent(params.resourceId) +
              '&contactId='  + encodeURIComponent(response.contactId);
            console.log(LOG, 'Redirecting to:', finalUrl);
            window.location.href = finalUrl;
          } else {
            alert('Form submitted successfully!');
            setButtonLoading(false);
            $('#contactFirstName').val('');
            $('#contactLastName').val('');
            $('#contactEmail').val('');
            $('#contactPhone').val('');
            $('#gdprConsent').prop('checked', false);
            $('#marketingConsent').prop('checked', false);
          }
        } else {
          console.error(LOG, 'Contact was not created. Response:', response);
          alert('Error: Contact could not be created. Please try again.');
          setButtonLoading(false);
        }
      },
      error: function (xhr, status, error) {
        isSubmitting = false;
        resetState();
        console.error(LOG, 'API request failed — status:', status, '| error:', error);
        alert('Error submitting the form. Please try again.');
        setButtonLoading(false);
      }
    });
  };

  console.log(LOG, 'Part 2 (contact creation) registered.');

}(jQuery));
