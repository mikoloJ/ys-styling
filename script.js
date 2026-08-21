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

  /* ---- Generic modal open/close (search + contact) ---- */
  function wireSimpleModal(openSelector, scrimSelector) {
    var scrim = document.querySelector(scrimSelector);
    if (!scrim) return null;
    document.querySelectorAll(openSelector).forEach(function (btn) {
      btn.addEventListener('click', function () {
        scrim.classList.add('is-open');
        var input = scrim.querySelector('[data-search-input]');
        if (input) setTimeout(function () { input.focus(); }, 50);
      });
    });
    scrim.querySelectorAll('[data-popup-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { scrim.classList.remove('is-open'); });
    });
    scrim.addEventListener('click', function (e) {
      if (e.target === scrim) scrim.classList.remove('is-open');
    });
    return scrim;
  }

  wireSimpleModal('[data-contact-open]', '[data-contact-modal]');
  var searchScrim = wireSimpleModal('[data-search-open]', '[data-search-modal]');

  /* ---- Site search ---- */
  if (searchScrim) {
    var SITE_INDEX = [
      { title: 'Home', section: 'Page', url: '/', keywords: 'homepage where craft meets couture' },
      { title: 'About', section: 'Page', url: '/about.html', keywords: 'about us philosophy craft founder susan idiare' },
      { title: 'Bridal Collection', section: 'Page', url: '/bridal.html', keywords: 'bridal wedding gowns couture' },
      { title: 'White Bridals', section: 'Bridal', url: '/bridal-white.html', keywords: 'white wedding gowns bridal collection' },
      { title: 'Trad Bridals', section: 'Bridal', url: '/bridal-trad.html', keywords: 'traditional wedding attire aso-oke gele' },
      { title: 'Odette', section: 'White Bridals', url: '/dress-white-odette.html', keywords: 'white bridal gown mermaid' },
      { title: 'Soleil', section: 'White Bridals', url: '/dress-white-soleil.html', keywords: 'white bridal gown radiant structured' },
      { title: 'La Mer', section: 'White Bridals', url: '/dress-white-lamer.html', keywords: 'white bridal gown fluid draped' },
      { title: 'Serenity', section: 'White Bridals', url: '/dress-white-serenity.html', keywords: 'white bridal gown minimal clean' },
      { title: 'Elara', section: 'White Bridals', url: '/dress-white-elara.html', keywords: 'white bridal gown ethereal tulle' },
      { title: 'Lolo', section: 'Trad Bridals', url: '/dress-trad-lolo.html', keywords: 'traditional beaded gele regal' },
      { title: 'Obianuju', section: 'Trad Bridals', url: '/dress-trad-obianuju.html', keywords: 'traditional embellished rich' },
      { title: 'Ago', section: 'Trad Bridals', url: '/dress-trad-ago.html', keywords: 'traditional bold heritage tailored' },
      { title: 'Branama', section: 'Trad Bridals', url: '/dress-trad-branama.html', keywords: 'traditional statement sleeves' },
      { title: 'Iyoba', section: 'Trad Bridals', url: '/dress-trad-iyoba.html', keywords: 'traditional coral beadwork majestic' },
      { title: 'Bespoke & Ready-to-Wear', section: 'Page', url: '/couture.html', keywords: 'couture custom tailoring ready to wear' },
      { title: 'Book a Consultation', section: 'Page', url: '/consultation.html', keywords: 'consultation fees booking appointment' },
      { title: 'Blog', section: 'Page', url: '/blog/index.html', keywords: 'journal notes from the atelier' },
      { title: 'Five Questions to Ask Before Your First Fitting', section: 'Blog', url: '/blog/five-questions-to-ask-before-your-first-fitting.html', keywords: 'fitting consultation questions' },
      { title: 'How Far in Advance Should You Start Your Bridal Order?', section: 'Blog', url: '/blog/how-far-in-advance-should-you-start-your-bridal-order.html', keywords: 'timeline bridal order months' },
      { title: 'Building a Capsule Wardrobe Around One Statement Piece', section: 'Blog', url: '/blog/building-a-capsule-wardrobe-around-one-statement-piece.html', keywords: 'capsule wardrobe ready to wear' },
      { title: 'Inside Our Quality Control Process', section: 'Blog', url: '/blog/inside-our-quality-control-process.html', keywords: 'quality control production supervision' },
      { title: 'What to Bring to Your Styling Consultation', section: 'Blog', url: '/blog/what-to-bring-to-your-styling-consultation.html', keywords: 'consultation reference budget' },
      { title: "Silhouettes We're Seeing More Requests For", section: 'Blog', url: '/blog/silhouettes-were-seeing-more-requests-for.html', keywords: 'silhouette trends necklines' },
      { title: 'Understanding Fabric Weight in Custom Dresses', section: 'Blog', url: '/blog/understanding-fabric-weight-in-custom-dresses.html', keywords: 'fabric weight silk satin' }
    ];

    var searchInput = searchScrim.querySelector('[data-search-input]');
    var searchResults = searchScrim.querySelector('[data-search-results]');

    function renderResults(query) {
      searchResults.innerHTML = '';
      if (!query) return;
      var q = query.toLowerCase();
      var matches = SITE_INDEX.filter(function (item) {
        return item.title.toLowerCase().indexOf(q) !== -1 || item.keywords.toLowerCase().indexOf(q) !== -1;
      }).slice(0, 8);

      if (!matches.length) {
        searchResults.innerHTML = '<p class="search-empty">No results found. Try a different search.</p>';
        return;
      }

      matches.forEach(function (item) {
        var a = document.createElement('a');
        a.href = item.url;
        a.innerHTML = item.title + '<span class="search-result-meta">' + item.section + '</span>';
        searchResults.appendChild(a);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', function () { renderResults(searchInput.value.trim()); });
      searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          var first = searchResults.querySelector('a');
          if (first) window.location.href = first.getAttribute('href');
        }
      });
    }

    searchScrim.addEventListener('transitionend', function () {
      if (!searchScrim.classList.contains('is-open') && searchInput) {
        searchInput.value = '';
        searchResults.innerHTML = '';
      }
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
  var NEWSLETTER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzVq1C8BxxrM_3uaRASRA2lsrMiGPws_3dYYSrWQzboGqD34uPgxwl6C2XdlfoXka-J/exec';

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
