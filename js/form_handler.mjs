import validator from "https://cdn.jsdelivr.net/npm/validator@13.11.0/+esm";

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("section[data-form-id]");
    const form = section.querySelector("form");

    const formId = section.dataset.formId;
    const endpoint = section.dataset.lambdaUrl;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Grab values
    const name = form.querySelector("#name").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const email = form.querySelector("#email").value.trim();
    const comment = form.querySelector("#comment").value.trim();

    // Remove old message if any
    const oldMsg = form.parentElement.querySelector(".form-message");
    if (oldMsg) oldMsg.remove();

    // Validate
    let errors = [];
    if (validator.isEmpty(name)) errors.push("Name is required.");
    if (!validator.isEmail(email)) errors.push("Valid email is required.");
    if (validator.isEmpty(phone)) {
      errors.push("Phone number is required.");
    } else if (!validator.isMobilePhone(phone, "any")) {
      errors.push("Valid phone number is required.");
    }
    if (validator.isEmpty(comment)) errors.push("Comment is required.");

    if (errors.length > 0) {
      const msg = document.createElement("div");
      msg.className = "form-message alert alert-danger mt-4";
      msg.innerHTML = "❌ Please fix the following:<br>" + errors.join("<br>");
      form.parentElement.appendChild(msg);
      return; // stop here, don’t submit
    }

    // Disable button + show "sending..."
    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Sending...";

    const payload = {
        name: name,
        phoneNumber: phone,
        email: email,
        message: comment
    }
    // Call the endpoint
    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        // Restore button state
        button.disabled = false;
        button.textContent = "Submit";

        // Remove old message if any
        const oldMsg = form.parentElement.querySelector(".form-message");
        if (oldMsg) oldMsg.remove();

        // Create alert box
        const msg = document.createElement("div");
        msg.className = "form-message alert mt-4 alert-success";
        msg.textContent = data.message; // should be "Hello from Lambda!"

        form.style.display = "none";
        form.parentElement.appendChild(msg);
      })
      .catch((err) => {
        // Restore button state
        button.disabled = false;
        button.textContent = "Submit";

        // Remove old message if any
        const oldMsg = form.parentElement.querySelector(".form-message");
        if (oldMsg) oldMsg.remove();

        // Create alert box
        const msg = document.createElement("div");
        msg.className = "form-message alert mt-4 alert-danger";
        msg.textContent = "❌ Something went wrong. Please try again.";

        form.parentElement.appendChild(msg);
      });
  });
});