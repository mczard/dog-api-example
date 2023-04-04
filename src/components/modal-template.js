export const modalTemplate = `<div class="modal micromodal-slide" id="#MODAL_ID#-modal" aria-hidden="true">
<div class="modal__overlay" tabindex="-1" data-micromodal-close>
    <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
    <header class="modal__header">
        <h2 class="modal__title" id="modal-1-title"></h2>
        <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
    </header>
    <main class="modal__content" id="#MODAL_ID#-modal-content">
    </main>
    <footer class="modal__footer">
        <button class="modal__btn" data-micromodal-close aria-label="Close this dialog window">Close</button>
    </footer>
    </div>
</div>
</div>`;