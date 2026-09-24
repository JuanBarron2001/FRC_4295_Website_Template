import validator from "https://cdn.jsdelivr.net/npm/validator@13.11.0/+esm";

// Enhanced form styling and focus effects
const form = document.getElementById('contact-form');
const statusDiv = document.getElementById('form-status');

if (form) {
  // Add focus effects to inputs
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('focus', function() {
      this.parentElement.classList.add('form-group-focused');
    });
    input.addEventListener('blur', function() {
      if (!this.value) {
        this.parentElement.classList.remove('form-group-focused');
      }
    });
  });

  // Update form status display on submit
  form.addEventListener('submit', function(e) {
    statusDiv.classList.add('hidden');
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector("section[data-form-id]");
  if (!section) return;

  const form = section.querySelector("form");
  const endpoint = section.dataset.lambdaUrl;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetMessage(form);

    const values = grabValuesFromForm(form);
    const errors = validate(values);

    if (errors.length) {
      showMessage(form, false, "❌ Please fix the following:<br>" + errors.join("<br>"));
      return;
    }

    // Bots fill the hidden honeypot field; don't offer them the email fallback.
    if (values.honeyPot) return;

    // No form endpoint configured at build time: go straight to email.
    if (!endpoint) {
      showEmailFallback(form, section, values);
      return;
    }

    disableSubmitButton(form);

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Bad response");
      const data = await res.json();

      showMessage(form, true, data.message || "✅ Success!");
      form.style.display = "none";
    } catch (err) {
      console.error(err);
      showEmailFallback(form, section, values);
    } finally {
      enableSubmitButton(form);
    }
  });
});

// When the form endpoint can't be reached, offer to send the same message from
// the visitor's own email app, so what they typed isn't lost.
const showEmailFallback = (form, section, values) => {
  const to = section.dataset.contactEmail;
  const subject = `Website ${section.dataset.formId === "sponsors" ? "sponsorship" : "contact"} form: ${values.name}`;
  const body = `${values.message}\n\n${values.name}\n${values.email}\n${values.phoneNumber}`;

  const msg = document.createElement("div");
  msg.className = "form-message mt-6 p-4 rounded-lg border border-tech bg-gray-900 text-gray-200";
  msg.setAttribute("role", "alert");

  const text = document.createElement("p");
  text.className = "mb-4";
  text.textContent = `We couldn't send your message through the website. You can send it by email instead; it's already filled in. Or write to us at ${to}.`;

  // Built with DOM properties rather than innerHTML because it contains what the visitor typed.
  const link = document.createElement("a");
  link.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  link.className = "inline-flex items-center gap-2 px-6 py-3 bg-tech text-white font-semibold rounded-lg hover:shadow-glow-maroon transition-all duration-300";
  link.innerHTML = '<i class="fa-solid fa-envelope"></i>';
  link.append(" Send by email");

  msg.append(text, link);
  form.after(msg);
};

const grabValuesFromForm = (form) => ({
  name: form.querySelector("#name").value.trim(),
  phoneNumber: form.querySelector("#phone").value.trim(),
  email: form.querySelector("#email").value.trim(),
  message: form.querySelector("#comment").value.trim(),
  honeyPot: form.querySelector("#website").value.trim()
});

const validate = ({ name, phoneNumber, email, message, honeyPot }) => {
  const errors = [];
  if (validator.isEmpty(name)) errors.push("Name is required.");
  if (!validator.isEmail(email)) errors.push("Valid email is required.");
  if (validator.isEmpty(phoneNumber)) {
    errors.push("Phone number is required.");
  } else if (!validator.isMobilePhone(phoneNumber, "any")) {
    errors.push("Valid phone number is required.");
  }
  if (validator.isEmpty(message)) errors.push("Comment is required.");
  return errors;
};

const resetMessage = (form) => {
  const oldMsg = form.parentElement.querySelector(".form-message");
  if (oldMsg) oldMsg.remove();
};

const showMessage = (form, isSuccess, message) => {
  const msg = document.createElement("div");
  msg.className = `form-message mt-6 p-4 rounded-lg border ${isSuccess ? "border-green-700 bg-green-950 text-green-100" : "border-tech bg-gray-900 text-gray-200"}`;
  msg.setAttribute("role", "alert");
  msg.innerHTML = message;
  form.after(msg);
};

// Keep the button's original markup (icon and "Send Message") so it can be restored.
const disableSubmitButton = (form) => {
  const button = form.querySelector("button[type=submit]");
  button.dataset.originalHtml = button.innerHTML;
  button.disabled = true;
  button.textContent = "Sending...";
};

const enableSubmitButton = (form) => {
  const button = form.querySelector("button[type=submit]");
  button.disabled = false;
  if (button.dataset.originalHtml) button.innerHTML = button.dataset.originalHtml;
};