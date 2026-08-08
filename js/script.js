// Enter key on a single-line field moves focus to the next worksheet field.
// Nothing here saves, submits, or sends data anywhere.
document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('worksheet-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
  });

  var fields = Array.prototype.slice.call(form.elements).filter(function (el) {
    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
  });

  fields.forEach(function (field, index) {
    if (field.tagName !== 'INPUT') return; // textareas keep Enter as a newline
    field.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var next = fields[index + 1];
        if (next) next.focus();
      }
    });
  });
});
