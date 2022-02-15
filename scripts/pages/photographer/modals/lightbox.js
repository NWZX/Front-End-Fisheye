import { getLightboxMediaByIndex, globalState } from "../../../utils/data.js";
import { captureTab } from "../../../utils/utils.js";

/**
 * Initializes the lightbox modal event listeners
 * @param {HTMLDivElement} lightboxElement 
 */
export const initLightbox = (lightboxElement) => {
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableContent = lightboxElement.querySelectorAll(focusableElements);
    lightboxElement.addEventListener("keydown", (e) => {
        switch (e.key) {
        case "ArrowLeft":
            updateLightboxModal(lightboxElement, globalState.lightboxPosition - 1);
            break;
        case "ArrowRight":
            updateLightboxModal(lightboxElement, globalState.lightboxPosition + 1);
            break;
        case "Escape":
            closeLightboxModal(lightboxElement);
            break;
        case "Tab":
            captureTab(e, focusableContent);
            break;
        default:
            break;
        }
    });

    lightboxElement.querySelector(".lightbox-modal-close").addEventListener("click", () => {
        closeLightboxModal(lightboxElement);
    });
    lightboxElement.querySelector(".lightbox-modal-close").addEventListener("keydown", (e) => {
        e.key === "Enter" && closeLightboxModal(lightboxElement);
    });
    lightboxElement.querySelector(".lightbox-modal-next").addEventListener("click", (e) => {
        e.preventDefault();
        updateLightboxModal(lightboxElement, globalState.lightboxPosition + 1);
    });
    lightboxElement.querySelector(".lightbox-modal-prev").addEventListener("click", (e) => {
        e.preventDefault();
        updateLightboxModal(lightboxElement, globalState.lightboxPosition - 1);
    });
}

/**
 * Opens the lightbox modal at the given index
 * @param {HTMLDivElement} lightboxElement 
 * @param {number} index 
 */
export const showLightboxModal = (lightboxElement, index) => {
    updateLightboxModal(lightboxElement, index);
    lightboxElement.style.display = "block";
    lightboxElement.getElementsByClassName("lightbox-modal-close")[0].focus();
}

/**
 * Close the lightbox modal and focus the last image shown
 * @param {HTMLDivElement} lightboxElement 
 */
export const closeLightboxModal = (lightboxElement) => {
    lightboxElement.style.display = "none";
    document.querySelector(`#photographer-media-${globalState.lightboxPosition}`).children[0].focus();
}

/**
 * Updates the lightbox modal with the given index
 * @param {HTMLDivElement} lightboxElement 
 * @param {number} index
 */
const updateLightboxModal = (lightboxElement, index) => {
    const mediaObject = getLightboxMediaByIndex(index);
    if (!mediaObject) {
        closeLightboxModal(lightboxElement);
        return;
    }
    if (mediaObject.image) {
        const img = new Image();
        img.src = `assets/images/${mediaObject.image}`;
        img.alt = mediaObject.title;
        img.tabIndex = 0;
        img.className = "modal-image-view";
        img.loading = "lazy";
        img.onerror = () => { img.src = "assets/images/Missing_Image.svg" };
        lightboxElement.children[0].children[1].replaceChildren(img);
    } else if (mediaObject.video) {
        lightboxElement.children[0].children[1].innerHTML = `<video class="modal-image-view" src="assets/images/${mediaObject.video}" aria-label="${mediaObject.title}" autoplay loop controls tabIndex="0" />`
    }
    globalState.lightboxPosition = index;
}