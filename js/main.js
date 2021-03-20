const cart = new Cart('.cart_order');

function start(json) {
    let products = [];
    
    for (let prod of json.menu) { 
        let mrk_src;
        for (let mrkt in json.markets) if (mrkt == prod.market) mrk_src = json.markets[mrkt].image;
        
        let product = new ProductCard(
            prod,
            mrk_src, 
            products.length
        );
      
        product.on('Buy', (product) => {
            cart.add(product);
        });

        const settings = {
            'toCart': (product, components={}) => cart.add(product, components),
            'json': json
        }
      
        product.on('Custom', (product) => {
            new Popup(product, settings);
        })

        products.push(product);
    }
    

    this.menu = new Menu(json.categories);

    document.querySelector('.menu').append(this.menu.render());

    this.menu.on('ItemChange', function(menuItem) {
        for (prod of products) {
            if (prod.category == menuItem.id) prod.show('product-list');
            else prod.hide();
        }
    });
    
    this.menu.items[0].setActive()
    this.active = this.menu.items[0];

    for (let it of this.menu.items) {
        it.on('Click', () => {
            this.active.removeActive();
            this.active = it;
            this.active.setActive();
        });
    }   
}

fetch('./1/data.json')
    .then(response => response.json())
    .then(jsonResponse => start(jsonResponse));