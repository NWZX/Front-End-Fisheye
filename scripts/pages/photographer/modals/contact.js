import { isEmail } from "../../../utils/utils.js";

/**
 * 
 * @param {HTMLDivElement} contactModalElement 
 */
export const displayContactModal = (contactModalElement) => {
    contactModalElement.style.display = "block";
}

/**
 * 
 * @param {HTMLDivElement} contactModalElement 
 */
export const closeContactModal = (contactModalElement) => {
    contactModalElement.style.display = "none";
}

/**
 * 
 * @param {HTMLDivElement} contactModalElement 
 */
export const initContactModal = (contactModalElement, photographer) => {
    document.getElementById('contact-modal-title').innerHTML = `Contactez-moi<br>${photographer.name}`;
    contactModalElement.getElementsByClassName("contact-modal-close")[0].addEventListener("click", (e) => {
        closeContactModal(contactModalElement);
    });

    // Add realtime validation

    /**
     * @type {FormDataSubmit & HTMLFormElement} reserveForm
     */
    const contactForm = contactModalElement.getElementsByTagName("form")[0]
    checkFormRealtime(contactForm);

    // Add validation on submit

    contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        checkForm(e.target);
    });
}

const errorMessageFirstName = "Veuillez entrer 2 caractères ou plus pour le champ du prénom.";
const errorMessageLastName = "Veuillez entrer 2 caractères ou plus pour le champ du nom.";
const errorMessageEmail = "Veuillez entrer une adresse email valide.";
const errorMessageMessage = "Veuillez entrer 100 caractères ou plus pour le champ du message.";

/**
 * Validator for the names field
 * @param {string} value 
 * @returns {boolean}
 */
const validateNameField = (value) => {
  return value.trim().length > 1;
}

/**
 * Validator for the email field
 * @param {string} value 
 * @returns {boolean}
 */
const validateEmailField = (value) => {
  return isEmail(value);
}

/**
 * Validator for the message field
 * @param {string} value 
 * @returns {boolean}
 */
const validateMessageField = (value) => {
  return value.trim().length > 99;
}

/**
 * Show the validation error
 * @param {HTMLInputElement} inputElement Input element
 * @param {string} errorMessage Message to display
 * @param {boolean} [hide=true] Hide error on change
 */
const showError = (inputElement, errorMessage, hide = true) => {
  inputElement.parentElement.setAttribute("data-error", errorMessage);
  hide && hideError(inputElement);
}
/**
 * Hide the validation error
 * @param {HTMLInputElement} inputElement Input element
 */
const hideError = (inputElement) => {
  inputElement.addEventListener("focus", (e) => {
    inputElement.parentElement.removeAttribute('data-error');
  });
}

/**
 * Validation for text input elements
 * @param {HTMLInputElement} inputElement Input element
 * @param {validatorCallback} validator Callback to validate the input
 * @param {string} errorMessage Error message to display
 */
const textInputValidation = (inputElement, validator, errorMessage) => {
    if (!validator(inputElement.value)) {
      showError(inputElement, errorMessage);
      return false;
    }
  return true;
}


/**
 * Add realtime validation to the input elements
 * @param {HTMLInputElement} inputElement Input element
 * @param {validatorCallback} validator Callback to validate the input
 * @param {string} errorMessage Error message to display
 */
const textInputRealtimeValidation = (inputElement, validator, errorMessage) => {
  inputElement.addEventListener("keyup", (e) => {
    if (!validator(e.target.value)) {
      showError(e.target, errorMessage, false);
    } else {
      e.target.parentElement.removeAttribute('data-error');
    }
  });
}

/** 
 * Check data validity and transform it to {@link FormDataFinal}
 * @param {FormDataSubmit} data
 */
export const checkForm = (data) => {
  let isValid = true;
  
  isValid = isValid && textInputValidation(data.firstName, validateNameField, errorMessageFirstName);
  isValid = isValid && textInputValidation(data.lastName, validateNameField, errorMessageLastName);
  isValid = isValid && textInputValidation(data.email, validateEmailField, errorMessageEmail);
  isValid = isValid && textInputValidation(data.message, validateMessageField, errorMessageMessage);
}

/**
 * Check data validity (but only visualy)
 * @param {FormDataSubmit & HTMLFormElement} reserveForm 
 */
export const checkFormRealtime = (reserveForm) => {
  textInputRealtimeValidation(reserveForm.firstName, validateNameField, errorMessageFirstName);
  textInputRealtimeValidation(reserveForm.lastName, validateNameField, errorMessageLastName);
  textInputRealtimeValidation(reserveForm.email, validateEmailField, errorMessageEmail);
  textInputRealtimeValidation(reserveForm.message, validateMessageField, errorMessageMessage);
}