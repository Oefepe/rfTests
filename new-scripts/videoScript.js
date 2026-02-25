(function ($) {
  'use strict';

  var LOG = '[VideoScript]';

  // ── URL params ──────────────────────────────────────────────────────────────
  var userId, resourceId, contactId;

  try {
    var parsed = new URL(window.location.href);
    userId     = parsed.searchParams.get('userId')     || '';
    resourceId = parsed.searchParams.get('resourceId') || '';
    contactId  = parsed.searchParams.get('contactId')  || '';
  } catch (e) {
    console.error(LOG, 'Could not parse URL:', e);
  }

  // ── Configuration ────────────────────────────────────────────────────────────
  var showBookMeAfterSeconds = (typeof showBookMeAfterTimeInSecondsPassedInVideo !== 'undefined' && showBookMeAfterTimeInSecondsPassedInVideo > 0)
    ? showBookMeAfterTimeInSecondsPassedInVideo
    : 0;

  var webinar = '';

  // ── Booking link helpers ─────────────────────────────────────────────────────
  function checkBookingLink() {
    var href = $('#customBookingLink').attr('href');
    if (href && href.trim() !== '' && href.trim() !== '#') {
      console.log(LOG, 'Booking link present — hiding request call container.');
      $('#requestCallContainer').hide();
    } else {
      console.log(LOG, 'No booking link — showing request call container.');
      $('#requestCallContainer').show();
    }
  }

  // ── SQS analytics push ───────────────────────────────────────────────────────
  function pushToSqs(data) {
    $.ajax({
      url: 'https://my.rapidfunnel.com/landing/resource/push-to-sqs',
      type: 'POST',
      dataType: 'json',
      timeout: 8000,
      data: {
        resourceId:        data.resourceId,
        contactId:         data.contactId,
        userId:            data.userId,
        percentageWatched: data.percentWatched  || 0,
        mediaHash:         data.mediaHash       || '',
        duration:          data.duration        || 0,
        visitorKey:        data.visitorKey      || '',
        eventKey:          data.eventKey        || '',
        delayProcess:      data.delayProcess    || 0,
        webinar:           data.webinar         || '',
        totalSecondsWatched: data.totalSecondsWatched || 0
      },
      success: function (response) {
        if (!response) {
          console.warn(LOG, 'SQS push returned an empty response.');
        } else {
          console.log(LOG, 'Analytics pushed to SQS. Percent:', Math.round(data.percentWatched * 100) + '%, Seconds watched:', data.totalSecondsWatched);
        }
      },
      error: function (xhr, status, error) {
        console.error(LOG, 'SQS push failed — status:', status, '| error:', error);
      }
    });
  }

  // ── Wistia analytics ─────────────────────────────────────────────────────────
  function initVideoAnalytics() {
    var canTrack = contactId && $.isNumeric(resourceId) && $.isNumeric(userId);

    window._wq = window._wq || [];

    _wq.push({
      '_all': function (video) {
        webinar = $('#webinar').val() || '';

        // Hide book-me container until watch threshold is reached
        if (showBookMeAfterSeconds > 0) {
          $('#bookMeContainer').hide();
        }

        if (!canTrack) {
          console.log(LOG, 'Tracking skipped — missing userId, resourceId, or contactId.');
          return;
        }

        // ── Watch session tracking ───────────────────────────────────────────
        var session = {
          startTime:          null,  // Timestamp when play started
          totalSecondsWatched: 0,    // Running total of watched seconds
          lastPosition:       0,     // Last known playback position
          isPlaying:          false, // Current play state
          hasSentData:        false  // Whether we've sent data for this session
        };

        var analyticsData = {
          resourceId:          resourceId,
          contactId:           contactId,
          userId:              userId,
          percentWatched:      0,
          mediaHash:           '',
          duration:            0,
          visitorKey:          '',
          eventKey:            '',
          delayProcess:        0,
          webinar:             webinar,
          totalSecondsWatched: 0
        };

        // Pass viewer email to Wistia if available
        var contactEmail = $('#contactEmail').val();
        if (contactEmail) {
          video.email(contactEmail);
        }

        // ── Helper: Calculate watch time and send to API ──────────────────────
        function sendWatchData() {
          if (session.hasSentData) return; // Prevent duplicate sends

          var currentPercent = video.percentWatched();

          analyticsData.percentWatched      = currentPercent;
          analyticsData.mediaHash           = video.hashedId();
          analyticsData.duration            = video.duration();
          analyticsData.visitorKey          = video.visitorKey();
          analyticsData.eventKey            = video.eventKey();
          analyticsData.totalSecondsWatched = Math.round(session.totalSecondsWatched);
          analyticsData.delayProcess        = 0;

          pushToSqs(analyticsData);
          session.hasSentData = true;

          console.log(LOG, 'Watch session sent. Total watched:', session.totalSecondsWatched + 's', '| Percent:', Math.round(currentPercent * 100) + '%');
        }

        // ── play ───────────────────────────────────────────────────────────────
        video.bind('play', function () {
          if (!session.isPlaying) {
            session.isPlaying = true;
            session.startTime = Date.now();
            session.lastPosition = video.time();
            session.hasSentData = false; // Reset for new play session
            console.log(LOG, 'Playback started at', Math.round(session.lastPosition) + 's');
          }
        });

        // ── pause ──────────────────────────────────────────────────────────────
        video.bind('pause', function () {
          if (session.isPlaying) {
            var currentPosition = video.time();
            var watchedDuration = currentPosition - session.lastPosition;

            // Only count forward progress (prevents seeking backwards from inflating the count)
            if (watchedDuration > 0 && watchedDuration < 10) { // Sanity check: less than 10s jump
              session.totalSecondsWatched += watchedDuration;
            }

            session.isPlaying = false;
            console.log(LOG, 'Paused. Watched', Math.round(watchedDuration) + 's this session. Total:', Math.round(session.totalSecondsWatched) + 's');

            // Send analytics on pause
            sendWatchData();
          }
        });

        // ── end ────────────────────────────────────────────────────────────────
        video.bind('end', function () {
          if (session.isPlaying) {
            var currentPosition = video.time();
            var watchedDuration = currentPosition - session.lastPosition;

            if (watchedDuration > 0 && watchedDuration < 10) {
              session.totalSecondsWatched += watchedDuration;
            }

            session.isPlaying = false;
          }

          // Mark as 100% watched
          analyticsData.percentWatched = 1.0;

          console.log(LOG, 'Video ended. Total watched:', Math.round(session.totalSecondsWatched) + 's');

          // Send final analytics
          session.hasSentData = false; // Allow final send
          sendWatchData();
        });

        // ── secondchange (for book-me trigger only) ────────────────────────────
        video.bind('secondchange', function () {
          var secondsWatched = video.secondsWatched();

          if (showBookMeAfterSeconds > 0 && secondsWatched >= showBookMeAfterSeconds) {
            $('#bookMeContainer').show();
          }
        });

        // ── percentwatchedchanged (logging only) ───────────────────────────────
        video.bind('percentwatchedchanged', function (percent) {
          // Just log major milestones for debugging
          var p = Math.round(percent * 100);
          if (p % 25 === 0 && p > 0) {
            console.log(LOG, 'Milestone:', p + '%');
          }
        });

        // ── Safety: send on page unload ────────────────────────────────────────
        window.addEventListener('beforeunload', function () {
          if (session.isPlaying) {
            var currentPosition = video.time();
            var watchedDuration = currentPosition - session.lastPosition;
            if (watchedDuration > 0 && watchedDuration < 10) {
              session.totalSecondsWatched += watchedDuration;
            }
            // Use synchronous request on unload (last resort)
            session.hasSentData = false;
            analyticsData.percentWatched = video.percentWatched();
            analyticsData.totalSecondsWatched = Math.round(session.totalSecondsWatched);

            // Use navigator.sendBeacon if available for reliability
            if (navigator.sendBeacon) {
              var payload = JSON.stringify({
                resourceId: analyticsData.resourceId,
                contactId: analyticsData.contactId,
                userId: analyticsData.userId,
                percentageWatched: analyticsData.percentWatched,
                mediaHash: video.hashedId(),
                duration: video.duration(),
                visitorKey: video.visitorKey(),
                eventKey: video.eventKey(),
                delayProcess: 0,
                webinar: webinar,
                totalSecondsWatched: analyticsData.totalSecondsWatched
              });
              navigator.sendBeacon('https://my.rapidfunnel.com/landing/resource/push-to-sqs', payload);
              console.log(LOG, 'Sent final analytics via beacon on page unload.');
            }
          }
        });

        console.log(LOG, 'Video tracking initialized for:', video.hashedId());
      }
    });
  }

  // ── Wistia iframe setup ───────────────────────────────────────────────────────
  function setupWistiaIframes() {
    $('iframe').each(function () {
      var src = $(this).attr('src') || '';
      if (src.indexOf('wistia') !== -1) {
        $(this).addClass('wistia_embed').attr('name', 'wistia_embed');
      }
    });
  }

  // ── Init ─────────────────────────────────────────────────────────────────────
  $(function () {
    setupWistiaIframes();
    initVideoAnalytics();
    checkBookingLink();

    // Re-check booking link when userDetails.js fires the update event
    $(document).on('customBookingLinkUpdated', function () {
      console.log(LOG, 'customBookingLinkUpdated received — rechecking booking link.');
      checkBookingLink();
    });

    console.log(LOG, 'Video script initialized (batched analytics mode).');
    console.log(LOG, 'Tracking active:', !!(contactId && $.isNumeric(resourceId) && $.isNumeric(userId)));
    console.log(LOG, 'Show book-me after:', showBookMeAfterSeconds ? showBookMeAfterSeconds + 's' : 'disabled');
  });

}(jQuery));
