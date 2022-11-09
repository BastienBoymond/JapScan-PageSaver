window.addEventListener('input', async (event) => {
    const searchContent = event.target.value;
    console.log(searchContent);
    console.log(document.querySelectorAll('.manga-title'));
    document.querySelectorAll('.manga-button').forEach((button) => {
        if (button.innerText.includes(searchContent)) {
            button.style.display = 'flex';
        } else if (button.innerText.replaceAll('-', ' ').includes(searchContent)) {
            button.style.display = 'flex';
        } else {
            if (button.className === 'goBack') return;
            button.style.display = 'none';
        }
    });
});
