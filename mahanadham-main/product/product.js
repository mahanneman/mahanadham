document.querySelectorAll('.image-slider').forEach(slider => {
    const images = slider.querySelectorAll('img');
    let index = 0;

    const showImage = i => {
        images.forEach((img, idx) => {
            img.style.display = idx === i ? 'block' : 'none';
        });
    };

    slider.querySelector('.next').onclick = () => {
        index = (index + 1) % images.length;
        showImage(index);
    };

    slider.querySelector('.prev').onclick = () => {
        index = (index - 1 + images.length) % images.length;
        showImage(index);
    };

    showImage(index);
});
