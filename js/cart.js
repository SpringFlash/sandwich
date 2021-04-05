class Cart {
    
    elements = {};

    /**
     * Корзина для продуктов.
     * @param {String} sel CSS селектор элемента корзины.
     */
    constructor(sel) {
        this.root = sel;
        this.btnOrder = this.getElement().querySelector('.btn');
        this.createOrder();
    }

    /**
     * Возвращает HTML элемент корзины.
     * @returns {HTMLDivElement}
     */
    getElement() {
        return document.querySelector(this.root);
    }

    /**
     * Удаляет элемент из корзины, возвращая TRUE или FALSE.
     * @param {String} id ID элемента в корзине.
     * @returns {Boolean}
     */
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

    /**
     * Определяет, находится ли элемент с данным ID в корзине.
     * @param {*} id ID элемента в корзине.
     * @returns {Boolean}
     */
    inCart(id) {
        if (this.elements[id]) {
            alert('Этот продукт уже в корзине!')
            return true;
        } else return false;
    }

    /**
     * Создает ID для элемента и возвращает его.
     * @param {*} id_par ID родительского элемента.
     * @param {*} components Объект компонентов продукта.
     * @returns {String}
     * 
     * @private
     */
    makeId(id_par, components) {
        let id = 'cp-' + id_par;
        for (let k in components) {
            id += '-' + components[k];
        }
        return id;
    }

    /**
     * Добавляет элемент продукта в корзину.
     * @param {ProductCard} product "Продукт" элемент, который вносится в корзину.
     * @param {Object} components Объект компонентов продукта. 
     * @returns {void}
     */
    add(product, components) {     
        let id = this.makeId(product.id, components)
        if (this.inCart(id)) return;

        let ctr = new Counter(product.counter.value);

        ctr.on('changeValue', (val) => {
            if (product.changeQty) product.changeQty(val);
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

    /**
     * Активирует/деактивирует кнопку оформления заказа.
     * @param {String} mode Режим включения/выключения - ('on'/'off')
     * 
     * @private
     */
    toggleBuy(mode) {
        if (mode == 'on') this.btnOrder.classList.remove('inactive_btn');
        else if (mode == 'off') this.btnOrder.classList.add('inactive_btn');
    }

    /**
     * Создает заказ.
     */
    createOrder() {
        this.btnOrder.addEventListener('click', (e) => {
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

    /**
     * Рендерит элемент в корзине.
     * @param {String} name Название продукта.
     * @param {Counter} counter Счетчик элемента корзины.
     * @param {String} id ID элемента в корзине.
     * 
     * @private
     */
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

    /**
     * Обновляет итоговую стоимость корзины.
     * @private
     */
    updatePrice() {
        this.summ = 0;
        for (const key in this.elements) {
            this.summ += this.elements[key].price * this.elements[key].counter.value;
        }

        this.getElement().querySelector('p span').innerText = this.summ;
    }
}