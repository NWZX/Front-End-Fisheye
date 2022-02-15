import { getPhotographer, getAllMedia, initData, sortMediaObjects, setLightboxMedia } from "../../utils/data.js";
import { isInteger } from "../../utils/utils.js";
import { createSelectbox } from "./component/selectbox.js";
import { displayContactModal, initContactModal } from "./modals/contact.js";
import { initLightbox, showLightboxModal } from './modals/lightbox.js';


import { UIElements } from "./UIElements.js";

/**
 * Create media card sub element
 * @param {string} title 
 * @param {number} likes 
 * @returns {HTMLDivElement}
 */
const createMediaCardSub = (title, likes) => {
    const mediaCardDOM = document.createElement("div");
    mediaCardDOM.classList.add("images_bottom");

    const titleDOM = document.createElement("p");
    titleDOM.innerHTML = title;

    const likesDOM = document.createElement("span");
    likesDOM.innerText = `${likes} `;
    const likesIcon = document.createElement("i");
    likesIcon.classList.add("fa-solid", "fa-heart");
    likesIcon.title = "Likes";
    likesIcon.addEventListener("click", (e) => {
        e.preventDefault();
        likesDOM.innerText = `${likes + 1} `;
        likesDOM.appendChild(likesIcon);
    });

    likesDOM.appendChild(likesIcon);
    mediaCardDOM.appendChild(titleDOM);
    mediaCardDOM.appendChild(likesDOM);
    return mediaCardDOM;
}

/**
 * Create media card content
 * @param {"img" | "video"} type 
 * @param {string} filename 
 * @param {string} title 
 * @returns {HTMLDivElement}
 */
const createMediaCardContent = (type, filename, title) => {
    const content = document.createElement(type);
    content.setAttribute("src", `assets/images/${filename}`);
    content.onerror = () => { type == "img" && content.setAttribute("src", `assets/images/Missing_Image.svg`) };
    content.setAttribute("alt", title);
    type == "img" && content.setAttribute("loading", "lazy");
    return content;
}
/**
 * Create media card
 * @param {import("../../utils/data.js").MediaObject} media 
 * @param {number} index 
 * @returns {HTMLDivElement}
 */
const createMediaCard = (media, index) => {
    const { title, likes, image, video } = media;
    const userCardDOM = document.createElement("div");
    userCardDOM.id = `photographer-media-${index}`;
    const link = document.createElement("a");
    link.setAttribute("title", title);
    link.setAttribute("tabindex", "0");
    link.addEventListener("click", (e) => {
        e.preventDefault();
        showLightboxModal(UIElements.modal.lightboxModal, index);
    });
    
    let content = "";
    if (image) {
        link.setAttribute("href", `/photographer/media/${media.image}`);
        content = createMediaCardContent("img", image, title)
    } else {
        link.setAttribute("href", `/photographer/media/${media.video}`);
        content = createMediaCardContent("video", video, title);
    }

    link.appendChild(content);
    userCardDOM.appendChild(link);
    userCardDOM.appendChild(createMediaCardSub(title, likes));
    return userCardDOM;
}

/**
 * Create image gallery
 * @param {import("../../utils/data").MediaObject[]} media 
 * @returns {TStat}
 */
const createGrid = async (media) => {
    const stats = {
        totalMedia: media.length,
        totalLikes: 0,
        totalPrice: 0,
    }

    const gridFrag = document.createDocumentFragment();
    media.forEach((mediaItem, i) => {
        gridFrag.appendChild(createMediaCard(mediaItem, i));
        stats.totalLikes += mediaItem.likes;
        stats.totalPrice += mediaItem.price;
    });
    UIElements.component.galleryGrid.replaceChildren(gridFrag);
    return stats;
};

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
    UIElements.photographer.avatar.setAttribute("src", `assets/photographers/${photographer.portrait}`);
    UIElements.photographer.avatar.setAttribute("alt", photographer.name);

    const mediaStat = await createGrid(sortedMedia);
    UIElements.component.counter.children[0].innerHTML = `${mediaStat.totalLikes} <i class="fa-solid fa-heart" title="Likes"></i>`;
    UIElements.component.counter.children[1].innerHTML = `${photographer.price} €`;

    createSelectbox(UIElements.component.selectbox, UIElements.component.selectboxData, ({ value }) => {
        const sortedMedia = sortMediaObjects(media, value.property);
        setLightboxMedia(sortedMedia);
        createGrid(sortedMedia);
    });
}

let params = new URLSearchParams(document.location.search);
if (isInteger(params.get("id"))) {
    init(parseInt(params.get("id"), 10));
} else {
    document.location.href = "index.html";
}
