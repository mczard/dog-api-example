import { getRandomDogImage, getDogImages } from '../services/dog-api';
import { mediator } from '../services/mediator';
import { modalTemplate } from './modal-template';
import MicroModal from 'micromodal';
import css from '../css/micro-modal.css';

const IMAGE_PER_PAGE = 9;

export class Gallery {

    constructor(elementName) {
        this.initialize(elementName);
    }

    async initialize(elementName) {
        this.galleryElement = document.getElementById(elementName);
        this.initModal();
        await this.createInitialView()
        mediator.register('select-breed', this.handleBreedChanged.bind(this));
    }

    initModal() {
        this.galleryElement.innerHTML = modalTemplate.replace(/#MODAL_ID#/ig, 'gallery');
        MicroModal.init();
    }

    async createInitialView() {
        this.galleryGrid = document.createElement('div');
        this.galleryGrid.classList.add('row');

        const randomImageElement = document.createElement('img');
        randomImageElement.classList.add("rounded", "mx-auto", "d-block", "img-thumbnail", "w-50");
        this.galleryGrid.appendChild(randomImageElement);
        this.handleRandomImageClick()

        const randomButtonElement = document.createElement('button');
        randomButtonElement.textContent = "Randomize image"
        randomButtonElement.classList.add("btn", "btn-outline-secondary", "m-4");
        randomButtonElement.addEventListener('click', this.handleRandomImageClick.bind(this));

        this.galleryGrid.appendChild(randomButtonElement);
        this.galleryElement.appendChild(this.galleryGrid);
    }

    async handleRandomImageClick() {
        const imageUrl = await getRandomDogImage();
        const randomImageElement = this.galleryGrid.querySelector('img');
        randomImageElement.src = imageUrl;
    }

    handleDogImageClick(imageUrl) {
        const modalContent = this.galleryElement.querySelector('#gallery-modal-content');

        Array.from(modalContent.children).forEach(child => child.remove());

        const image = document.createElement('img');
        image.classList.add("w-100");
        image.src = imageUrl;

        modalContent.appendChild(image);

        MicroModal.show('gallery-modal');
    }

    async handleBreedChanged(breedEventData) {
        const [breed, subBreed] = breedEventData;
        this.dogImages = await getDogImages(breed, subBreed);
        this.currentPage = 0;
        this.totalPageCount = Math.ceil(this.dogImages.length / IMAGE_PER_PAGE);

        this.renderCurrentPage();
    }

    renderCurrentPage() {
        this.clearGalleryImages();

        for (let i = this.currentPage * IMAGE_PER_PAGE; i < this.dogImages.length && i < (this.currentPage + 1) * IMAGE_PER_PAGE; i++) {
            const imageUrl = this.dogImages[i];
            const image = document.createElement('img');
            const cell = document.createElement('div');
            cell.classList.add("col-4");
            image.classList.add("rounded", "mx-auto", "d-block", "img-thumbnail");
            image.src = imageUrl;
            image.addEventListener('click', this.handleDogImageClick.bind(this, imageUrl));

            cell.appendChild(image);
            this.galleryGrid.appendChild(cell);
        }

        this.renderPager();
    }

    renderPager() {
        const pagerElement = document.createElement('div');
        const prevPageElement = document.createElement('button');
        const pageInfoElement = document.createElement('span');
        const nextPageElement = document.createElement('button');

        prevPageElement.textContent = '<';
        prevPageElement.addEventListener('click', this.handlePageChange.bind(this, -1));
        prevPageElement.classList.add("btn", "btn-outline-secondary", "m-4");
        
        nextPageElement.textContent = '>';
        nextPageElement.addEventListener('click', this.handlePageChange.bind(this, 1));
        nextPageElement.classList.add("btn", "btn-outline-secondary", "m-4");

        pageInfoElement.textContent = `${this.currentPage + 1}/${this.totalPageCount}`;

        pagerElement.appendChild(prevPageElement);
        pagerElement.appendChild(pageInfoElement);
        pagerElement.appendChild(nextPageElement);

        this.galleryGrid.appendChild(pagerElement);
    }

    handlePageChange(delta) {
        this.currentPage += delta;

        if (this.currentPage < 0) {
            this.currentPage = 0;
        }

        if (this.currentPage >= this.totalPageCount) {
            this.currentPage = this.totalPageCount - 1;
        }

        this.renderCurrentPage();
    }

    clearGalleryImages() {
        Array.from(this.galleryGrid.childNodes).forEach(child => child.remove());
    }

}