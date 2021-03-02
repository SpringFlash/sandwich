class Cart {
    elements = [];

    constructor(sel) {
        this.root = sel;
    }

    getElement() {
        return document.querySelector(this.root);
    }

    add(name, count, price, components={}) {     
        for (const el of this.elements) {
            console.log(el.name == name)
            console.log(el.price/el.count == price)
            console.log(JSON.stringify(el.components) === JSON.stringify(components))
            if (el.name == name && el.price/el.count == price && JSON.stringify(el.components) === JSON.stringify(components)) {
                el.price = el.price / el.count;
                el.count = Number(el.count) + Number(count);
                el.price = el.price * el.count;
                console.log(el.id)
                document.getElementById(el.id).children[1].innerHTML = el.count;

                this.updatePrice();
                return;
            }  
        }
        
        this.elements.push({
            'name': name,
            'count': count,
            'price': price * count,
            'components': components
        });

        const order = this.getElement().querySelector('.cart_order_table');
        const clone = order.querySelector('.cart_order_table_product').cloneNode(true);
        clone.children[0].innerText = name;
        clone.children[1].innerText = count;

        clone.id = (this.elements[this.elements.length-1].id = 'cart-product-' + order.children.length);

        this.updatePrice();

        const btn = this.getElement().querySelector('button');
        if (btn.classList.contains('inactive_btn')) {
            btn.classList.remove('inactive_btn');
            
            btn.addEventListener('click', () => {
                let result = 'Ваш заказ: \n';
                for (const el of this.elements) result += `► ${el.name} x${el.count} шт. - ${el.price} руб.\n`
                result += `------------------------\nИтого: ${this.summ} руб.`
                alert(result)
            });
        }
        order.append(clone);
    }

    updatePrice() {
        this.summ = 0;
        for (const el of this.elements) {
            this.summ += el.price;
        }

        this.getElement().querySelector('p span').innerText = this.summ;
    }
}