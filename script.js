const year = document.querySelector('#year');
year.textContent = String(new Date().getFullYear());

const imageDialog = document.querySelector('.image-dialog');
const imageTriggers = document.querySelectorAll('[data-open-image]');

if (typeof imageDialog.showModal === 'function') {
  for (const trigger of imageTriggers) {
    trigger.hidden = false;
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      imageDialog.showModal();
      document.body.classList.add('dialog-open');
    });
  }

  imageDialog.querySelector('.close-button').addEventListener('click', () => imageDialog.close());
  imageDialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
  imageDialog.addEventListener('click', (event) => {
    const bounds = imageDialog.getBoundingClientRect();
    if (
      event.target === imageDialog &&
      (event.clientX < bounds.left || event.clientX > bounds.right ||
       event.clientY < bounds.top || event.clientY > bounds.bottom)
    ) {
      imageDialog.close();
    }
  });
}
