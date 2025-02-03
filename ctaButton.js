jQuery(function ($) {
    // Parse the URL to extract userId, resourceID, and contactId
    const parsedUrl = new URL(window.location.href);
    const userId = parsedUrl.searchParams.get('userId');
    const resourceId = parsedUrl.searchParams.get('resourceId');
    const contactId = parsedUrl.searchParams.get('contactId');
  
    function handleCtaConversion(buttonId) {
      const redirectUrl = $('#' + buttonId).attr('href');
      const target = $('#' + buttonId).attr('target');
  
      // Check for contact details
      if (contactId) {
        $.get(
          'https://apiv2.rapidfunnel.com/v2/contact-details/' + contactId,
          function (response) {
            const contactData = response.data;
            const numericUserId = Number(userId);
            // Make a POST request to send conversion email
            $.ajax({
              url: 'https://app.rapidfunnel.com/api/mail/send-conversion-email',
              type: 'POST',
              contentType: 'application/json',
              dataType: "json",
              data: JSON.stringify({
                legacyUserId: numericUserId,
                contactFirstName: contactData.firstName,
                contactLastName: contactData.lastName,
                contactPhoneNumber: contactData.phone,
                contactEmail: contactData.email,
                conversionSource: buttonId,
                conversionPageName: pageName
              }),
              success: function (response) {
                console.log('CTA Conversion email sent successfully', response);
                if (target === "_blank") {
                  window.open(redirectUrl, '_blank');
                } else {
                  window.location.href = redirectUrl;
                }
              },
              error: function (xhr, status, error) {
                console.error('CTA Conversion email failed', error);
                if (target === "_blank") {
                  window.open(redirectUrl, '_blank');
                } else {
                  window.location.href = redirectUrl;
                }
              }
            });
          }
        ).fail(function () {
          console.error('Failed to fetch contact details.');
          if (target === "_blank") {
            window.open(redirectUrl, '_blank');
          } else {
            window.location.href = redirectUrl;
          }
        });
      } else {
        if (target === "_blank") {
          window.open(redirectUrl, '_blank');
        } else {
          window.location.href = redirectUrl;
        }
      }
    }
  
    $('[id^="conversionButton"]').on('click', function (event) {
      event.preventDefault(); // Prevent default behavior
      console.log("Clicked Conversion Button:", this.id);
      handleCtaConversion(this.id); // Call the CTA conversion handler
    });
  });
  