class Cart {
    elements = {};
    events = {};

    constructor(sel) {
        this.root = sel;
        this.btnOrder = this.getElement().querySelector('.btn');
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
        if (this.elements[id]) {
            if (confirm(`Вы точно хотите удалить "${this.elements[id].name}"?`)) {
                delete this.elements[id];
                const chl = document.getElementById(id);
                chl.parentElement.removeChild(chl);
            } else return false
        }

        if (Object.keys(this.elements).length == 0) {
            this.toggleBuy('off');
        }

        this.updatePrice();
        return true;
    }

    inCart(id) {
        if (this.elements[id]) {
            alert('Этот продукт уже в корзине!')
            return true;
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

        let ctr = new Counter(product.counter.value);

        ctr.on('changeValue', (val) => {
            try {product.changeQty(val)} catch{};
            if (val == 0) {
                if (!this.remove(id)) product.counter.addCount();
            }
            this.updatePrice();
        });

        this.elements[id] = {
            'name': product.name,
            'price': product.price,
            'counter': ctr
        };

        try {
            product.on('changeQty', (val) => {  
                ctr.setQty(val);
            });
        } catch {}

        this.renderElement(product.name, ctr, id);
        this.updatePrice();
        
        this.toggleBuy('on');
    }

    toggleBuy(mode) {
        if (mode == 'on') this.btnOrder.classList.remove('inactive_btn');
        else if (mode == 'off') this.btnOrder.classList.add('inactive_btn');
    }

    createOrder() {
        this.btnOrder.addEventListener('click', (e) => {
            try {
                this.onorder();
            } catch {};
            if (!e.target.classList.contains('inactive_btn')) {
                let result = 'Ваш заказ: \n';
                for (const key in this.elements) 
                    result += `► ${this.elements[key].name} x${this.elements[key].counter.value} шт. 
                    - ${this.elements[key].price * this.elements[key].counter.value} руб.\n`;
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
        for (const key in this.elements) {
            this.summ += this.elements[key].price * this.elements[key].counter.value;
        }

        this.getElement().querySelector('p span').innerText = this.summ;
    }
}