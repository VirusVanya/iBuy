let post_block = document.getElementsByClassName('post-block')[0];
let post_image = document.getElementsByClassName('post-image')[0];
let post_main = document.getElementsByClassName('post-main')[0];

addEventListener('DOMContentLoaded', () => {
    if(post_block.clientHeight > 1000) {
        post_main.style.width = '100%';
        post_image.style.width = '100%';
    }
    if(post_block.clientHeight <= 1000) {
        post_main.style.width = '500px';
        post_image.style.width = '600px';
    }
});

window.addEventListener('resize', () => {
    if(post_block.clientHeight > 1000) {
        post_main.style.width = '100%';
        post_image.style.width = '100%';
    }
    if(window.innerWidth >= 1370) {
        post_main.style.width = '500px';
        post_image.style.width = '600px';
    }
});