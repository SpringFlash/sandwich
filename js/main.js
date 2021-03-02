const cart = new Cart('.cart_order');

function start(json) {
    const menu = document.querySelector('menu').children;
    for (const el of menu) {
        el.addEventListener('click', (event) => {
            for (const li of menu) li.classList.toggle('active', li === event.target);
            const root = document.getElementById('product-list');    
            root.innerHTML = '';
            
            for (prod of json.menu) { 
                if (prod.category == event.target.dataset.cat) {
                    let mrk_src;
                    for (mrkt in json.markets) if (mrkt == prod.market) mrk_src = json.markets[mrkt].image;   
                    let cardPr = new ProductCard(
                        prod,
                        mrk_src, 
                        cart
                    );
                    root.append(cardPr.render());
                }
            }
        });
    }
}

fetch('./1/data.json')
    .then(response => response.json())
    .then(jsonResponse => start(jsonResponse));