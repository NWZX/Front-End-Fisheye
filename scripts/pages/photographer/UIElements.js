export const UIElements = {
    photographer: {
        name: document.getElementById("ui-name"),
        avatar: document.getElementById("ui-avatar"),
        location: document.getElementById("ui-location"),
        tagline: document.getElementById("ui-tagline"),
    },
    component: {
        contactBtn: document.getElementById("ui-contact-btn"),
        selectbox: document.getElementById("selectbox-sorter"),
        selectboxData: [{ title: "Popularité", property: "likes" }, { title: "Date", property: "date" }, { title: "Titre", property: "title" }],
        galleryGrid: document.getElementById("photograph-images"),
        counter: document.getElementById("ui-counter"),
    },
    modal: {
        lightboxModal: document.getElementById("lightbox_modal"),
        contactModal: document.getElementById("contact_modal"),
    }
}