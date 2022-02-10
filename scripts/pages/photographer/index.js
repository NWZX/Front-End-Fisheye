import { getPhotographer, getAllMedia, initData, sortMediaObjects, setLightboxMedia } from "../../utils/data.js";
import { createSelectbox } from "./component/listbox_sorter.js";
import { displayContactModal, initContactModal } from "./modals/contact.js";
import { initLightbox, showLightboxModal } from './modals/lightbox.js';
;

import { UIElements } from "./UIElements.js";

const createMediaCardSub = (title, likes) => {
    const mediaCardDOM = document.createElement("div");
    mediaCardDOM.classList.add("images_bottom");
    mediaCardDOM.innerHTML = `
        <p>${title}</p>
        <span>${likes} ❤️</span>
    `;
    return mediaCardDOM;
}

/**
 * 
 * @param {"img" | "video"} type 
 * @param {*} likes 
 * @returns 
 */
const createMediaCardContent = (type, filename, title) => {
    const content = document.createElement(type);
    content.setAttribute("src", `assets/images/${filename}`);
    content.setAttribute("alt", title);
    type == "img" && content.setAttribute("loading", "lazy");
    return content;
}
/**
 * 
 * @param {import("../../utils/data.js").MediaObject} media 
 * @param {number} index 
 * @returns {HTMLDivElement}
 */
const createMediaCard = (media, index) => {
    const { id, title, likes, image, video } = media;
    const userCardDOM = document.createElement("div");
    userCardDOM.setAttribute("data-id", id);
    userCardDOM.style.order = index;
    const link = document.createElement("a");
    link.setAttribute("href", `javascript:void(0)`);
    link.setAttribute("title", title);
    link.setAttribute("tabindex", "0");
    link.addEventListener("click", () => {
        console.log(`${title} clicked`);
        showLightboxModal(UIElements.modal.lightboxModal, parseInt(userCardDOM.style.order));
    });

    const content = image ? createMediaCardContent("img", image, title) : createMediaCardContent("video", video, title);

    link.appendChild(content);
    userCardDOM.appendChild(link);
    userCardDOM.appendChild(createMediaCardSub(title, likes));
    return userCardDOM;
}

/**
 * 
 * @param {import("../../utils/data").MediaObject[]} media 
 */
async function createGrid(media) {
    const stats = {
        totalMedia: media.length,
        totalLikes: 0,
        totalPrice: 0,
    }

    const mediaSection = document.querySelector(".photograph-images");
    const gridFrag = document.createDocumentFragment();
    media.forEach((mediaItem, i) => {
        gridFrag.appendChild(createMediaCard(mediaItem, i));
        stats.totalLikes += mediaItem.likes;
        stats.totalPrice += mediaItem.price;
    });
    mediaSection.replaceChildren(gridFrag);
    return stats;
};

/**
 * Check if string is a integer
 */
function isInteger(value) {
    return !isNaN(value) &&
        parseInt(Number(value)) == value &&
        !isNaN(parseInt(value, 10));
}

export async function init(id) {
    // Récupère les datas des photographes
    await initData();
    const photographer = await getPhotographer(id);
    const media = await getAllMedia(id);
    const sortedMedia = sortMediaObjects(media, "likes");
    
    initContactModal(UIElements.modal.contactModal, photographer);
    UIElements.component.contactBtn.addEventListener("click", () => {
        displayContactModal(UIElements.modal.contactModal);
    });
    
    setLightboxMedia(sortedMedia);
    initLightbox(UIElements.modal.lightboxModal);

    // Création des éléments UI
    UIElements.photographer.name.innerHTML = photographer.name;
    UIElements.photographer.location.innerHTML = `${photographer.city}, ${photographer.country}`;
    UIElements.photographer.tagline.innerHTML = `${photographer.tagline}`;
    UIElements.photographer.avatar.setAttribute("src", `img_data/Photographers ID Photos/${photographer.portrait}`);

    const mediaStat = await createGrid(sortedMedia);
    UIElements.component.counter.children[0].innerHTML = `${mediaStat.totalLikes} ❤️`;
    UIElements.component.counter.children[1].innerHTML = `${photographer.price} €`;

    createSelectbox(UIElements.component.selectbox, UIElements.component.selectboxData, ({ index, value }) => {
        const sortedMedia = sortMediaObjects(media, value.property);
        setLightboxMedia(sortedMedia);
        createGrid(sortedMedia);
    });
};

let params = new URLSearchParams(document.location.search);
if (isInteger(params.get("id"))) {
    init(parseInt(params.get("id"), 10));
} else {
    document.location.href = "index.html";
}
