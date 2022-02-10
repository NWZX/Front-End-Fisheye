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
          <img src="img_data/Photographers ID Photos/${portrait}" alt="" loading="lazy"/>
          <h2>${name}</h2>
        </a>
        <p>
          <span>${city}, ${country}</span><br />
          <span>${tagline}</span><br />
          <span>${price}€</span>
        </p>
    `;
    return {
        getUserCardDOM: () => userCardDOM
    }
}
