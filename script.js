// ==========================================================================
// YS STYLING — shared site behaviour
// ==========================================================================

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('is-open'); });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---- Helper: is any modal currently open? ---- */
  function anyModalOpen() {
    return !!document.querySelector('.modal-scrim.is-open');
  }

  /* ---- Homepage arrival popup (Bridal Collection highlight) ---- */
  var arrivalScrim = document.querySelector('[data-popup]');
  if (arrivalScrim) {
    var arrivalShown = sessionStorage.getItem('ysStylingArrivalPopupShown');
    if (!arrivalShown) {
      setTimeout(function () {
        if (!anyModalOpen()) {
          arrivalScrim.classList.add('is-open');
          sessionStorage.setItem('ysStylingArrivalPopupShown', '1');
        }
      }, 900);
    }
    arrivalScrim.querySelectorAll('[data-popup-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { arrivalScrim.classList.remove('is-open'); });
    });
    arrivalScrim.addEventListener('click', function (e) {
      if (e.target === arrivalScrim) arrivalScrim.classList.remove('is-open');
    });
  }

  /* ---- Sitewide newsletter popup: exit-intent OR time-on-site, whichever first ---- */
  var newsletterScrim = document.querySelector('[data-newsletter-popup]');
  if (newsletterScrim) {
    var newsletterShown = sessionStorage.getItem('ysStylingNewsletterPopupShown');
    var timeTrigger;

    function openNewsletter() {
      if (sessionStorage.getItem('ysStylingNewsletterPopupShown')) return;
      if (anyModalOpen()) return;
      newsletterScrim.classList.add('is-open');
      sessionStorage.setItem('ysStylingNewsletterPopupShown', '1');
      window.removeEventListener('mouseout', handleExitIntent);
      clearTimeout(timeTrigger);
    }

    function handleExitIntent(e) {
      if (e.clientY <= 0 && !e.relatedTarget && !e.toElement) {
        openNewsletter();
      }
    }

    if (!newsletterShown) {
      window.addEventListener('mouseout', handleExitIntent);
      timeTrigger = setTimeout(openNewsletter, 50000); // ~50s on site
    }

    newsletterScrim.querySelectorAll('[data-popup-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { newsletterScrim.classList.remove('is-open'); });
    });
    newsletterScrim.addEventListener('click', function (e) {
      if (e.target === newsletterScrim) newsletterScrim.classList.remove('is-open');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-scrim.is-open').forEach(function (s) {
        s.classList.remove('is-open');
      });
    }
  });

  /* ---- Newsletter form: submit to a Google Sheet via Apps Script ----
     SETUP:
        function doPost(e) {
          var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Newsletter')
            || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Newsletter');
          sheet.appendRow([new Date(), e.parameter.email, e.parameter.source || '']);
          return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
            .setMimeType(ContentService.MimeType.JSON);
        }
  ---------------------------------------------------------------- */
  var NEWSLETTER_ENDPOINT = 'https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec';

  document.querySelectorAll('.newsletter-form').forEach(function (form) {
    form.setAttribute('action', NEWSLETTER_ENDPOINT);
    form.setAttribute('method', 'POST');
    form.setAttribute('target', 'hidden_iframe');
    var modalCopy = form.closest('.modal-copy');
    var status = modalCopy ? modalCopy.querySelector('.form-status') : null;
    var scrim = form.closest('.modal-scrim');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function () {
      if (btn) { btn.disabled = true; btn.textContent = 'Subscribing…'; }
      setTimeout(function () {
        if (status) {
          status.textContent = "You're on the list — thank you for subscribing.";
          status.classList.remove('error');
          status.classList.add('success', 'is-visible');
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Subscribe'; }
        setTimeout(function () {
          if (scrim) scrim.classList.remove('is-open');
        }, 1800);
      }, 1000);
    });
  });

  /* ---- Consultation form: submit to a Google Form via hidden iframe ----
     SETUP: create the Google Form, open the three-dot menu ->
     "Get pre-filled link", fill dummy answers for every question, copy
     the link, then:
       - the URL ending "/viewform" becomes GOOGLE_FORM_CONFIG.action
         (swap "/viewform" for "/formResponse")
       - each "entry.123456789=..." in that URL is the field name to
         set below for the matching key.

     NOTE ON GROUPED FIELDS (radios/checkboxes like consultationPreference,
     outfitType, hasInspiration, mattersMost): every option sharing one
     question gets the SAME entry.XXXX id below. The code further down
     applies that id to every matching input, not just one — that's what
     makes checkbox groups send multiple values and radio groups behave
     as a single choice.
  ---------------------------------------------------------------- */
  var GOOGLE_FORM_CONFIG = {
    action: 'https://docs.google.com/forms/d/e/1FAIpQLSfQAOrXZ3CKndxzGuN8jPLhohTF5o0nbS2RBapcS68eTCWPJw/formResponse',
    fields: {
      consultationDate:      'entry.301918440',
      consultationTime:      'entry.2047283683',
      consultationPreference:'entry.1749074624',
      outfitType:             'entry.642053170',
      outfitTypeOther:        'entry.REPLACE_04_other',
      eventDate:              'entry.1931729690',
      eventLocation:          'entry.258476825',
      numberOfLooks:          'entry.532914548',
      desiredVibe:            'entry.1094018331',
      hasInspiration:         'entry.1032471125',
      preferredColours:       'entry.2114356665',
      avoidColours:           'entry.1023564601',
      fitConcerns:            'entry.440123631',
      detailsWanted:          'entry.1685981451',
      mattersMost:            'entry.1327439628',
      mattersMostOther:       'entry.REPLACE_14_other',
      budget:                 'entry.1597507194',
      anythingElse:           'entry.1646345548',
      name:                   'entry.355083793',
      phone:                  'entry.1050026124',
      email:                  'entry.1535651640',
      deliveryDetails:        'entry.1596472226',
      neededByDate:           'entry.1208751537'
    }
  };

  var form = document.querySelector('#consultation-form');
  if (form) {
    Object.keys(GOOGLE_FORM_CONFIG.fields).forEach(function (key) {
      var matches = form.querySelectorAll('[data-field="' + key + '"]');
      matches.forEach(function (el) {
        el.setAttribute('name', GOOGLE_FORM_CONFIG.fields[key]);
      });
    });
    form.setAttribute('action', GOOGLE_FORM_CONFIG.action);

    var cStatus = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', function () {
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Sending…'; }
      setTimeout(function () {
        if (cStatus) {
          cStatus.textContent = 'Thank you — your consultation request has been received. We will reach out within 1–2 business days.';
          cStatus.classList.remove('error');
          cStatus.classList.add('success', 'is-visible');
        }
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Request Consultation'; }
      }, 1200);
    });
  }

});
