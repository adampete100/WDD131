
const gallery = document.querySelector('.gallery');
const modal = document.querySelector('dialog');
const modalImage = modal.querySelector('img');
const closeButton = modal.querySelector('.close-viewer');

// Event listener for opening the modal
gallery.addEventListener('click', openModal);

function openModal(e) {
    // Store image filepath in imageSrc
    let imageSrc = e.target.src;

    // Replace filepath's sm with full to display the high-res version of a given image,
    // and store the new high-res filepath in modalImage
    modalImage.src = imageSrc.replace("-sm", "-full");
    console.log(imageSrc);

    modal.showModal();
}
// Close modal on button click
closeButton.addEventListener('click', () => {
    modal.close();
});

// Close modal if clicking outside the image
modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
});
          