import validator from "https://cdn.jsdelivr.net/npm/validator@13.11.0/+esm";

let form = ''
let endpoint = ''

let name = '';
let phone = '';
let email = '';
let comment = '';

document.addEventListener("DOMContentLoaded", function () {
    const section = document.querySelector("section[data-form-id]");
    form = section.querySelector("form");

    endpoint = section.dataset.lambdaUrl;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    resetMessage();

    grabValuesFromForm();

    const errors = grabErrorsFromFormInputs();
    if (errors.length > 0) {
      const message = "❌ Please fix the following:<br>" + errors.join("<br>");
      showMessage(false, message);
      return;
    }

    disableSubmitButton();

    const payload = createPayload();

    makeAPICallFormSubmit(payload);
  });
});

const grabValuesFromForm = () => {
  name = form.querySelector("#name").value.trim();
  phone = form.querySelector("#phone").value.trim();
  email = form.querySelector("#email").value.trim();
  comment = form.querySelector("#comment").value.trim();
};

const resetMessage = () => {
    const oldMsg = form.parentElement.querySelector(".form-message");
    if (oldMsg) oldMsg.remove();
};

const grabErrorsFromFormInputs = () => {
  let errors = [];
  if (validator.isEmpty(name)) errors.push("Name is required.");
  if (!validator.isEmail(email)) errors.push("Valid email is required.");
  if (validator.isEmpty(phone)) {
    errors.push("Phone number is required.");
  } else if (!validator.isMobilePhone(phone, "any")) {
    errors.push("Valid phone number is required.");
  }
  if (validator.isEmpty(comment)) errors.push("Comment is required.");

  return errors;
};

const disableSubmitButton = () => {
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending...";
};

const enableSubmitButton = () => {
  const button = form.querySelector("button[type=submit]");
  button.disabled = false;
  button.textContent = "Submit";
}

const createPayload = () => {
  return {
    name: name,
    phoneNumber: phone,
    email: email,
    message: comment
  };
};

const makeAPICallFormSubmit = (payload) => {
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
        enableSubmitButton();

        resetMessage();

        showMessage(true, data.message);

        form.style.display = "none";
      })
      .catch((err) => {
        enableSubmitButton();

        resetMessage();

        const message = "❌ Something went wrong. Please try again.";
        showMessage(false, message);
      });
};

const showMessage = (isSuccess, message) => {
  const cssClass = `form-message alert mt-4 ${isSuccess ? "alert-success" : "alert-danger"}`;

  const msg = document.createElement("div");
  msg.className = cssClass;
  msg.innerHTML = message;

  form.parentElement.appendChild(msg);
}