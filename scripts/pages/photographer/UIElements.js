export const UIElements = {
    component: {
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