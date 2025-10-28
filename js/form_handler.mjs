import validator from "https://cdn.jsdelivr.net/npm/validator@13.11.0/+esm";

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
      showMessage(form, false, "❌ Something went wrong. Please try again.");
    } finally {
      enableSubmitButton(form);
    }
  });
});

const grabValuesFromForm = (form) => ({
  name: form.querySelector("#name").value.trim(),
  phoneNumber: form.querySelector("#phone").value.trim(),
  email: form.querySelector("#email").value.trim(),
  message: form.querySelector("#comment").value.trim(),
});

const validate = ({ name, phoneNumber, email, message }) => {
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
  msg.className = `form-message alert mt-4 ${isSuccess ? "alert-success" : "alert-danger"}`;
  msg.setAttribute("role", "alert");
  msg.innerHTML = message;
  form.parentElement.appendChild(msg);
};

const disableSubmitButton = (form) => {
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending...";
};

const enableSubmitButton = (form) => {
  const button = form.querySelector("button[type=submit]");
  button.disabled = false;
  button.textContent = "Submit";
};