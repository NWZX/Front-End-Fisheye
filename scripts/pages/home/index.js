import { getAllPhotographers, initData } from "../../utils/data.js";
import { UIElements } from "./UIElements.js";

/**
 * @typedef {import("../../utils/data.js").PhotographerObject} PhotographerObject
 */

/**
 * Create photographer media card
 * @param {PhotographerObject} photographer Photographer object
 * @returns {HTMLDivElement}
 */
const photographerFactory = (photographer) => {
    const { id, name, portrait, city, country, price, tagline } = photographer;
    const userCardDOM = document.createElement("article");
    userCardDOM.innerHTML = `
        <a href="/photographer.html?id=${id}" alt="${name}">
          <img src="assets/photographers/${portrait}" alt="" loading="lazy"/>
          <h2>${name}</h2>
        </a>
        <address>${city}, ${country}</address>
        <p>
          <span>${tagline}</span><br />
          <span>${price}€</span>
        </p>
    `;
    return userCardDOM;
}


/**
 * Create photographer grid
 * @param {PhotographerObject[]} photographers 
 */
const createGrid = async (photographers) => {
    const photographersSection = UIElements.component.photographerGrid;

    const fragment = document.createDocumentFragment();
    photographers.forEach((photographer) => {
        fragment.appendChild(photographerFactory(photographer));
    });
    photographersSection.replaceChildren(fragment);
}


/**
 * Initialize home page
 */
(async () => {
    // Récupère les datas des photographes
    await initData();
    const photographers = await getAllPhotographers();
    createGrid(photographers);
})();

