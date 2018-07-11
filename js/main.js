jQuery(document).ready(function($) {
  var Omnigage;
  var oTerminal;

  // handle embedding the terminal code into DOM
  $('#form-render').on('submit', function (e) {
    e.preventDefault();

    // prepare the config options
    var config = {};
    var formData = $('#form-render').serializeArray();
    for (var i = 0; i < formData.length; i++){
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
    }

    // prepare the embed code
    var script = document.createElement('script');
    var scriptValue = $('#terminalEmbedCode').val();
    // simple stripping of script tags for easier injection/execution
    scriptValue = scriptValue.replace('<script>', '');
    scriptValue = scriptValue.replace('</script>', '');
    script.text = scriptValue;
    document.body.appendChild(script);

    // set config
    window.Omnigage.terminal.config(config);

    // Set global variables
    window.Omnigage.terminal.ready(function() {
      Omnigage = window.Omnigage;
      oTerminal = Omnigage.terminal;
      // lock the form
      $('#form-render').find('input, textarea, button, select').attr('disabled', true);

      // unlock/show step2
      $('#remaining-steps').addClass('active');
    });
  });

  // show buttons
  $('#terminal-show-dialer').on('click', function (e) {
    e.preventDefault();
    oTerminal.show('dialer');
  });
  $('#terminal-show-texter').on('click', function (e) {
    e.preventDefault();
    oTerminal.show('texter');
  });
  $('#terminal-show-emailer').on('click', function (e) {
    e.preventDefault();
    oTerminal.show('emailer');
  });
  $('#terminal-show-voiceTemplate').on('click', function (e) {
    e.preventDefault();
    oTerminal.show('voiceTemplatesAdd');
  });
  $('#terminal-show-engagement').on('click', function (e) {
    e.preventDefault();
    oTerminal.show('engagementsAdd');
  });

  // input buttons
  $('#form-dialer').on('submit', function (e) {
    e.preventDefault();
    oTerminal.show('dialer');
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
    oTerminal.show('texter');
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
    oTerminal.show('emailer');
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
    oTerminal.show('voiceTemplatesAdd');
    var inputName = $(this).find('.inputName').val();
    var inputKind = $(this).find('.inputKind option:selected').val();
    oTerminal.inputs({
      name: inputName,
      kind: inputKind,
    });
  });
  $('#form-engagement').on('submit', function (e) {
    e.preventDefault();
    oTerminal.show('engagementsAdd');
    var inputName = $(this).find('.inputName').val();
    oTerminal.inputs({
      name: inputName,
    });
  });

});


