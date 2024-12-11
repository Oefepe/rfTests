jQuery(function ($) {
    // Parse the URL to extract userId, resourceID, and contactId
    const parsedUrl = new URL(window.location.href);
    const userId = parsedUrl.searchParams.get('userId');
    const resourceId = parsedUrl.searchParams.get('resourceId');
    const contactId = parsedUrl.searchParams.get('contactId');
  
    console.log('User ID: ' + userId);
    console.log('Resource ID: ' + resourceId);
    console.log('Contact ID: ' + contactId);
  
    // Capture and format the redirect URL immediately
    let contactFormLink = $('#contactForm').attr('redirect') || $('#contactForm').data('redirect');
    let originalContactFormLink = contactFormLink;
    if (contactFormLink) {
      // Format the redirect URL with the dynamic values
      contactFormLink = contactFormLink
        .replace('[user-id]', userId || '')
        .replace('[resourceID]', resourceId || '')
        .replace('[contactId]', contactId || '');
      
      console.log('Formatted Redirect URL:', contactFormLink);
  
      // Remove redirect attributes immediately to prevent Webflow's default behavior
      $('#contactForm').removeAttr('redirect').removeAttr('data-redirect');
    }
  
    // If contactId exists, make an API call to get contact details
    if (contactId) {
      $('#contactEmail').prop('disabled', true); // Disable the email input field
      $('label[for="contactEmail"]').css('color', '#aaa');
      
      $.get(
        'https://apiv2.rapidfunnel.com/v2/contact-details/' + contactId,
        function (response) {
          const contactData = response.data;
  
          // Populate the form with contact details
          $('#contactFirstName').val(contactData.firstName);
          $('#contactLastName').val(contactData.lastName);
          $('#contactEmail').val(contactData.email);
          $('#contactPhone').val(contactData.phone);
        }
      ).fail(function () {
        console.error('Failed to fetch contact details.');
      });
    } else {
      console.log('No contactId found in the URL.');
    }
  
    // Handle form submission
    $('#contactForm').on('submit', function (event) {
      event.preventDefault(); // Prevent the default form submission behavior
      const submitButton = $('#submitButton');
      submitButton.attr('disabled', true);
  
      // Collect form data
      const formData = {
        firstName: $('#contactFirstName').val(),
        lastName: $('#contactLastName').val(),
        email: $('#contactEmail').val(),
        phone: $('#contactPhone').val(),
        campaign: assignCampaignId || '', // Ensure assignCampaignId is defined
        contactTag: labelId || '',        // Ensure labelId is defined
        streetaddress: 'testStreet',
        city: 'Denver',
        pincode: '80401',
      };
  
      // Submit the form data to the API
      $.ajax({
        url: 'https://my.rapidfunnel.com/landing/resource/create-custom-contact',
        method: 'POST',
        dataType: 'json',
        data: {
          formData: formData,
          resourceId: resourceId,
          senderId: userId,
          sentFrom: 'customPage',
        },
        success: function (response) {
          console.log(response);
          if (response.contactId > 0) {
            alert('Form submitted successfully!');
  
            contactFormLink = originalContactFormLink
              .replace('[user-id]', userId || '')
              .replace('[resourceID]', resourceId || '')
              .replace('[contactId]', response.contactId || '');
  
            if (contactFormLink) {
              window.location.href = contactFormLink;
            }
          } else {
            alert('A contact could not be added!');
            submitButton.attr('disabled', false); // Re-enable the button
          }
        },
        error: function (error) {
          alert('Error submitting the form.');
          console.error(error);
          submitButton.attr('disabled', false); // Re-enable the button
        },
      });
    });
  });