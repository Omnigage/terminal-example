jQuery(document).ready(function($) {
  var oTerminal;

  /**
   * Setup Site
   */
  var notyf = new Notyf({
    delay: 4000,
  });
  // initialize the color picker - https://github.com/Simonwep/pickr
  const pickr = Pickr.create({
    el: '.color-picker',
    components: {
      preview: true,
      opacity: true,
      hue: true,
      output: {
        hex: true,
        rgba: false,
        hsva: false,
        input: true,
        clear: false
      },
    },
    onChange(hsva) {
      // set the configColor on change
      $('#terminalConfigColor').val(hsva.toHEX().toString());
    },
  });

  // On Scroll make terminal sticky
  $(window).scroll(function() {
    var terminalContainer = $('#terminal-container');
    if ($(window).scrollTop() >= $('header').height() - 300) {
      terminalContainer.addClass('terminal-container-fixed');
    } else {
      terminalContainer.removeClass('terminal-container-fixed');
    }
    terminalContainer.width(terminalContainer.parent().width());
  });


  /**
   * Setup Terminal
   */
  // handle embedding the terminal code into DOM
  $('#form-render').on('submit', function (e) {
    e.preventDefault();

    // prepare the config options
    var config = {};
    var formData = $('#form-render').serializeArray();
    for (var i = 0; i < formData.length; i++) {
      // convert to expected type
      if (formData[i]['value'] === 'true') {
        formData[i]['value'] = true;
      }
      if (formData[i]['value'] === 'false') {
        formData[i]['value'] = false;
      }
      if (formData[i]['value'] === 'null') {
        formData[i]['value'] = null;
      }
      // exclude empty strings
      if (formData[i]['value'] !== '') {
        config[formData[i]['name']] = formData[i]['value'];
      }
      // remove all isEnabled from config
      // need to convert to object
      if (formData[i]['name'] === 'isEnabled') {
        delete config['isEnabled'];
      }
    }
    if ($('#form-render input:checkbox:checked')) {
      var isDisabledArray = $('#form-render input:checkbox:checked').map(function() {
        return $(this).val();
      }).get();
      var isEnabledObject = isDisabledArray.reduce(function(obj, val) {
        obj[val] = false;
        return obj;
      }, {});
      config.isEnabled = isEnabledObject;
    }

    // Check if terminal is already rendered
    if (oTerminal) {
      // Destroy terminal
      oTerminal.destroy();
      $('#omnigage-script-embed').remove();
    }

    // lock the form to prevent multi-click
    $('#form-render').find('input, textarea, button, select').attr('disabled', true);

    // prepare the embed code
    var script = document.createElement('script');
    script.setAttribute('id', 'omnigage-script-embed');
    var scriptValue = $('#terminalEmbedCode').val();
    // simple stripping of script tags for easier injection/execution
    scriptValue = scriptValue.replace('<script>', '');
    scriptValue = scriptValue.replace('</script>', '');
    script.text = scriptValue;
    document.body.appendChild(script);

    // set config
    window.Omnigage.debug = true;
    window.Omnigage.terminal.config(config);

    // Set global variables
    window.Omnigage.terminal.ready(function() {
      oTerminal = window.Omnigage.terminal;
      // unlock the form
      $('#form-render').find('input, textarea, button, select').attr('disabled', false);
      $('#form-render button').text('Re-Render');

      // unlock/render step2
      $('#remaining-steps').addClass('active');

      // subscribe to dialer events
      dialerEvents(oTerminal);
    });
  });

  // render buttons
  $('#terminal-render-dialer').on('click', function (e) {
    e.preventDefault();
    oTerminal.render('dialer');
  });
  $('#terminal-render-texter').on('click', function (e) {
    e.preventDefault();
    oTerminal.render('texter');
  });
  $('#terminal-render-emailer').on('click', function (e) {
    e.preventDefault();
    oTerminal.render('emailer');
  });
  $('#terminal-render-voiceTemplate').on('click', function (e) {
    e.preventDefault();
    oTerminal.render('voiceTemplatesAdd');
  });
  $('#terminal-render-engagement').on('click', function (e) {
    e.preventDefault();
    oTerminal.render('engagementsAdd');
  });
  $('#terminal-render-callerid').on('click', function (e) {
    e.preventDefault();
    oTerminal.render('callerIdsAdd');
  });

  // dialer actions
  $('#terminal-dial-dialer').on('click', function (e) {
    e.preventDefault();
    oTerminal.perform('dial');
  });
  $('#terminal-hangup-dialer').on('click', function (e) {
    e.preventDefault();
    oTerminal.perform('hangup');
  });
  $('#terminal-voicemailDrop-dialer').on('click', function (e) {
    e.preventDefault();
    oTerminal.perform('voicemailDrop');
  });
  $('#terminal-playDrop-dialer').on('click', function (e) {
    e.preventDefault();
    oTerminal.perform('playDrop');
  });

  // subscribe to dialer events
  function dialerEvents(terminal) {
    terminal.on('dial', function () {
      notyf.confirm('dial event');
    });
    terminal.on('hangup', function () {
      notyf.confirm('hangup event');
    });
    terminal.on('voicemailDrop', function () {
      notyf.confirm('voicemailDrop event');
    });
    terminal.on('playDrop', function () {
      notyf.confirm('playDrop event');
    });
  }

  // input buttons
  $('#form-dialer').on('submit', function (e) {
    e.preventDefault();
    oTerminal.render('dialer');
    var inputTo = $(this).find('.inputTo').val();
    var inputFrom = $(this).find('.inputFrom').val();
    var inputParentTo = $(this).find('.inputParentTo').val();
    var inputVoiceTemplate = $(this).find('.inputVoiceTemplate').val();
    oTerminal.inputs({
      to: inputTo,
      from: inputFrom,
      parentTo: inputParentTo,
      voiceTemplate: inputVoiceTemplate,
    });
  });
  $('#form-texter').on('submit', function (e) {
    e.preventDefault();
    oTerminal.render('texter');
    var inputTo = $(this).find('.inputTo').val();
    var inputFrom = $(this).find('.inputFrom').val();
    var inputBody = $(this).find('.inputBody').val();
    oTerminal.inputs({
      to: inputTo,
      from: inputFrom,
      body: inputBody,
    });
  });
  $('#form-emailer').on('submit', function (e) {
    e.preventDefault();
    oTerminal.render('emailer');
    var inputTo = $(this).find('.inputTo').val();
    var inputFrom = $(this).find('.inputFrom').val();
    var inputSubject = $(this).find('.inputSubject').val();
    var inputBody = $(this).find('.inputBody').val();
    oTerminal.inputs({
      to: inputTo,
      from: inputFrom,
      subject: inputSubject,
      body: inputBody,
    });
  });
  $('#form-voiceTemplate').on('submit', function (e) {
    e.preventDefault();
    oTerminal.render('voiceTemplatesAdd');
    var inputName = $(this).find('.inputName').val();
    var inputKind = $(this).find('.inputKind option:selected').val();
    oTerminal.inputs({
      name: inputName,
      kind: inputKind,
    });
  });
  $('#form-engagement').on('submit', function (e) {
    e.preventDefault();
    oTerminal.render('engagementsAdd');
    var inputName = $(this).find('.inputName').val();
    oTerminal.inputs({
      name: inputName,
    });
  });
  $('#form-callerid').on('submit', function (e) {
    e.preventDefault();
    oTerminal.render('callerIdsAdd');
    var inputLabel = $(this).find('.inputLabel').val();
    var inputPhoneNumber = $(this).find('.inputPhoneNumber').val();
    oTerminal.inputs({
      label: inputLabel,
      phoneNumber: inputPhoneNumber,
    });
  });

  // misc options
  $('#terminal-destroy').on('click', function (e) {
    e.preventDefault();
    oTerminal.destroy();
  });
  $('#terminal-init').on('click', function (e) {
    e.preventDefault();
    oTerminal.init();
  });
  $('#terminal-close').on('click', function (e) {
    e.preventDefault();
    oTerminal.close();
  });
  $('#terminal-open').on('click', function (e) {
    e.preventDefault();
    oTerminal.open();
  });

});
