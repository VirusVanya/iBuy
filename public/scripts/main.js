let avatar = document.getElementsByClassName('profile-icon')[0];
let menu = document.getElementsByClassName('profile-options')[0];
let main = document.getElementsByTagName('main')[0];
let footer = document.getElementsByTagName('footer')[0];

avatar.addEventListener('click', () => {
    if(menu.style.display == 'none') {
        menu.style.display = 'flex';
    } else {
        menu.style.display = 'none';
    }
});

main.addEventListener('click', () => {
    menu.style.display = 'none';
});

footer.addEventListener('click', () => {
    menu.style.display = 'none';
});