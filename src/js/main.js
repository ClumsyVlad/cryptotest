/* Slider */
let cardsSlider = new Swiper('.gallery', {
    slidesPerView: 'auto',
    slidesPerGroup: 2,
    spaceBetween: 0,
    speed: 500,
    pagination: {
        el: '.gallery__pagination',
    },
});
if (window.matchMedia('(max-width: 480px)').matches) {
    cardsSlider.slidesPerGroup = 'auto';
};
/* Section observer */
let sections = document.querySelectorAll('.section');
let header = document.querySelector('.header');
let footer = document.querySelector('.footer');
let sideSocials = document.querySelector('.socials')
let headerLinks = document.querySelectorAll('.header__link');
let paddingArray = document.querySelectorAll('.section, .header, .footer');
let observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.2,
};
function scrollEvents(entries, observer) {
 entries.forEach(entry => {
    if (entry.isIntersecting) {
        let el = entry.target.dataset.onview;
        headerLinks.forEach(item => {
            item.classList.remove('header__link--active');
            if (item.dataset.viewed == el) {
                item.classList.add('header__link--active');
            };
        });
    };
 });
};
const scrollObserver = new IntersectionObserver(scrollEvents, observerOptions);
sections.forEach(section => scrollObserver.observe(section));

/* Open modals */

let resizeObserver = null;
let modalTrigger = document.querySelectorAll('.modal--trigger');
[...document.querySelectorAll(".modal")].forEach((modal) => {
    modal.addEventListener("transitionend", (event) => {
        if (event.propertyName === "transform" && document.body.dataset.openModalId === "") {
            document.body.style.paddingRight = "";
            document.body.style.overflow = "visible";
        }
    });
});

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal__close") || event.target.classList.contains("modal--active")) {
        event.preventDefault();

        const modal = document.getElementById(document.body.dataset.openModalId);

        if (modal) {
            modal.classList.remove("modal--active");
            unbindResizeObserver(modal);
        }
        document.body.dataset.openModalId = "";
        document.body.removeAttribute('style');
        paddingArray.forEach(item => {
            item.removeAttribute('style');
        });
        player.pause();
    };
});
modalTrigger.forEach(item => {
    item.addEventListener('click', (event) => {
        event.preventDefault();

        const modalId = item.getAttribute("href").replace("#", "");
        const modal = document.getElementById(modalId);
        paddingArray.forEach(item => {
            item.style.paddingRight = `${getScrollbarWidth()}px`;
        });
        document.body.style.overflow = "hidden";
        document.body.dataset.openModalId = modalId;

        modal.classList.add("modal--active");

        bindResizeObserver(modal);
        if(item.classList.contains('video-modal')) {
            player.play();
        };
    });
});
    /* Bind observer */ 
function bindResizeObserver(modal) {
    const content = modal.querySelector(".modal__body");

    const toggleShadows = () => {
        modal.classList.toggle(
            "modal--has-scroll",
            content.scrollHeight > content.clientHeight
        );
    };

    resizeObserver = new ResizeObserver(toggleShadows);
    resizeObserver.observe(content);
};

    /* Unbind observer */
function unbindResizeObserver(modal) {
    const content = modal.querySelector(".modal__body");

    resizeObserver.unobserve(content);
    resizeObserver = null;
};

    /* Get scrollbar width */
function getScrollbarWidth() {
    const outer = document.createElement("div");

    outer.style.visibility = "hidden";
    outer.style.overflow = "scroll";
    outer.style.msOverflowStyle = "scrollbar";
    outer.style.position = "absolute";
    outer.style.top = "-9999px";
    outer.style.width = "50px";
    outer.style.height = "50px";

    document.body.appendChild(outer);
    const scrollBarWidth = outer.offsetWidth - outer.clientWidth;
    document.body.removeChild(outer);

    return scrollBarWidth;
};

/* Video player */
const player = new Plyr('#hero-player', {
    volume: 1
});
window.player = player;