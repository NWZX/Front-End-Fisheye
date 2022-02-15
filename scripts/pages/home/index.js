import { getAllPhotographers, initData } from "../../utils/data.js";
import { UIElements } from "./UIElements.js";

/**
 * Create Photographer element from data (BETTER SOLUTION/LESS CODE)
 * @param {*} photographer Photographer object
 * @returns Html DOM element
 */
function photographerFactory(photographer) {
    const { id, name, portrait, city, country, price, tagline } = photographer;
    const userCardDOM = document.createElement("article");
    userCardDOM.innerHTML = `
        <a href="/photographer.html?id=${id}" alt="${name}">
          <img src="assets/photographers/${portrait}" alt="" loading="lazy"/>
          <h2>${name}</h2>
        </a>
        <p>
          <span>${city}, ${country}</span><br />
          <span>${tagline}</span><br />
          <span>${price}€</span>
        </p>
    `;
    return userCardDOM;
}

async function displayData(photographers) {
    const photographersSection = UIElements.component.photographerGrid;

    const fragment = document.createDocumentFragment();
    photographers.forEach((photographer) => {
        fragment.appendChild(photographerFactory(photographer));
    });
    photographersSection.replaceChildren(fragment);
}


(async () => {
    // Récupère les datas des photographes
    await initData();
    const photographers = await getAllPhotographers();
    displayData(photographers);
})();

