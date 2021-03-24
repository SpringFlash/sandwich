class ProductCard {
    events = {};

    constructor(product, market, numb) {
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
        this.counter.on('changeValue', (c) => {try {this.onchangeqty(c)} catch{}});
        
        this.id = 'card-' + numb;
    }

    getElement() {
        return document.getElementById(this.id);
    }

    on(name, func) {
        if (!this.events[name.toLowerCase()]) {
            this.events[name.toLowerCase()] = [];
            this['on' + name.toLowerCase()] = (...args) => {
                for (let f of this.events[name.toLowerCase()]) {
                    f(...args);
                }
            }
        }
        this.events[name.toLowerCase()].push(func);
    }

    off(name, func) {
        if (this.events[name.toLowerCase()]) {
            this.events[name.toLowerCase()].forEach((el, ind) => {
                if (String(el) == String(func)) this.events[name.toLowerCase()].splice(ind, 1);
            });

            if (this.events[name.toLowerCase()] == []) {
                delete this.events[name.toLowerCase()];
                this['on' + name.toLowerCase()] = function(){};
            }
        }
    }

    show(root) {
        if (!this.rendered) document.getElementById(root).append(this.render());
        else this.getElement().style.display = '';
    }

    hide() {
        if (this.rendered) this.getElement().style.display = 'none';
    }

    changeQty(numb) {
        this.counter.setQty(numb, false);
    }

    render() {
        const clone = document.getElementById('templ_prod_card').content.cloneNode(true);

        const card = clone.querySelector('.product_card')
        const card_name = clone.querySelector('h4');
        const card_image = clone.querySelector('.product-pic');
        const card_market = clone.querySelector('.market-logo');
        const card_description = clone.querySelector('.product_card_description p');
        if (this.type == "multiple") {
            card_description.classList.add('popupable');
            card_description.addEventListener('click', () => {try {this.oncustom(this)} catch {}});
        }
        
        const card_price = clone.querySelector('.product_card_price span')

        
        clone.querySelector('.product_card_description').append(this.counter.render(this.id));
        clone.querySelector('.product_card_btn').addEventListener('click', () => {try {this.onbuy(this)} catch{}});

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