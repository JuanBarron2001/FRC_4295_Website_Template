const createImage = () => {
    const image = document.createElement('img');
    image.src = './images/banner/Hudson_FRC_4295_Banner_Cropped.png';
    image.alt = 'Hudson Stingers Banner';
    image.classList.add('banner');

    return image;
};

const createTitle = () => {
    const divTitle = document.createElement('div');
    divTitle.classList.add('header-content');
    divTitle.style.backgroundColor = '#5A5A5A'; 

    const headerTitle = document.createElement('h1');
    headerTitle.classList.add('display-4');
    headerTitle.innerHTML = 'Hudson Stingers';

    divTitle.appendChild(headerTitle);

    return divTitle;
};

const createNavButton = () => {
    const button = document.createElement('button');
    button.classList.add('navbar-toggler-icon', 'd-lg-none');
    button.type = 'button';
    button.dataset.toggle = 'collapse';
    button.dataset.target = '#navbarNav';
    button.setAttribute('aria-controls', 'navbarNav');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Toggle navigation');

    return button;
};

const createListItem = (link, text) => {
    const listItem = document.createElement('li');
    listItem.classList.add('nav-item');

    const anchor = document.createElement('a');
    anchor.classList.add('nav-link');
    anchor.href = link;
    anchor.innerHTML = text;

    listItem.appendChild(anchor);
    return listItem;
}

const createDiv = () => {
    const div = document.createElement('div');
    div.classList.add('collapse', 'navbar-collapse');
    div.setAttribute('id', 'navbarNav');
    div.style.backgroundColor = 'gray'; 

    const unorderedList = document.createElement('ul');
    unorderedList.classList.add('navbar-nav', 'mx-auto');

    unorderedList.appendChild(createListItem('./index.html', 'Home'));
    unorderedList.appendChild(createListItem('./about.html', 'About'));
    unorderedList.appendChild(createListItem('./about_first.html', 'About FIRST'));
    unorderedList.appendChild(createListItem('./contact_us.html', 'Contact Us'));
    unorderedList.appendChild(createListItem('./follow_us.html', 'Follow Us'));
    unorderedList.appendChild(createListItem('./members.html', 'Members'));
    unorderedList.appendChild(createListItem('./gallery.html', 'Gallery'));
    unorderedList.appendChild(createListItem('./blog.html', 'Blog'));
    unorderedList.appendChild(createListItem('./sponsors.html', 'Sponsors'));

    div.appendChild(unorderedList);
    return div;
};

const createNav = () => {
    const nav = document.createElement('nav');
    nav.classList.add('navbar', 'navbar-expand-lg', 'navbar-light', 'bd-light');

    nav.appendChild(createNavButton());
    nav.appendChild(createDiv());

    return nav;
};

document.addEventListener("DOMContentLoaded", () => {
    const header = document.createElement('header');//document.body.getElementsByTagName('header')[0];
    header.appendChild(createImage());

    document.body.prepend(createNav());
    document.body.prepend(createTitle());
    document.body.prepend(header);
});



