class ProductCard {
    constructor(product, market, cart) {
        this.product = product;
        
        let {name, image, description, price, type} = product;
        this.name = name;
        this.image = image;
        this.market = market;
        this.description = description;
        this.price = price;
        this.type = type;
        
        this.id = 'card-' + document.getElementsByClassName('product_card').length;
        this.cart = cart;
    }

    getCount() {
        return this.getElement().querySelector('.product_card_count input').value;
    }

    exportCount(priceUpd, cost) {
        this.reference = this.getElement().querySelector('.product_card_count').cloneNode(true);
        this.reference.querySelector('.product_card_count_add').addEventListener('click', () => {
            this.addCount();
            priceUpd(this.getCount() * cost);
        });
        this.reference.querySelector('.product_card_count_min').addEventListener('click', () => {
            this.minCount();
            priceUpd(this.getCount() * cost);
        });
        return this.reference;
    }
    
    addCount() {
        const c_inp = this.getElement().querySelector('.product_card_count input');
        c_inp.value = Number(c_inp.value) + 1;
        if (this.reference) {
            const r_inp = this.reference.querySelector('input');
            r_inp.value = Number(r_inp.value) + 1;
        }
    }

    minCount() {
        const c_inp = this.getElement().querySelector('.product_card_count input');
        if (c_inp.value > 0) c_inp.value -= 1;
        if (this.reference) {
            const r_inp = this.reference.querySelector('input');
            if (r_inp.value > 0) r_inp.value -= 1;
        }
    }

    getElement() {
        return document.getElementById(this.id);
    }

    popup_init() {
        this.popup = true;
        const popEl = document.querySelector('.popup_bg');
        popEl.style.visibility = 'visible';
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
            card_description.addEventListener('click', () => {
                new Popup(
                    this.product, 
                    (fun, cost) => this.exportCount(fun, cost),
                    (a, b) => this.cart.add(this.name+' (свой)', this.getCount(), a/this.getCount(), b)
                );
            });
        }
        
        const card_price = clone.querySelector('.product_card_price span')

        const count_add = clone.querySelector('.product_card_count_add');
        const count_min = clone.querySelector('.product_card_count_min');
        
        count_add.addEventListener('click', () => this.addCount());
        count_min.addEventListener('click', () => this.minCount());

        clone.querySelector('.product_card_btn').addEventListener('click', () => 
            this.cart.add(this.name, this.getCount(), this.price));

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