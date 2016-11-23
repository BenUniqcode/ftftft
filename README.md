# ftftft 
## Fudge These Files To Fit Template

A browser-based tool to do multi-regex transformation of multiple HTML input files and embed them into a template with live preview of the results.

You can try it without installing it for yourself at http://uniqcode.com/ftftft/

### What's this for?

Say you have a bunch of HTML files that get inserted into a wrapper template to be displayed on your website. But now the template has changed. Perhaps it now uses Bootstrap instead of Simplegrid, and you have to change a bunch of class names. This tool allows you to enter regexes to make these changes, and instantly see their effects on multiple input files when inserted into the new template. When you're happy that you've got the regexes right, hit the Generate Code button and you'll be provided with the code in PHP, Perl or JS.

### But you shouldn't!

Yes, I know that regex is not really the "right" tool to transform HTML, but it's perfectly good for a quick-and-dirty fix when you have a stack of files that need the same simple adaptations - if you know regex of course. This is not a tool to teach you regex, it's a tool for when you already know it but want to check that you're doing it right before you go off and do global search-and-replace on a thousand files...

### About the 's' flag

If you're not familiar with Perl-compatible regex (PCRE) you may not know about the 's' flag. It's very useful - it makes `.` match any character *including newlines*. Normally, an RE like `<div>.*?</div>` will only match if the `<div>` and the `</div>` are on the same line. But with the 's' modifier, it will match across lines. For HTML, this is often what you want. The 's' modifier doesn't exist in the JavaScript RE engine, but it can be simulated by replacing `.` with `[\S\s]`. But you don't need to do that in ftftft, just use the 's' flag and the program does this substitution internally and also when you generate JavaScript code.

### Important

This software is Alpha. Bugs are inevitable. Gentle feedback welcome.


