jQuery(function ($) {
    // Parse the URL to extract userId, resourceID, and contactId
    const parsedUrl = new URL(window.location.href);
    const userId = parsedUrl.searchParams.get('userId');
    const resourceId = parsedUrl.searchParams.get('resourceId');
    const contactId = parsedUrl.searchParams.get('contactId');
  
    console.log('User ID:', userId);
    console.log('Resource ID:', resourceId);
    console.log('Contact ID:', contactId);
  
    // Format the redirect URL
    let contactFormLink = $('#contactForm').attr('redirect') || $('#contactForm').data('redirect');
    if (contactFormLink) {
      contactFormLink = contactFormLink
        .replace('[user-id]', userId || '')
        .replace('[resourceID]', resourceId || '')
        .replace('[contactId]', contactId || '');
      console.log('Initial Redirect URL:', contactFormLink);
    }
  
    // Handle form submission
    $('#contactForm').on('submit', function (event) {
      $(':button').attr('disabled', true); // Disable the button to prevent multiple clicks
  
      // Use FormData to gather form inputs
      const form = this;
      const formData = new FormData(form);
      formData.append('resourceId', resourceId || '');
      formData.append('senderId', userId || '');
      formData.append('sentFrom', 'customPage');
  
      // Submit the form data to the API
      $.ajax({
        url: 'https://my.rapidfunnel.com/landing/resource/create-custom-contact',
        method: 'POST',
        processData: false, // Prevent jQuery from processing FormData
        contentType: false, // Let the browser set the content type
        data: formData,
        success: function (response) {
          console.log(response);
          if (response.contactId > 0) {
            alert('Form submitted successfully!');
  
            // Replace placeholders with actual values, including contactId from API response
            const finalRedirectLink = contactFormLink
              .replace('[contactId]', response.contactId || '')
              .replace('[resourceID]', resourceId || '')
              .replace('[user-id]', userId || '');
  
            console.log('Final Redirect URL:', finalRedirectLink);
  
            // Redirect to the dynamically generated URL
            if (finalRedirectLink) {
              window.location.href = finalRedirectLink;
            }
          } else {
            alert('A contact could not be added!');
          }
        },
        error: function (error) {
          alert('Error submitting the form.');
          console.error(error);
        },
      });
    });
  });
  