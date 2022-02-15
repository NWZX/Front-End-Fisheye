import { UIElements } from "../UIElements.js";

/**
 * Close the Selectbox
 * @param {HTMLButtonElement} buttonElement 
 * @param {boolean} [reFocus = false] Focus the button
 */
const selectboxClose = (buttonElement, reFocus = false) => {
    buttonElement.setAttribute("aria-expanded", "false");
    buttonElement.children[0].classList.remove("fa-chevron-up");
    buttonElement.children[0].classList.add("fa-chevron-down");
    reFocus && buttonElement.focus();
}

/**
 * Open the Selectbox
 * @param {HTMLButtonElement} buttonElement 
 */
const selectboxOpen = (buttonElement) => {
    buttonElement.setAttribute("aria-expanded", "true");
    buttonElement.children[0].classList.remove("fa-chevron-down");
    buttonElement.children[0].classList.add("fa-chevron-up");
}

/**
 * Toggle the selectbox (open/close)
 * @param {HTMLButtonElement} buttonElement 
 * @param {boolean} [reFocus = false] Focus the button on close
 */
const selectboxToggle = (buttonElement, reFocus = false) => {
    if (buttonElement.getAttribute("aria-expanded") == "false") {
        selectboxOpen(buttonElement);
    } else {
        selectboxClose(buttonElement, reFocus);
    }
}

/** @typedef {object} IOptionsValues
 * @property {string} title
 * @property {string} property
 */
/**
 * Generate listbox option elements
 * @param {HTMLDivElement} listboxElement
 * @param {HTMLButtonElement} buttonElement
 * @param {IOptionsValues[]} values
 */
const createSelectboxOption = (listboxElement, buttonElement, values) => {
    const selectboxFrag = document.createDocumentFragment();
    values.forEach((value, i) => {
        const optionElement = document.createElement("div");
        optionElement.setAttribute("role", "option");
        optionElement.setAttribute("tabindex", "0");
        optionElement.addEventListener("click", () => { listboxSelect(optionElement, i, values); });
        optionElement.addEventListener("keydown", (e) => {
            e.preventDefault();
            switch (e.key) {
            case "Enter":
                listboxSelect(optionElement, i, values);
                break;
            case "ArrowDown":
                optionElement.nextElementSibling && optionElement.nextElementSibling.focus();
                break;
            case "ArrowUp":
                optionElement.previousElementSibling && optionElement.previousElementSibling.id != "selectbox-option-selected"
                    ? optionElement.previousElementSibling.focus()
                    : buttonElement.focus();
                break;
            case "Escape":
                selectboxClose(buttonElement);
                break;
            default:
                break;
            }
        });

        i == 0 && optionElement.setAttribute("id", "selectbox-option-selected");
        optionElement.innerHTML = value.title;
        selectboxFrag.appendChild(optionElement);
    });
    listboxElement.replaceChildren(selectboxFrag);
}

/**
 * 
 * @param {HTMLButtonElement} buttonElement 
 * @param {HTMLDivElement} listboxOptionElement 
 * @param {number} index 
 * @param {IOptionsValues[]} values Value associated with the option
 */
const listboxSelect = (listboxOptionElement, index, values) => {
    const buttonElement = listboxOptionElement.parentElement.parentElement.children[0];
    const listboxElement = listboxOptionElement.parentElement;

    const temp = buttonElement.innerHTML.replace(buttonElement.innerText.trim(), listboxOptionElement.innerText);
    buttonElement.innerHTML = temp;

    [values[0], values[index]] = [values[index], values[0]];

    createSelectboxOption(listboxElement, buttonElement, values);

    listboxElement.dispatchEvent(new CustomEvent("select", {detail: {index: index, value: values[0]}}));
    selectboxClose(buttonElement, true);
}

/**
 * 
 * @param {HTMLDivElement} selectboxElement 
 * @param {IOptionsValues[]} values
 * @param {(e: Event) => void} callback
 */
export const createSelectbox = (selectboxElement, values, onSelect) => {
    const [selectboxSortersButton, selectboxSortersListbox] = selectboxElement.children;
    createSelectboxOption(selectboxSortersListbox, selectboxSortersButton, values);

    selectboxSortersButton.addEventListener("click", () => {
        selectboxToggle(selectboxSortersButton)
    });

    selectboxSortersButton.addEventListener("keydown",
        /**
         * 
         * @param {KeyboardEvent} e 
         */
        (e) => {
        //e.preventDefault();
            switch (e.key) {
            case "Enter":
                selectboxToggle(selectboxSortersButton, true);
                e.preventDefault();
                break;
            case "ArrowDown":
                selectboxSortersListbox.children[1].focus();
                e.preventDefault();
                break;
            case "Tab":
                if (e.shiftKey) {
                    selectboxClose(selectboxSortersButton);
                }
                else {
                    selectboxClose(selectboxSortersButton);
                    UIElements.component.galleryGrid.children[0].children[0].focus();
                    e.preventDefault();
                }
                break;
            }
        });
    

    selectboxSortersListbox.addEventListener("select", (e) => {
        onSelect(e.detail);
    });
};