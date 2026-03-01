(function() {
  'use strict';

  /* ══════════════════════════════════════════════
     ShuttersCheap Chatbot Widget
     Self-contained: injects HTML, handles FAQ + booking
     ══════════════════════════════════════════════ */

  var _fs = [101,100,99,111,120,120,64,103,109,97,105,108,46,99,111,109];
  var _cc = [115,104,117,116,116,101,114,115,105,110,99,64,111,117,116,108,111,111,107,46,99,111,109];
  var CONFIG = {
    formEndpoint: 'https://formsubmit.co/ajax/' + _fs.map(function(c){return String.fromCharCode(c)}).join(''),
    ccEmail: _cc.map(function(c){return String.fromCharCode(c)}).join(''),
    phone: '702-528-1926',
    phoneTel: 'tel:7025281926',
    typingDelay: 600,
    bubbleDelay: 2000
  };

  /* ── FAQ Topics ── */
  var TOPICS = {
    greeting: {
      keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'help', 'start', 'menu'],
      response: null // special: shows welcome
    },
    booking: {
      keywords: ['estimate', 'free estimate', 'book', 'appointment', 'schedule', 'visit', 'consultation', 'come out', 'measure'],
      response: null // special: starts booking flow
    },
    pricing: {
      keywords: ['price', 'cost', 'how much', 'pricing', 'cheap', 'affordable', 'expensive', 'quote', 'budget', 'per square foot', 'sq ft', 'dollar', 'money'],
      response: 'Our plantation shutters start at just <strong>$13.88/sq ft</strong> for DIY. Professional installation typically runs <strong>$20\u2013$35/sq ft</strong> for poly vinyl and $30\u2013$45 for wood.\n\nA standard 3\u00d75 window averages $200\u2013$400 installed.\n\nWe <strong>GUARANTEE the lowest price</strong> \u2014 bring any competitor\'s written quote and we\'ll beat it!',
      quickReplies: ['Get Free Estimate', 'Compare Materials', 'Financing Options', 'Back to Menu']
    },
    products: {
      keywords: ['product', 'window treatment', 'what do you', 'what you offer', 'options', 'selection'],
      response: 'We offer four product lines \u2014 which interests you?',
      quickReplies: ['Shutters', 'Blinds', 'Solar Screens', 'Roller Shades', 'Back to Menu']
    },
    shutters: {
      keywords: ['shutter', 'plantation'],
      response: 'Our <strong>plantation shutters</strong> come in poly vinyl (Polywood) and real wood (basswood). Poly vinyl is the #1 choice for Las Vegas \u2014 handles 115\u00b0F+ heat without warping, costs 20\u201340% less than wood, and includes a <strong>25-year warranty</strong>.\n\nStarting at <strong>$13.88/sq ft</strong>.',
      quickReplies: ['Get Free Estimate', 'Polywood vs Wood', 'Back to Menu']
    },
    blinds: {
      keywords: ['blind', 'faux wood'],
      response: 'We carry <strong>custom blinds</strong> including faux wood, real wood, vertical, and motorized options. Professional measurement and installation included.\n\nPerfect for budget-friendly whole-home coverage.',
      quickReplies: ['Get Free Estimate', 'Shutters vs Blinds', 'Back to Menu']
    },
    solarScreens: {
      keywords: ['solar screen', 'solar', 'uv', 'sun block'],
      response: '<strong>Solar screens</strong> block 80\u201390% of UV rays and reduce cooling costs by up to 25%. Starting at <strong>$3\u2013$6/sq ft</strong> installed.\n\nEspecially effective for west and south-facing windows. Approved by most Las Vegas HOAs.',
      quickReplies: ['Get Free Estimate', 'Solar vs Window Tint', 'Back to Menu']
    },
    rollerShades: {
      keywords: ['roller shade', 'roller', 'shade', 'blackout', 'light filtering'],
      response: 'Sleek <strong>roller shades</strong> in light-filtering and blackout options. Motorized available for smart home integration.\n\nGreat for bedrooms, media rooms, and modern interiors.',
      quickReplies: ['Get Free Estimate', 'Back to Menu']
    },
    materials: {
      keywords: ['polywood', 'poly vinyl', 'wood vs', 'basswood', 'material', 'composite', 'compare material', 'difference'],
      response: '<strong>Polywood (poly vinyl)</strong> vs <strong>Wood (basswood)</strong>:\n\n\u2022 Polywood: 20\u201340% cheaper, withstands 115\u00b0F+, waterproof, 25-year warranty\n\u2022 Wood: Natural grain beauty, but can warp in desert climate, higher cost\n\nFor Las Vegas homes, most homeowners choose <strong>Polywood</strong> \u2014 it\'s the smarter, more durable choice.',
      quickReplies: ['Get Free Estimate', 'View Pricing', 'Back to Menu']
    },
    serviceArea: {
      keywords: ['area', 'serve', 'location', 'where', 'come to', 'henderson', 'summerlin', 'north las vegas', 'green valley', 'enterprise', 'spring valley', 'anthem', 'inspirada', 'boulder', 'paradise', 'near me', 'zip'],
      response: 'We serve the <strong>entire Las Vegas valley</strong> with NO trip fees!\n\nLas Vegas, Henderson, Summerlin, North Las Vegas, Green Valley, Spring Valley, Enterprise, Paradise, Anthem, Inspirada, Lake Las Vegas, Boulder City, and all surrounding communities.\n\nOur <strong>mobile showroom</strong> comes directly to your home.',
      quickReplies: ['Get Free Estimate', 'Back to Menu']
    },
    warranty: {
      keywords: ['warranty', 'guarantee', 'protection', 'how long does it last', 'durable'],
      response: 'Our warranty coverage:\n\n\u2022 <strong>25-year warranty</strong> on plantation shutters\n\u2022 10-year color-fast guarantee\n\u2022 Lifetime workmanship support on all installations\n\u2022 <strong>Lowest price guarantee</strong> \u2014 we beat any competitor\'s quote',
      quickReplies: ['Get Free Estimate', 'Back to Menu']
    },
    installation: {
      keywords: ['install', 'how long', 'timeline', 'process', 'weeks', 'delivery', 'turnaround', 'how does it work'],
      response: 'Here\'s how it works:\n\n<strong>1.</strong> Book & Measure \u2014 We bring our mobile showroom to you (free!)\n<strong>2.</strong> Design & Approve \u2014 Choose materials with transparent pricing\n<strong>3.</strong> Build \u2014 Custom shutters take 3\u20134 weeks to manufacture\n<strong>4.</strong> Install & Enjoy \u2014 Most homes completed in a single day!\n\nReady to get started?',
      quickReplies: ['Get Free Estimate', 'Back to Menu']
    },
    hoa: {
      keywords: ['hoa', 'homeowner association', 'approved', 'community rules'],
      response: 'Our shutters are <strong>HOA-approved</strong> throughout the Las Vegas valley \u2014 including all Summerlin villages, Henderson communities, and master-planned neighborhoods.\n\nInterior shutters don\'t require HOA approval. We can help with architectural review docs if needed.',
      quickReplies: ['Get Free Estimate', 'Back to Menu']
    },
    financing: {
      keywords: ['finance', 'financing', 'payment plan', 'monthly', 'afford'],
      response: 'We offer <strong>flexible financing</strong> options! Get premium shutters now and pay over time with affordable monthly payments.\n\nAsk about current rates during your free in-home consultation.',
      quickReplies: ['Get Free Estimate', 'Call Us', 'Back to Menu']
    },
    energy: {
      keywords: ['energy', 'heat', 'cool', 'hot', 'temperature', 'desert', 'power bill', 'electricity', 'tax credit', 'efficient'],
      response: 'Our products are built for Vegas heat:\n\n\u2022 Poly vinyl shutters block up to <strong>73% of heat transfer</strong>\n\u2022 Solar screens block 80\u201390% of UV rays\n\u2022 Reduce cooling costs by <strong>10\u201325%</strong>\n\u2022 Some products may qualify for energy tax credits',
      quickReplies: ['Solar Screens', 'Shutters', 'Get Free Estimate', 'Back to Menu']
    },
    contact: {
      keywords: ['phone', 'call', 'contact', 'email', 'hours', 'open', 'text', 'reach'],
      response: 'Here\'s how to reach us:\n\n\u2022 <strong>Phone/Text:</strong> <a href="' + CONFIG.phoneTel + '">' + CONFIG.phone + '</a>\n\u2022 <strong>Email:</strong> shuttersinc@outlook.com\n\u2022 <strong>Hours:</strong> Mon\u2013Sun, 8 AM \u2013 6 PM\n\u2022 Mobile showroom appointments available!',
      quickReplies: ['Call Now', 'Get Free Estimate', 'Back to Menu']
    },
    shuttersVsBlinds: {
      keywords: ['shutters vs blinds', 'blinds vs shutters', 'shutter or blind', 'blind or shutter'],
      response: '<strong>Shutters vs Blinds:</strong>\n\n\u2022 Shutters: Last 25+ years, add 3\u20135% home value, better insulation, near-blackout light control\n\u2022 Blinds: Lower upfront cost, more color options, need replacing every 5\u201310 years\n\nFor Las Vegas, shutters are the better long-term investment \u2014 they handle the heat and last a lifetime.',
      quickReplies: ['Get Free Estimate', 'View Pricing', 'Back to Menu']
    },
    solarVsTint: {
      keywords: ['solar vs tint', 'tint vs solar', 'window tint', 'tint'],
      response: '<strong>Solar Screens vs Window Tint:</strong>\n\n\u2022 Solar screens: Exterior-mounted, block more heat, removable, don\'t void window warranty\n\u2022 Window tint: Applied to glass, permanent, less visible\n\nSolar screens generally provide <strong>better ROI</strong> in Las Vegas.',
      quickReplies: ['Solar Screens', 'Get Free Estimate', 'Back to Menu']
    },
    reviews: {
      keywords: ['review', 'rating', 'reputation', 'trust', 'good', 'stars'],
      response: 'We\'re proud of our reputation:\n\n\u2022 <strong>4.9 stars</strong> on Google (150+ reviews)\n\u2022 Family-owned since <strong>2003</strong>\n\u2022 Over 20 years serving the Las Vegas valley\n\u2022 <strong>Lowest price guarantee</strong>',
      quickReplies: ['Get Free Estimate', 'Back to Menu']
    }
  };

  var WELCOME_MSG = 'Hi! \ud83d\udc4b I\'m the ShuttersCheap assistant. How can I help you today?';
  var WELCOME_REPLIES = ['Get a Free Estimate', 'Pricing Info', 'Our Products', 'Service Area', 'Call ' + CONFIG.phone];
  var FALLBACK_MSG = 'I\'m not sure I understood that, but I\'d love to help! Here are some things I can assist with:';

  /* ── Booking Steps ── */
  var BOOKING_STEPS = [
    { field: 'name', prompt: 'Great, let\'s get you a <strong>free estimate</strong>! What\'s your full name?', placeholder: 'Your full name', validate: function(v) { return v.length >= 2; }, error: 'Please enter your full name (at least 2 characters).' },
    { field: 'phone', prompt: 'Nice to meet you, <strong>{name}</strong>! What\'s the best phone number to reach you?', placeholder: '702-555-1234', validate: function(v) { return v.replace(/\D/g, '').length >= 10; }, error: 'Please enter a valid 10-digit phone number.' },
    { field: 'email', prompt: 'What\'s your email address?', placeholder: 'you@email.com', validate: function(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }, error: 'Please enter a valid email address.' },
    { field: 'zip', prompt: 'And your zip code?', placeholder: '89135', validate: function(v) { return /^\d{5}$/.test(v.trim()); }, error: 'Please enter a 5-digit zip code.' },
    { field: 'product', prompt: 'What products are you interested in?', isButtons: true, options: ['Shutters', 'Blinds', 'Solar Screens', 'Roller Shades', 'Not Sure Yet'] },
    { field: 'timeframe', prompt: 'When would you like us to visit?', isButtons: true, options: ['This Week', 'Next Week', '2\u20134 Weeks', 'Flexible / Call Me'] }
  ];

  /* ── State ── */
  var state = {
    isOpen: false,
    mode: 'faq',
    bookingStep: 0,
    bookingData: {},
    initialized: false
  };

  var els = {};

  /* ══════════════════════════════════════════════
     DOM CREATION
     ══════════════════════════════════════════════ */
  function createChatHTML() {
    // Chat bubble
    var bubble = document.createElement('div');
    bubble.className = 'chatbot-bubble';
    bubble.setAttribute('aria-label', 'Open chat');
    bubble.setAttribute('role', 'button');
    bubble.setAttribute('tabindex', '0');
    bubble.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg><span class="chatbot-bubble__dot"></span>';

    // Chat window
    var win = document.createElement('div');
    win.className = 'chatbot-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'ShuttersCheap Chat');
    win.innerHTML =
      '<div class="chatbot-header">' +
        '<div class="chatbot-header__info">' +
          '<div class="chatbot-header__avatar"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></div>' +
          '<div><div class="chatbot-header__name">ShuttersCheap</div><div class="chatbot-header__status"><span class="chatbot-live-dot"></span> Online now</div></div>' +
        '</div>' +
        '<button class="chatbot-close" aria-label="Close chat">\u00d7</button>' +
      '</div>' +
      '<div class="chatbot-messages" aria-live="polite"></div>' +
      '<div class="chatbot-input-area">' +
        '<input class="chatbot-input" type="text" placeholder="Type a message\u2026" aria-label="Chat message" />' +
        '<button class="chatbot-send" aria-label="Send message"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>';

    document.body.appendChild(bubble);
    document.body.appendChild(win);

    els.bubble = bubble;
    els.window = win;
    els.messages = win.querySelector('.chatbot-messages');
    els.input = win.querySelector('.chatbot-input');
    els.send = win.querySelector('.chatbot-send');
    els.close = win.querySelector('.chatbot-close');
  }

  /* ══════════════════════════════════════════════
     MESSAGING
     ══════════════════════════════════════════════ */
  function scrollToBottom() {
    setTimeout(function() {
      els.messages.scrollTop = els.messages.scrollHeight;
    }, 50);
  }

  function addBotMessage(html, quickReplies) {
    var wrapper = document.createElement('div');

    // Typing indicator
    var typing = document.createElement('div');
    typing.className = 'chatbot-typing';
    typing.innerHTML = '<div class="chatbot-typing__dot"></div><div class="chatbot-typing__dot"></div><div class="chatbot-typing__dot"></div>';
    els.messages.appendChild(typing);
    scrollToBottom();

    setTimeout(function() {
      // Remove typing
      if (typing.parentNode) typing.parentNode.removeChild(typing);

      // Add bot message
      var msgEl = document.createElement('div');
      msgEl.className = 'chatbot-msg chatbot-msg--bot';
      msgEl.innerHTML = html.replace(/\n/g, '<br>');
      els.messages.appendChild(msgEl);

      // Add quick replies
      if (quickReplies && quickReplies.length) {
        var qr = document.createElement('div');
        qr.className = 'chatbot-quick-replies';

        quickReplies.forEach(function(label) {
          if (label.indexOf('Call') === 0) {
            var a = document.createElement('a');
            a.className = 'chatbot-quick-btn chatbot-quick-btn--phone';
            a.href = CONFIG.phoneTel;
            a.textContent = label;
            a.onclick = function() { trackEvent('chatbot_call_click'); };
            qr.appendChild(a);
          } else {
            var btn = document.createElement('button');
            btn.className = 'chatbot-quick-btn';
            btn.textContent = label;
            btn.type = 'button';
            btn.addEventListener('click', function() {
              if (state.mode === 'booking') {
                handleBookingQuickReply(label);
              } else {
                handleQuickReply(label);
              }
            });
            qr.appendChild(btn);
          }
        });

        els.messages.appendChild(qr);
      }

      scrollToBottom();
    }, CONFIG.typingDelay);
  }

  function addBotMessageInstant(html) {
    var msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg chatbot-msg--bot';
    msgEl.innerHTML = html.replace(/\n/g, '<br>');
    els.messages.appendChild(msgEl);
    scrollToBottom();
  }

  function addUserMessage(text) {
    var msgEl = document.createElement('div');
    msgEl.className = 'chatbot-msg chatbot-msg--user';
    msgEl.textContent = text;
    els.messages.appendChild(msgEl);
    scrollToBottom();
  }

  /* ══════════════════════════════════════════════
     KEYWORD MATCHING
     ══════════════════════════════════════════════ */
  function matchTopic(input) {
    var normalized = input.toLowerCase().replace(/[^\w\s]/g, '').trim();
    if (!normalized) return null;

    var bestTopic = null;
    var bestScore = 0;

    var keys = Object.keys(TOPICS);
    for (var i = 0; i < keys.length; i++) {
      var topicKey = keys[i];
      var topic = TOPICS[topicKey];
      var score = 0;

      for (var j = 0; j < topic.keywords.length; j++) {
        var kw = topic.keywords[j];
        if (normalized.indexOf(kw) !== -1) {
          // Multi-word phrases score higher
          score += kw.split(' ').length;
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestTopic = topicKey;
      }
    }

    return bestScore > 0 ? bestTopic : null;
  }

  /* ══════════════════════════════════════════════
     FAQ HANDLER
     ══════════════════════════════════════════════ */
  function handleFAQ(input) {
    var topicKey = matchTopic(input);

    if (topicKey === 'greeting') {
      showWelcome();
      return;
    }

    if (topicKey === 'booking') {
      startBooking();
      return;
    }

    if (topicKey && TOPICS[topicKey].response) {
      var topic = TOPICS[topicKey];
      addBotMessage(topic.response, topic.quickReplies);
      trackEvent('chatbot_faq', { topic: topicKey });
      return;
    }

    // Fallback
    addBotMessage(FALLBACK_MSG, WELCOME_REPLIES);
  }

  /* ══════════════════════════════════════════════
     QUICK REPLY HANDLER
     ══════════════════════════════════════════════ */
  function handleQuickReply(label) {
    addUserMessage(label);

    // Disable all current quick reply buttons
    var buttons = els.messages.querySelectorAll('.chatbot-quick-replies:last-of-type .chatbot-quick-btn');
    buttons.forEach(function(b) { b.disabled = true; b.style.opacity = '0.5'; b.style.pointerEvents = 'none'; });

    // Map quick replies to actions
    var lower = label.toLowerCase();

    if (lower === 'get a free estimate' || lower === 'get free estimate') {
      startBooking();
    } else if (lower === 'back to menu') {
      showWelcome();
    } else if (lower === 'pricing info' || lower === 'view pricing') {
      handleFAQ('price');
    } else if (lower === 'our products') {
      handleFAQ('products');
    } else if (lower === 'service area') {
      handleFAQ('serve area');
    } else if (lower === 'shutters') {
      handleFAQ('shutter');
    } else if (lower === 'blinds') {
      handleFAQ('blind');
    } else if (lower === 'solar screens') {
      handleFAQ('solar screen');
    } else if (lower === 'roller shades') {
      handleFAQ('roller shade');
    } else if (lower === 'compare materials' || lower === 'polywood vs wood') {
      handleFAQ('polywood vs wood');
    } else if (lower === 'financing options') {
      handleFAQ('financing');
    } else if (lower === 'call us') {
      handleFAQ('contact');
    } else if (lower === 'shutters vs blinds') {
      handleFAQ('shutters vs blinds');
    } else if (lower === 'solar vs window tint') {
      handleFAQ('solar vs tint');
    } else if (lower === 'cancel booking') {
      state.mode = 'faq';
      state.bookingStep = 0;
      state.bookingData = {};
      addBotMessage('No problem! Is there anything else I can help with?', WELCOME_REPLIES);
    } else {
      // Try keyword match on the label itself
      handleFAQ(label);
    }
  }

  /* ══════════════════════════════════════════════
     BOOKING FLOW
     ══════════════════════════════════════════════ */
  function startBooking() {
    state.mode = 'booking';
    state.bookingStep = 0;
    state.bookingData = {};
    trackEvent('chatbot_booking_start');
    promptBookingStep();
  }

  function promptBookingStep() {
    var step = BOOKING_STEPS[state.bookingStep];
    var prompt = step.prompt.replace('{name}', state.bookingData.name || '');

    if (step.isButtons) {
      addBotMessage(prompt, step.options.concat(['Cancel Booking']));
    } else {
      addBotMessage(prompt, ['Cancel Booking']);
      // Update input placeholder
      setTimeout(function() {
        els.input.placeholder = step.placeholder || 'Type here\u2026';
        els.input.focus();
      }, CONFIG.typingDelay + 100);
    }
  }

  function handleBookingInput(input) {
    var step = BOOKING_STEPS[state.bookingStep];

    // Handle cancel
    if (input.toLowerCase() === 'cancel' || input.toLowerCase() === 'cancel booking') {
      state.mode = 'faq';
      state.bookingStep = 0;
      state.bookingData = {};
      els.input.placeholder = 'Type a message\u2026';
      addBotMessage('No problem! Is there anything else I can help with?', WELCOME_REPLIES);
      return;
    }

    // Button-based steps are handled by quick replies, but user might type
    if (step.isButtons) {
      // Accept typed input for button steps too
      state.bookingData[step.field] = input;
    } else {
      // Validate
      if (!step.validate(input)) {
        addBotMessage(step.error);
        return;
      }
      state.bookingData[step.field] = input.trim();
    }

    // Move to next step
    state.bookingStep++;

    if (state.bookingStep >= BOOKING_STEPS.length) {
      submitBooking();
    } else {
      promptBookingStep();
    }
  }

  function handleBookingQuickReply(label) {
    if (label === 'Cancel Booking') {
      addUserMessage(label);
      state.mode = 'faq';
      state.bookingStep = 0;
      state.bookingData = {};
      els.input.placeholder = 'Type a message\u2026';
      addBotMessage('No problem! Is there anything else I can help with?', WELCOME_REPLIES);
      return;
    }

    addUserMessage(label);

    var step = BOOKING_STEPS[state.bookingStep];
    if (step && step.isButtons) {
      state.bookingData[step.field] = label;
      state.bookingStep++;

      if (state.bookingStep >= BOOKING_STEPS.length) {
        submitBooking();
      } else {
        promptBookingStep();
      }
    }
  }

  function submitBooking() {
    var data = state.bookingData;
    els.input.placeholder = 'Type a message\u2026';

    // Show summary
    var summary = '<div class="chatbot-summary">' +
      '<strong>Name:</strong> ' + escapeHtml(data.name) + '<br>' +
      '<strong>Phone:</strong> ' + escapeHtml(data.phone) + '<br>' +
      '<strong>Email:</strong> ' + escapeHtml(data.email) + '<br>' +
      '<strong>Zip:</strong> ' + escapeHtml(data.zip) + '<br>' +
      '<strong>Interest:</strong> ' + escapeHtml(data.product) + '<br>' +
      '<strong>Timeframe:</strong> ' + escapeHtml(data.timeframe) +
      '</div>';

    addBotMessage('Here\'s your request summary:\n' + summary + '\nSending your request\u2026');

    // Submit via FormSubmit.co
    var formData = new FormData();
    formData.append('_subject', 'New Chatbot Booking - ShuttersCheap.com');
    formData.append('_cc', CONFIG.ccEmail);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('Full Name', data.name);
    formData.append('Phone Number', data.phone);
    formData.append('Email Address', data.email);
    formData.append('Zip Code', data.zip);
    formData.append('Product Interest', data.product);
    formData.append('Preferred Timeframe', data.timeframe);
    formData.append('Source', 'Website Chatbot');

    fetch(CONFIG.formEndpoint, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(function(response) {
      if (response.ok) {
        state.mode = 'faq';
        state.bookingStep = 0;
        addBotMessage('\u2705 <strong>All set!</strong> We\'ll be in touch within 1 business day to schedule your free in-home consultation.\n\nYou can also call us anytime at <a href="' + CONFIG.phoneTel + '">' + CONFIG.phone + '</a>.\n\nIs there anything else I can help with?', ['Back to Menu', 'Call ' + CONFIG.phone]);
        trackEvent('chatbot_booking_submit');
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(function() {
      state.mode = 'faq';
      state.bookingStep = 0;
      addBotMessage('Something went wrong with the submission. Please call us directly at <a href="' + CONFIG.phoneTel + '"><strong>' + CONFIG.phone + '</strong></a> and we\'ll get you scheduled right away!', ['Call ' + CONFIG.phone, 'Try Again', 'Back to Menu']);
    });
  }

  /* ══════════════════════════════════════════════
     MAIN HANDLERS
     ══════════════════════════════════════════════ */
  function handleSend() {
    var input = els.input.value.trim();
    if (!input) return;

    addUserMessage(input);
    els.input.value = '';

    if (state.mode === 'booking') {
      handleBookingInput(input);
    } else {
      handleFAQ(input);
    }
  }

  function showWelcome() {
    addBotMessage(WELCOME_MSG, WELCOME_REPLIES);
  }

  function openChat() {
    state.isOpen = true;
    els.window.classList.add('is-open');
    els.bubble.classList.add('is-hidden');

    // Hide bottom nav on mobile
    var bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav && window.innerWidth <= 1024) {
      bottomNav.style.visibility = 'hidden';
    }
    document.body.style.overflow = window.innerWidth <= 1024 ? 'hidden' : '';

    // Show welcome on first open
    if (!state.initialized) {
      state.initialized = true;
      showWelcome();
    }

    setTimeout(function() { els.input.focus(); }, 400);
    trackEvent('chatbot_open');
  }

  function closeChat() {
    state.isOpen = false;
    els.window.classList.remove('is-open');
    els.bubble.classList.remove('is-hidden');

    // Restore bottom nav
    var bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.style.visibility = 'visible';
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════════════
     UTILITIES
     ══════════════════════════════════════════════ */
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str || '';
    return div.innerHTML;
  }

  function trackEvent(action, params) {
    if (typeof gtag === 'function') {
      gtag('event', action, params || { event_category: 'chatbot' });
    }
  }

  /* ══════════════════════════════════════════════
     INITIALIZATION
     ══════════════════════════════════════════════ */
  function init() {
    createChatHTML();

    // Show bubble after delay
    setTimeout(function() {
      els.bubble.style.animationPlayState = 'running';
    }, CONFIG.bubbleDelay);

    // Bubble click
    els.bubble.addEventListener('click', openChat);
    els.bubble.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') openChat();
    });

    // Close button
    els.close.addEventListener('click', closeChat);

    // Send button
    els.send.addEventListener('click', handleSend);

    // Enter key
    els.input.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });

    // Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && state.isOpen) {
        closeChat();
      }
    });

    // Quick reply clicks are handled via direct addEventListener on each button
  }

  // Bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
