const createColumnDiv = (headerTitle) => {
    const columnDiv = document.createElement('div');
    columnDiv.classList.add('col-md-4', 'mb-3');

    const header = document.createElement('h5');
    header.innerHTML = headerTitle;

    columnDiv.appendChild(header);

    return columnDiv;
};

const createListItem2 = (link, text) => {
    const listItem = document.createElement('li');

    const anchor = document.createElement('a');
    anchor.classList.add('text-white');
    anchor.href = link;
    anchor.innerHTML = text;

    listItem.appendChild(anchor);
    return listItem;
}

const createQuickLinksColumn = () => {
    const div = createColumnDiv('Quick Link');

    const unorderedList = document.createElement('ul');
    unorderedList.classList.add('list-unstyled');

    unorderedList.appendChild(createListItem2('./index.html', 'Home'));
    unorderedList.appendChild(createListItem2('./about.html', 'About'));
    unorderedList.appendChild(createListItem2('./about_first.html', 'About FIRST'));
    unorderedList.appendChild(createListItem2('./contact_us.html', 'Contact Us'));
    unorderedList.appendChild(createListItem2('./follow_us.html', 'Follow Us'));
    unorderedList.appendChild(createListItem2('./members.html', 'Members'));
    unorderedList.appendChild(createListItem2('./gallery.html', 'Gallery'));
    unorderedList.appendChild(createListItem2('./blog.html', 'Blog'));
    unorderedList.appendChild(createListItem2('./sponsors.html', 'Sponsors'));

    div.appendChild(unorderedList);

    return div;
};

const SocialMediaLink = (link, icon) =>{
    const anchor = document.createElement('a');
    anchor.href = link;
    anchor.target = '_blank';
    anchor.classList.add('text-white', 'mx-2');

    const italics = document.createElement('i');
    italics.classList.add('fab', icon);

    anchor.appendChild(italics);
    
    return anchor;
}

const createSocialMediaColumn = () => {
    const div = createColumnDiv('Social Media');

    div.appendChild(SocialMediaLink('https://www.instagram.com/hudsonstingers4295', 'fa-instagram'));
    div.appendChild(SocialMediaLink('https://www.facebook.com/team4295', 'fa-facebook'));
    div.appendChild(SocialMediaLink('https://twitter.com/frc4295', 'fa-twitter'));

    return div;
};

const createContactUsColumn = () => {
    const div = createColumnDiv('Contact Us');

    const p1 = document.createElement('p');
    p1.innerHTML = 'Email: <a href="mailto:hudsonisdrobotics@gmail.com" class="text-white">hudsonisdrobotics@gmail.com</a>';

    const p2 = document.createElement('p');
    p2.innerHTML = 'Address: 6735 Ted Trout Dr, Lufkin, TX 75904';

    const img = document.createElement('img');
    img.src = './images/logos/FRC_Logo.png';
    img.alt = 'FRC Logo';
    img.classList.add('img-fluid', 'mx-auto', 'd-block', 'mt-2');

    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(img);

    return div;
};

const createContainerDiv = () => {
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('container');

    const rowDiv = document.createElement('div');
    rowDiv.classList.add('row');

    rowDiv.appendChild(createQuickLinksColumn());
    rowDiv.appendChild(createSocialMediaColumn());
    rowDiv.appendChild(createContactUsColumn());

    const hr = document.createElement('hr');
    hr.classList.add('bg-white');

    const p = document.createElement('p');
    p.classList.add('mb-0');
    p.innerHTML = '&copy; 2024 Hudson Stingers. Unauthorized reproduction of this text may result in robot rebellion. You’ve been warned. 😜';

    containerDiv.appendChild(rowDiv);
    containerDiv.appendChild(hr);
    containerDiv.appendChild(p);

    return containerDiv;
};

document.addEventListener("DOMContentLoaded", () => {
    const footer = document.createElement('footer');
    footer.appendChild(createContainerDiv());

    document.body.appendChild(footer);
});