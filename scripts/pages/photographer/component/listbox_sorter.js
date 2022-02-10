/** @typedef {object} IOptionsValues
 * @property {string} title
 * @property {string} property
 */


const selectboxToggle = (buttonElement) => {
    if (buttonElement.getAttribute("aria-expanded") == "false") {
        buttonElement.setAttribute("aria-expanded", "true");
        buttonElement.children[0].classList.remove("fa-chevron-down");
        buttonElement.children[0].classList.add("fa-chevron-up");
    } else {
        buttonElement.setAttribute("aria-expanded", "false");
        buttonElement.children[0].classList.remove("fa-chevron-up");
        buttonElement.children[0].classList.add("fa-chevron-down");
    }
}

/**
 * Generate listbox option elements
 * @param {HTMLDivElement} listboxElement
 * @param {IOptionsValues[]} values
 */
const createSelectboxOption = (listboxElement, values) => {
    const selectboxFrag = document.createDocumentFragment();
    values.forEach((value, i) => {
        const optionElement = document.createElement("div");
        optionElement.setAttribute("role", "option");
        optionElement.setAttribute("tabindex", "0");
        optionElement.setAttribute("data-index", i);
        optionElement.addEventListener("click", () => { listboxSelect(optionElement, i, value); });
        optionElement.addEventListener("keypress", (e) => { e.key == "Enter" && listboxSelect(optionElement, i, value); });

        i == 0 && optionElement.classList.add("selectbox-option-selected");
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
 * @param {IOptionsValues} value Value associated with the option
 */
const listboxSelect = (listboxOptionElement, index, value) => {
    const buttonElement = listboxOptionElement.parentElement.parentElement.children[0];
    const listboxElement = listboxOptionElement.parentElement;
    listboxElement.childNodes.forEach(
        /**
         * This function is called for each child node of the listbox
         * @param {HTMLDivElement} child 
         */
        (child) => { child.classList?.remove("selectbox-option-selected"); }
    );
    listboxOptionElement.classList.add("selectbox-option-selected");

    const temp = buttonElement.innerHTML.replace(buttonElement.innerText.trim(), listboxOptionElement.innerText);
    buttonElement.innerHTML = temp;

    listboxElement.dispatchEvent(new CustomEvent("select", {detail: {index: index, value: value}}));
    selectboxToggle(buttonElement);
}

/**
 * 
 * @param {HTMLDivElement} selectboxElement 
 * @param {IOptionsValues[]} values
 * @param {(e: Event) => void} callback
 */
export const createSelectbox = (selectboxElement, values, onSelect) => {
    const [selectboxSortersButton, selectboxSortersListbox] = selectboxElement.children;
    createSelectboxOption(selectboxSortersListbox, values);

    selectboxSortersButton.addEventListener("click", (e) => {
        selectboxToggle(selectboxSortersButton)
        selectboxSortersListbox.children[1].focus();
    });

    selectboxSortersListbox.addEventListener("select", (e) => {
        console.log(e.detail);
        onSelect(e.detail);
    });
};