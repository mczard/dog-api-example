import { getBreedList } from '../services/dog-api';
import { mediator } from '../services/mediator';
import css from '../css/menu.css';

export class Menu {
    constructor(elementName) {
        this.initialize(elementName);
    }

    async initialize(elementName) {
        const rootElement = document.getElementById(elementName);
        rootElement.classList.add('menu');

        this.generateMenuHeader(rootElement);
        this.generateMenuList(rootElement);
        await this.getBreedList();
        this.refreshBreedList();
        mediator.register('filter-breeds', this.refreshBreedList.bind(this));
    }

    generateMenuHeader(rootElement) {
        const menuHeader = document.createElement('h1');
        menuHeader.innerText = "MENU";
        rootElement.appendChild(menuHeader);
    }

    generateMenuList(rootElement) {
        const menuList = document.createElement('ul');
        menuList.classList.add("p-0");
        rootElement.appendChild(menuList);

        this.menuList = menuList;
    }

    async getBreedList() {
        const breeds = await getBreedList();
        this.breeds = breeds;
    }

    refreshBreedList(breedPattern = '') {
        this.clearMenu();

        for (const breed in this.breeds) {
            const option = document.createElement('li');
            option.innerText = breed;
            option.classList.add('menu-option');
            option.addEventListener('click', () => {
                mediator.raiseEvent('select-breed', [breed]);
            });

            if (this.breeds[breed].length > 0 ) {
                this.generateSubBreedList(breed, option, breedPattern);
            }

            const doesContainBreedPattern = breed.includes(breedPattern) || 
                                          this.breeds[breed].some((subBreed) => subBreed.includes(breedPattern));
            
            if (!breedPattern || doesContainBreedPattern) {
                this.menuList.appendChild(option);
            }
        }

        if (this.menuList.childElementCount === 0) {
            const noBreeds = document.createElement('li');
            noBreeds.innerText = "Provided breed does not exist";
            this.menuList.appendChild(noBreeds);
        }
    }

    generateSubBreedList(breed, parentElement, breedPattern = '') {
        const subBreedList = this.breeds[breed];
        const list = document.createElement('ul');

        for (let i = 0; i < subBreedList.length; i++) {
            const subBreed = subBreedList[i];
            const option = document.createElement('li');
            option.innerText = subBreed;
            option.classList.add('sub-option');
            option.addEventListener('click', (event) => {
                mediator.raiseEvent('select-breed', [breed, subBreed]);
                event.stopPropagation();
            });

            if(!breedPattern || 
                subBreed.includes(breedPattern)) {
                list.appendChild(option);
            }
        }

        parentElement.appendChild(list);
    }

    clearMenu() {
        Array.from(this.menuList.children).forEach(option => option.remove());
    }
}