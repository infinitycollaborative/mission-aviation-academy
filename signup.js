/**
 * Enhances any <form data-signup> to submit without a page reload.
 * If this script never loads, the form still posts normally and /api/lead
 * answers with a redirect — so signup works with JavaScript disabled.
 */
document.querySelectorAll("form[data-signup]").forEach(function (form) {
  var status = form.querySelector("[data-status]");
  var button = form.querySelector("button[type=submit]");
  var label = button ? button.textContent : "";

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (status) { status.textContent = ""; status.className = status.className.replace(/ is-error/g, ""); }
    if (button) { button.disabled = true; button.textContent = "Sending…"; }

    var payload = {};
    new FormData(form).forEach(function (value, key) { payload[key] = value; });

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(function (response) {
        return response.json().then(function (data) { return { ok: response.ok, data: data }; });
      })
      .then(function (result) {
        if (result.ok && result.data.redirect) {
          window.location.href = result.data.redirect;
          return;
        }
        fail(result.data && result.data.error);
      })
      .catch(function () { fail(); });
  });

  function fail(message) {
    if (button) { button.disabled = false; button.textContent = label; }
    if (status) {
      status.className += " is-error";
      status.textContent = message || "Something went wrong. Please email us and we'll send it straight over.";
    }
  }
});
