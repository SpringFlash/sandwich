class ProductCard extends Events {

    /**
     * Карточка продукта.
     * @param {Object} product Объект с данными о продукте.
     * @param {String} market Путь к изображению магазина продукта.
     * @param {Number} numb Номер данной карточки.
     */
    constructor(product, market, numb) {
        super(['custom', 'buy', 'changeqty']); // event names
        
        this.product = product;
        let {name, image, description, price, type, category, components} = product;
        
        this.name = name;
        this.image = image;
        this.market = market;
        this.description = description;
        this.price = price;
        this.type = type;
        this.category = category;
        this.components = components;

        this.counter = new Counter(1);
        this.counter.on('changeValue', (c) => this.emit('changeqty', c));
        
        this.id = 'card-' + numb;
    }

    /**
     * Возвращает HTML элемент "карточки" продукта.
     * @returns {HTMLDivElement}
     */
    getElement() {
        return document.getElementById(this.id);
    }

    /**
     * Показывает карточку на странице, при необходимости рендерит ее.
     * @param {String} root ID элемента, хранящего карточки.
     */
    show(root) {
        if (!this.rendered) document.getElementById(root).append(this.render());
        else this.getElement().style.display = '';
    }

    /**
     * Скрывает карточку с картинки.
     */
    hide() {
        if (this.rendered) this.getElement().style.display = 'none';
    }

    /**
     * Меняет количество продукта в карточке.
     * @param {Number} numb Необходимое количество для установки.
     */
    changeQty(numb) {
        this.counter.setQty(numb, false);
    }

    /**
     * Рендерит HTML элемент DIV карточки и возвращает его.
     * @returns {HTMLDivElement}
     */
    render() {
        const clone = document.getElementById('templ_prod_card').content.cloneNode(true);

        const card = clone.querySelector('.product_card')
        const card_name = clone.querySelector('h4');
        const card_image = clone.querySelector('.product-pic');
        const card_market = clone.querySelector('.market-logo');
        const card_description = clone.querySelector('.product_card_description p');
        if (this.type == "multiple") {
            card_description.classList.add('popupable');
            card_description.addEventListener('click', () => this.emit('custom', this));
        }
        
        const card_price = clone.querySelector('.product_card_price span')

        
        clone.querySelector('.product_card_description').append(this.counter.render(this.id));
        clone.querySelector('.product_card_btn').addEventListener('click', () => this.emit('buy', this));

        card.id = this.id;
        card_name.innerText = this.name;
        card_image.src = this.image;
        card_market.src = this.market;
        if (this.market == undefined) card_market.style.visibility = "hidden";
        card_description.innerText = this.description;
        card_price.innerText = this.price;

        this.rendered = 1;
        return clone;
    }
}