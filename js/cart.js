class Cart {
    elements = [];
    events = {};

    constructor(sel) {
        this.root = sel;
        this.createOrder();
    }

    getElement() {
        return document.querySelector(this.root);
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

    remove(id) {
        for (let el of this.elements) {
            if (el.id == id) {
                if (confirm(`Вы точно хотите удалить "${el.name}"?`)) {
                    this.elements.splice(this.elements.indexOf(el), 1);
                    const chl = document.getElementById(id);
                    chl.parentElement.removeChild(chl);
                } else return false
            }
        }

        if (this.elements.length == 0) {
            this.toggleBuy('off');
        }

        this.updatePrice();
        return true;
    }

    inCart(id) {
        for (let prod of this.elements) {
            if (prod.id == id) {
                alert('Этот продукт уже в корзине!')
                return true;
            } 
        }
    }

    makeId(id_par, components) {
        let id = 'cp-' + id_par;
        for (let k in components) {
            id += '-' + components[k];
        }
        return id;
    }

    add(product, components) {     
        let id = this.makeId(product.id, components)
        if (this.inCart(id)) return;

        this.elements.push({
            'name': product.name,
            'price': product.price,
            'count': product.counter,
            'id': id
        });

        product.counter.on('ChangeValue', (val) => {
            if (val == 0) {
                if (!this.remove(id)) product.counter.addCount();
            }
            this.updatePrice();
        });
        this.renderElement(product.name, product.counter, id);
        this.updatePrice();
        
        this.toggleBuy('on');
    }

    toggleBuy(mode) {
        const btn = this.getElement().querySelector('.btn');
        if (mode == 'on') btn.classList.remove('inactive_btn');
        else if (mode == 'off') btn.classList.add('inactive_btn');
    }

    createOrder() { 
        const btn = this.getElement().querySelector('.btn');   
        btn.addEventListener('click', (e) => {
            try {
                this.onorder();
            } catch {};
            if (!e.target.classList.contains('inactive_btn')) {
                let result = 'Ваш заказ: \n';
                for (const el of this.elements) result += `► ${el.name} x${el.count.value} шт. - ${el.price * el.count.value} руб.\n`
                result += `------------------------\nИтого: ${this.summ} руб.`
                alert(result)
            }
        });
    }

    renderElement(name, counter, id) {
        const order = this.getElement().querySelector('.cart_order_table');

        const d = document.createElement('div');
        d.classList.add('cart_order_table_product');

        const p_name = document.createElement('p');
        p_name.innerText = name;
        
        const count = counter.render(id);
        d.append(p_name, count)
        
        p_name.addEventListener('click', () => this.remove(id));
        d.id = id;

        order.append(d);
    }

    updatePrice() {
        this.summ = 0;
        for (const el of this.elements) {
            this.summ += el.price * el.count.value;
        }

        this.getElement().querySelector('p span').innerText = this.summ;
    }
}