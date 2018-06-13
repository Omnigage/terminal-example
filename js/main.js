jQuery(document).ready(function($) {
  var Omnigage;
  var oTerminal;

  // handle embedding the terminal code into DOM
  $('#form-render').on('submit', function (e) {
    e.preventDefault();
    var script = document.createElement('script');
    script.text = $('#terminalEmbedCode').val();
    document.body.appendChild(script);

    // unlock/show step2
    $('#remaining-steps').addClass('active');
    // Set global variables
    window.Omnigage.terminal.ready(function() {
      Omnigage = window.Omnigage;
      oTerminal = Omnigage.terminal;
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

  // input buttons
  $('#form-dialer').on('submit', function (e) {
    e.preventDefault();
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

});
