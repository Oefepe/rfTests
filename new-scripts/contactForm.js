(function ($) {
  'use strict';

  // ============================================================
  // Contact Form v2 — Two-Part Script (Updated)
  //
  // Differences from contactFormGdpr.js:
  //  - Part 1 listens on form submit, not button click
  //  - Part 1 sets both window.validationComplete AND
  //    window.VALIDATION_PASSED for stricter gating
  //  - Part 2 locates the submit button generically via
  //    .form-container form button[type="submit"]
  //  - GDPR fields are NOT cleared after a successful submission
  // ============================================================

  var LOG = '[ContactFormV2]';
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

  function getSubmitButton() {
    return document.querySelector('.form-container form button[type="submit"], .form-container form input[type="submit"]');
  }

  function setButtonLoading(loading) {
    var btn = getSubmitButton();
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Submitting...' : 'Submit';
  }

  function resetState() {
    window.validationComplete  = false;
    window.VALIDATION_PASSED   = false;
    window.isValidating        = false;
  }

  // ── Part 1: Validation ─────────────────────────────────────────────────────

  $(function () {
    var $form = $('.form-container form');

    if (!$form.length) {
      console.warn(LOG, '.form-container form not found — Part 1 skipped.');
      return;
    }

    $form.on('submit', function (e) {
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
      window.isValidating       = true;
      window.validationComplete = true;
      window.VALIDATION_PASSED  = true;

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

  if (!window.validationComplete) {
    console.log(LOG, 'Part 2 loaded — waiting for Part 1 to complete validation.');
  }

  var isSubmitting = false;

  window.createContactAfterValidation = function () {
    console.log(LOG, 'Part 2 — createContactAfterValidation called.');

    if (!window.validationComplete || !window.VALIDATION_PASSED) {
      console.error(LOG, 'Part 2 called without both validation flags set. Aborting.');
      console.error(LOG, 'validationComplete:', window.validationComplete, '| VALIDATION_PASSED:', window.VALIDATION_PASSED);
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

    var params     = getUrlParams();
    var $container = $('#contactFormContainer');

    if (!$container.length) {
      console.error(LOG, '#contactFormContainer not found.');
      alert('Form configuration error. Please contact support.');
      isSubmitting = false;
      resetState();
      setButtonLoading(false);
      return;
    }

    var campaignId  = $container.attr('data-campaign') || $container.data('campaign') || '';
    var labelId     = $container.attr('data-label')    || $container.data('label')    || '';
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
              'userId='      + encodeURIComponent(params.userId) +
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
