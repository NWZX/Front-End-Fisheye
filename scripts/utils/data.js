/** @typedef {object} MediaObject
 * @property {number} media.id
 * @property {number} media.photographerId
 * @property {string} media.title
 * @property {string} [media.image]
 * @property {number} media.likes
 * @property {string} media.date
 * @property {number} media.price
 * @property {string} [media.video]
 */
/** @typedef {object} PhotographerObject
 * @property {number} photographers.id
 * @property {string} photographers.name
 * @property {string} photographers.city
 * @property {string} photographers.country
 * @property {string} photographers.tagline
 * @property {number} photographers.price
 * @property {string} photographers.portrait
*/
/** @typedef {object} JsonObject
 * @property {PhotographerObject[]} photographers
 * @property {MediaObject[]} media
 * @property {MediaObject[]} lightboxMedia
 * @property {number} lightboxPosition
 */
/** @typedef {object} FormDataSubmit
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} message
 */


/**
 * Global state object
 * @type {JsonObject}
 */
export const globalState = {
    media: [],
    photographers: [],
    lightboxMedia: [],
    lightboxPosition: 0,
}

/**
 * Initialize the global state with the data from the json file
 * @returns {Promise<json>}
 */
export const initData = async () => {
    try {
        const response = await fetch('./data/photographers.json');
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const data = await response.json();
        globalState.media = data.media;
        globalState.photographers = data.photographers;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Sort the media array by a property
 * @param {MediaObject[]} mediaArray 
 * @param {string} sortBy 
 * @returns {MediaObject[]}
 */
export const sortMediaObjects = (mediaArray, sortBy) => {
    switch (sortBy) {
    case 'title':
        return mediaArray.sort((a, b) => { return a[sortBy] < b[sortBy] ? -1 : 1; });
    default:
        return mediaArray.sort((a, b) => { return a[sortBy] < b[sortBy] ? 1 : -1; });
    }
}

/**
 * Get all media linked to the photographer
 * @param {number} [photographerId] 
 * @returns {Promise<MediaObject[] | null>}
 */
export const getAllMedia = async (photographerId) => {
    const result = !photographerId ? globalState.media : globalState.media.filter((n) => n.photographerId === photographerId);
    return result.length > 0 ? result : null;
}

/**
 * Get media with the associated id
 * @param {number} id 
 * @returns {Promise<MediaObject | null>}
 */
export const getMedia = async (id) => {
    const result = globalState.media.filter((n) => n.photographerId === id);
    return result.length > 0 ? result[0] : null;
}

/**
 * Get all photographers
 * @returns {Promise<PhotographerObject[]>}
 */
export const getAllPhotographers = async () => {
    return globalState.photographers;
}

/**
 * Get photographer with the associated id
 * @param {number} id 
 * @returns {Promise<PhotographerObject | null>}
 */
export const getPhotographer = async (id) => {
    const result = globalState.photographers.filter((n) => n.id === id);
    return result.length > 0 ? result[0] : null;
}

export const setLightboxMedia = (sortedMedia) => {
    globalState.lightboxMedia = sortedMedia;
}
export const getLightboxMediaByIndex = (index) => {
    return globalState.lightboxMedia[index];
}