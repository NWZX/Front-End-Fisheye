import { getLightboxMediaByIndex, globalState } from "../../../utils/data.js";
import { UIElements } from "../UIElements.js";

/**
 * Initializes the lightbox modal event listeners
 * @param {HTMLDivElement} lightboxElement 
 */
export const initLightbox = (lightboxElement) => {
    lightboxElement.getElementsByClassName("lightbox-modal-close")[0].addEventListener("click", (e) => {
        closeLightboxModal(lightboxElement);
    });
    lightboxElement.getElementsByClassName("lightbox-modal-next")[0].addEventListener("click", (e) => {
        updateLightboxModal(lightboxElement, globalState.lightboxPosition + 1);
    });
    lightboxElement.getElementsByClassName("lightbox-modal-prev")[0].addEventListener("click", (e) => {
        updateLightboxModal(lightboxElement, globalState.lightboxPosition - 1);
    });
}

/**
 * 
 * @param {HTMLDivElement} lightboxElement 
 * @param {number} index 
 */
export const showLightboxModal = (lightboxElement, index) => {
    updateLightboxModal(lightboxElement, index);
    lightboxElement.style.display = "block";
    lightboxElement.getElementsByClassName("lightbox-modal-prev")[0].focus();
}

export const closeLightboxModal = (lightboxElement) => {
    lightboxElement.style.display = "none";
    UIElements.component.galleryGrid.focus();
}

/**
 * 
 * @param {HTMLDivElement} lightboxElement 
 * @param {import("../../../utils/data").MediaObject} [MediaObject]
 */
const updateLightboxModal = (lightboxElement, index) => {
    const mediaObject = getLightboxMediaByIndex(index);
    if (!mediaObject) {
        lightboxElement.style.display = "none";
        return;
    }
    if (mediaObject.image) {
        lightboxElement.children[0].children[1].innerHTML = `<img class="modal-image-view" loading="lazy" src="assets/images/${mediaObject.image}" />`
    } else if (mediaObject.video) {
        lightboxElement.children[0].children[1].innerHTML = `<video class="modal-image-view" src="assets/images/${mediaObject.video}" autoplay loop />`
    }
    globalState.lightboxPosition = index;
}