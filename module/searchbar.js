window.addEventListener('input', async (event) => {
    const searchContent = event.target.value;
    console.log(searchContent);
    document.querySelectorAll('button').forEach((button) => {
        if (button.innerText.includes(searchContent)) {
            button.style.display = 'inline-block';
        } else if (button.innerText.replaceAll('-', ' ').includes(searchContent)) {
            button.style.display = 'inline-block';
        } else {
            if (button.className === 'goBack') return;
            button.style.display = 'none';
        }
    });
});