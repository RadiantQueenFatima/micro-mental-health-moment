// Paste your Google Apps Script Web App URL here (ends in /exec) once deployed.
var SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzABlzZowL8MpI1oQfK8rykBZLbR-81LirN_FPo0VIww8a1_FuT8eVQVUN_tcKA1oEy/exec';

// Enter key on a single-line field moves focus to the next worksheet field.
// The worksheet itself never saves, submits, or sends data anywhere.
// The two capture-form sections below (guide / work-with-me) are the only
// forms that send data, and only to SHEET_ENDPOINT above.
document.addEventListener('DOMContentLoaded', function () {
  var worksheetForm = document.getElementById('worksheet-form');
  if (worksheetForm) {
    worksheetForm.addEventListener('submit', function (e) {
      e.preventDefault();
    });

    var fields = Array.prototype.slice.call(worksheetForm.elements).filter(function (el) {
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
  }

  document.querySelectorAll('.capture-form').forEach(function (captureForm) {
    captureForm.addEventListener('submit', function (e) {
      e.preventDefault();

      var status = captureForm.querySelector('.form-status');
      var button = captureForm.querySelector('button[type="submit"]');

      if (!SHEET_ENDPOINT) {
        status.textContent = "This form isn't connected yet.";
        status.className = 'form-status error';
        return;
      }

      var data = new FormData(captureForm);
      data.append('source', captureForm.dataset.source);

      button.disabled = true;
      status.textContent = 'Sending...';
      status.className = 'form-status';

      fetch(SHEET_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
        .then(function () {
          status.textContent = "Thank you! We'll be in touch.";
          status.className = 'form-status success';
          captureForm.reset();
        })
        .catch(function () {
          status.textContent = 'Something went wrong — please try again.';
          status.className = 'form-status error';
        })
        .finally(function () {
          button.disabled = false;
        });
    });
  });
});
