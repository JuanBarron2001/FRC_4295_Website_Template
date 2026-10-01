// validator.js is only needed when someone submits a form, so it's loaded on
// first submit instead of with every page that has a form.
let validatorModule;
const loadValidator = async () => {
  validatorModule ??= (await import("https://cdn.jsdelivr.net/npm/validator@13.11.0/+esm")).default;
  return validatorModule;
};

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

  if (section.dataset.formKind === "sponsor") {
    form.addEventListener("submit", (e) => handleSponsorSubmit(e, form, section));
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resetMessage(form);

    const values = grabValuesFromForm(form);
    // If validator.js can't be loaded, rely on the browser's own checks
    // (required fields, type="email"), which run before this handler.
    const validator = await loadValidator().catch(() => null);
    const errors = validator ? validate(values, validator) : [];

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

  showEmailLink(form, `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    `We couldn't send your message through the website. You can send it by email instead; it's already filled in. Or write to us at ${to}.`);
};

// The sponsor form has no server: it builds the whole email and opens it in the
// visitor's own email app, so all they do is attach a logo and press Send.
const handleSponsorSubmit = async (e, form, section) => {
  e.preventDefault();
  resetMessage(form);

  const values = grabSponsorValues(form);
  const validator = await loadValidator().catch(() => null);
  const errors = validateSponsor(values, validator);

  if (errors.length) {
    showMessage(form, false, "❌ Please fix the following:<br>" + errors.join("<br>"));
    return;
  }

  if (values.honeyPot) return;

  const to = section.dataset.contactEmail;
  const level = values.level;
  const subject = `Sponsorship: ${values.business}${level.amount ? ` (${level.name})` : ""}`;
  const lines = [
    "Sponsorship form from hudsonrobotics4295.com",
    "",
    `Business or sponsor: ${values.business}`,
    `Contact name: ${values.contactName}`,
    `Email: ${values.email}`,
    `Phone: ${values.phoneNumber || "(not given)"}`,
    `Sponsor level: ${level.amount ? `${level.name} ($${level.amount}+)` : level.name}`,
    `Amount: ${values.amount ? `$${values.amount}` : "(not given)"}`,
    `Name on the shirt: ${values.shirtText || values.business}`,
  ];
  if (values.message) lines.push("", "Message:", values.message);
  // A mailto link can't attach a file, so remind them to attach the logo themselves.
  if (level.reward?.includes("logo")) {
    lines.push("", `Logo: please attach your logo to this email for your ${level.reward} on the shirt (PNG, SVG, or PDF, as large as you have it).`);
  }

  const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  showEmailLink(form, href,
    `Your email app should open with everything filled in. Check it over${level.reward?.includes("logo") ? ", attach your logo," : ""} and press Send. If nothing opened, use the button below or write to us at ${to}.`);
  window.location.href = href;
};

const grabSponsorValues = (form) => {
  const option = form.querySelector("#sponsor-level").selectedOptions[0];
  return {
    business: form.querySelector("#business").value.trim(),
    contactName: form.querySelector("#contact-name").value.trim(),
    email: form.querySelector("#sponsor-email").value.trim(),
    phoneNumber: form.querySelector("#sponsor-phone").value.trim(),
    level: {
      id: option.value,
      name: option.dataset.name,
      amount: Number(option.dataset.amount) || 0,
      reward: option.dataset.reward,
    },
    // "$1,000.00" -> "1000.00"
    amount: form.querySelector("#sponsor-amount").value.trim().replace(/[$,\s]/g, ""),
    shirtText: form.querySelector("#shirt-text").value.trim(),
    message: form.querySelector("#sponsor-message").value.trim(),
    honeyPot: form.querySelector("#sponsor-website").value.trim(),
  };
};

// validator.js may fail to load; the browser's own checks (required,
// type="email") have already run by then, so only the extra checks are skipped.
const validateSponsor = ({ business, contactName, email, phoneNumber, level, amount }, validator) => {
  const errors = [];
  if (!business) errors.push("Business or sponsor name is required.");
  if (!contactName) errors.push("Contact name is required.");
  if (validator && !validator.isEmail(email)) errors.push("Valid email is required.");
  if (phoneNumber && validator && !validator.isMobilePhone(phoneNumber, "any")) errors.push("Valid phone number is required.");
  if (!level.id) errors.push("Please choose a sponsor level.");
  if (amount) {
    const dollars = Number(amount);
    if (!Number.isFinite(dollars) || dollars <= 0) {
      errors.push("Amount should be a number, such as 250.");
    } else if (level.amount && dollars < level.amount) {
      errors.push(`${level.name} starts at $${level.amount}. Choose a lower level or raise the amount.`);
    }
  }
  return errors;
};

// A "Send by email" link for a filled-in mailto. Built with DOM properties
// rather than innerHTML because the link contains what the visitor typed.
const showEmailLink = (form, href, message) => {
  const msg = document.createElement("div");
  msg.className = "form-message mt-6 p-4 rounded-lg border border-tech bg-gray-900 text-gray-200";
  msg.setAttribute("role", "alert");

  const text = document.createElement("p");
  text.className = "mb-4";
  text.textContent = message;

  const link = document.createElement("a");
  link.href = href;
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

const validate = ({ name, phoneNumber, email, message, honeyPot }, validator) => {
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