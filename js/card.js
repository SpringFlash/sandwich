class ProductCard {
    
    constructor(product, market, numb) {
        this.product = product;
        
        let {name, image, description, price, type, category} = product;
        this.name = name;
        this.image = image;
        this.market = market;
        this.description = description;
        this.price = price;
        this.type = type;
        this.category = category;

        this.onbuy = function(){};
        this.oncustom = function(){};
        
        this.id = 'card-' + numb;
    }

    getElement() {
        return document.getElementById(this.id);
    }

    on(name, func) {
        this['on'+name.toLowerCase()] = func;
    }

    show(root) {
        if (!this.rendered) document.getElementById(root).append(this.render());
        else this.getElement().style.display = '';
    }

    hide() {
        if (this.rendered) this.getElement().style.display = 'none';
    }

    render() {
        const clone = document.getElementById('templ_prod_card').content.cloneNode(true);
        
        this.counter = new Counter(1);

        const card = clone.querySelector('.product_card')
        const card_name = clone.querySelector('h4');
        const card_image = clone.querySelector('.product-pic');
        const card_market = clone.querySelector('.market-logo');
        const card_description = clone.querySelector('.product_card_description p');
        if (this.type == "multiple") {
            card_description.classList.add('popupable');
            card_description.addEventListener('click', () => {
                this.oncustom(this);
            });
        }
        
        const card_price = clone.querySelector('.product_card_price span')

        clone.querySelector('.product_card_description').append(this.counter.render(this.id));
        clone.querySelector('.product_card_btn').addEventListener('click', () => this.onbuy(this));

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