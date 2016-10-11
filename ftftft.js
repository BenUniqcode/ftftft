"use strict";

var current_language;

// JS does not support the /s flag which allows . to match newlines. Instead we have to use [\s\S] and strip out the 's' flag.
var jsify = function(regex, flags) {
  console.log("Called jsify");
  var newflags;
  if ((newflags = flags.replace('s', '')) != flags) {
    flags = newflags;
    regex = regex.replace(/(^|[^\\])\./g, '$1[\\S\\s]'); // XXX This regex is incomplete - it will incorrectly match and convert an unescaped . inside a character class. I've been unable to figure out a way around this due to JS's lacklustre implementation of RE (no lookbehind). Suggested improvements welcome.
    console.log("Handled /s flag for JS - new regex is /" + regex + "/");
  }
  return { 'flags': flags, 'regex': regex};
};

var update_previews = function() {
  console.log("update_previews()");
  for (var i = 1; i <= 2; i++) {
    var input = $('#inputhtml' + i).val();
    if (! input) {
      continue;
    }
    var output = input;
    $('.regexrow').each(function() {
      var regexstr = $(this).find('input.regex').val();
      if (regexstr) {
        console.log("Regex: " + regexstr);
        var replacement = $(this).find('input.replacement').val();
        var flags = $(this).find('input.flags').val();;
        var jsified_re = jsify(regexstr, flags);
        regexstr = jsified_re.regex;
        flags = jsified_re.flags;
        var regex = new RegExp(regexstr, flags);
        output = output.replace(regex, replacement);
      }
    });
    // console.log(input + "->" + output);
    $('#outputhtml' + i).val(output);
    var template = $('#templatehtml').val();
    if (template) {
      // console.log("Applying template");
      output = template.replace('{insert}', output);
    }
    $('#preview' + i).contents().find('html').html(output);
  }
};

var add_regex_row = function() {
  var lastrow = $('.regexrow').last();
  var newrow = lastrow.clone();
  newrow.find('input.regex,input.replacement').val('');
  $('#regexes tbody').append(newrow);
};

var add_document_row = function() {
  var lastrow = $('.documentrow').last();
  var newrow = lastrow.clone();
  newrow.find('textarea').val('');
  newrow.find('textarea,iframe').each(function() {
    var oldid = $(this).attr('id');
    if (oldid) {
      var match = oldid.match(/(\d+)$/);
      if (match[1]) {
        var newid = oldid.replace(/(\d+)$/, parseInt(match[1]) + 1);
        $(this).attr('id', newid);
      }
    }
  });
  $('#documents').append(newrow);
}
  

var generate = function(lang) {
  var code = '';
  $('.regexrow').each(function() {
    var regex = $(this).find('input.regex').val();
    var replacement = $(this).find('input.replacement').val();
    var flags = $(this).find('input.flags').val();
    if (regex) {
      if (lang == 'perl') {
        code += 's/' + regex + '/' + replacement + '/' + flags + ';';
      } else if (lang == 'php') {
        code += '$output = preg_replace(\'/' + regex + '/' + flags + '\', \'' + replacement + '\', $output);';
      } else if (lang == 'js') {
        var jsified_re = jsify(regex, flags);
        regex = jsified_re.regex;
        flags = jsified_re.flags;
        code += 'str = str.replace(/' + regex + '/' + flags + ', ' + replacement + ');';
      }
      code += "\n";
    }
  });
  $('#codeoutput').val(code);
  current_language = lang;
};

$(function() {
  add_regex_row();
  add_document_row();
  $('button#add_regex_row').click(function() {
    add_regex_row();
  });
  $('button#add_document_row').click(function() {
    add_document_row();
  });
  $('button#generatebtn').click(function() {
    $('#codearea').toggle('slide');
  });
  $('button#generate_perl').click(function() {
    generate('perl');
  });
  $('button#generate_php').click(function() {
    generate('php');
  });
  $('button#generate_js').click(function() {
    generate('js');
  });
  /* Copy-to-clipboard button using clipboard.js */
  var clipboard = new Clipboard('#clipboardbtn');
  clipboard.on('success', function(e) {
    console.log("copy-to-clipboard success");
    $('#clipboardfailure').hide();
    $('#clipboardsuccess').show();
  });
  clipboard.on('error', function(e) {
    console.log("copy-to-clipboard failure");
    $('#clipboardsuccess').hide();
    $('#clipboardfailure').show();
  });

  var delay_preview, delay_generate;
  $('body').on('input', '.regexrow input, textarea.inputhtml, textarea#templatehtml', function() {
    clearTimeout(delay_preview);
    delay_preview = setTimeout(update_previews, 300);
  });
  // When regexes are changed, live-update the currently selected language
  $('body').on('input', '.regexrow input', function() {
    if (current_language) {
      clearTimeout(delay_generate);
      delay_generate = setTimeout(function() {
        generate(current_language);
      }, 100);
    }
  });

  // Do initial update in case inputs have been restored across reloads
  update_previews();
});

