let dropContainer = document.getElementById("dropcontainer");
let fileInput = document.getElementById("images");
let form = document.getElementById('post-form');

dropContainer.addEventListener("dragover", (e) => {
    e.preventDefault();
}, false);

dropContainer.addEventListener("drop", (e) => {
    e.preventDefault()
    fileInput.files = e.dataTransfer.files;
});

/*form.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputs = e.target.querySelectorAll('input,textarea,select');
    if (!Array.from(inputs).find(element => !element.value)) {
        e.target.submit();
    } else {

    }
});*/