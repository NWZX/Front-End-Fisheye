export const UIElements = {
    photographer: {
        name: document.querySelector("#ui-name"),
        avatar: document.querySelector("#ui-avatar"),
        location: document.querySelector("#ui-location"),
        tagline: document.querySelector("#ui-tagline"),
    },
    component: {
        contactBtn: document.querySelector("#ui-contact-btn"),
        selectbox: document.querySelector("#selectbox-sorter"),
        selectboxData: [{ title: "Popularité", property: "likes" }, { title: "Date", property: "date" }, { title: "Titre", property: "title" }],
        galleryGrid: document.querySelector("#photograph-images"),
        counter: document.querySelector("#ui-counter"),
    },
    modal: {
        lightboxModal: document.querySelector("#lightbox_modal"),
        contactModal: document.querySelector("#contact_modal"),
    }
};