jQuery(function ($) {
  // Parse the URL to extract userId, resourceID, and contactId
  const parsedUrl = new URL(window.location.href);
  const userId = parsedUrl.searchParams.get('userId');
  const resourceId = parsedUrl.searchParams.get('resourceId');
  const contactId = parsedUrl.searchParams.get('contactId');

  console.log('User ID: ' + userId);
  console.log('Resource ID: ' + resourceId);
  console.log('Contact ID: ' + contactId);

  let contactFormLink = $('#contactFormSubmitContainer').attr('data-redirect') || $('#contactFormSubmitContainer').data('redirect');
  console.log('contactFormLink', contactFormLink);
  let originalContactFormLink = contactFormLink;

  if (contactFormLink) {
    contactFormLink = contactFormLink
      .replace('[user-id]', userId || '')
      .replace('[resourceID]', resourceId || '')
      .replace('[contactId]', contactId || '');
    console.log('Formatted Redirect URL:', contactFormLink);
  }

  if (contactId) {
    $('#contactEmail').prop('disabled', true);  // Disable the email input field
    $('label[for="email"]').css('color', '#aaa');

    $.get(
      'https://apiv2.rapidfunnel.com/v2/contact-details/' + contactId,
      function (response) {
        const contactData = response.data;
        $('.contactfirstname').val(contactData.firstName);
        $('.contactlastname').val(contactData.lastName);
        $('.contactemail').val(contactData.email);
        $('.contactphone').val(contactData.phone);
        $('.contactnote').val(contactData.note);
      }
    ).fail(function () {
      console.error('Failed to fetch contact details.');
    });
  } else {
    console.log('No contactId found in the URL.');
  }

  $('#contactFormSubmitBtn').on('click', function (event) {
    event.preventDefault(); // Prevent default form submission behavior
    $(':button').attr('disabled', true);

    var formData = 'firstName=' + document.getElementById('contactFirstName').value +
          '&lastName=' + document.getElementById('contactLastName').value +
          '&email=' + document.getElementById('contactEmail').value +
          '&phone=' + document.getElementById('contactPhone').value +
          '&campaign=' + assignCampaignId +
          '&contactTag=' + labelId;

    $.ajax({
      url: 'https://my.rapidfunnel.com/landing/resource/create-custom-contact',
      method: 'POST',
      dataType: "json",
      data: {
        formData: formData,
        resourceId: resourceId,
        senderId: userId,
        sentFrom: 'customPage'
      },
      success: function (response) {
        console.log(response);
        if (response.contactId > 0) {
          alert('Form submitted successfully!');

          contactFormLink = originalContactFormLink
            .replace('[user-id]', userId || '')
            .replace('[resourceID]', resourceId || '')
            .replace('[contactId]', response.contactId || '');
          console.log('Contact Form redirect URL with contactId', contactFormLink);

          // Redirect to the URL only if the contact is successfully created
          if (contactFormLink) {
            window.location.href = contactFormLink;
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
