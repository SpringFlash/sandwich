const cart = new Cart('.cart_order');

function start(json) {
    let products = [];
    
    for (let prod of json.menu) { 
        let mrk;
        if (prod.market) mrk = json.markets[prod.market].image;

        let product = new ProductCard(
            prod,
            mrk, 
            products.length
        );
      
        product.on('buy', (product) => {
            cart.add(product);
        });

        const settings = {
            'toCart': (product, components={}) => cart.add(product, components),
            'json': json
        }
      
        product.on('custom', (product) => {
            new Popup(product, settings);
        })

        products.push(product);
    }
    

    this.menu = new Menu(json.categories);

    document.querySelector('.menu').append(this.menu.render());

    this.menu.on('itemChange', function(menuItem) {
        for (prod of products) {
            if (prod.category == menuItem.id) {
                prod.show('product-list');}
            else prod.hide();
        }
    });
    
    this.menu.items[0].setActive()
    this.active = this.menu.items[0];

    for (let it of this.menu.items) {
        it.on('click', () => {
            this.active.removeActive();
            this.active = it;
            this.active.setActive();
        });
    }   
}

fetch('./1/data.json')
    .then(response => response.json())
    .then(jsonResponse => start(jsonResponse));