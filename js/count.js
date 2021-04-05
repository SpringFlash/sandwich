class Counter extends Events{
    
    /**
     * Счетчик для элементов.
     * @param {Number} startCount Стартовое значение счетчика.
     */
    constructor(startCount) {
        super(['changeValue']);
        this.value = startCount;
    }


    /**
     * Возвращает HTML элемент счетчика.
     * @returns {HTMLInputElement}
     */
    getElement() {
        const htmEl = document.getElementById(this.id).querySelector('input');
        return htmEl
    }


    /**
     * Устанавливает значение счетчика, указанное в параметрах.
     * @param {Number} val Новое значение для счетчика.
     * @param {Boolean} event Нужно ли запускать callback-функции по событию.
     */
    setQty(val, event=true) {
        if (val >= 0) this.value = Number(val);
        else if (val == '') this.value = 0;
        this.updateCount(event);
    }

    /**
     * Добавляет 1 к значению счтчика.
     */
    addCount() {
        this.value += 1;
        this.updateCount();
    }

    /**
     * Отнимает 1 от значения счетчика.
     */
    minCount() {
        if (this.value > 0) this.value -= 1;
        this.updateCount();
    }

    /**
     * Обновляет значение в элементе счетчика.
     * @param {Boolean} event Нужно ли запускать callback-функции по событию.
     * 
     * @private
     */
    updateCount(event=true) {
        this.getElement().value = this.value;
        if (event) this.emit('changeValue', this.value)
    }

    /**
     * Рендерит счетчик и возвращяет DIV элемент с ним.
     * @param {String} id_par ID родительского элемента.
     * @returns {HTMLDivElement}
     */
    render(id_par) {
        this.id = id_par + '-counter';
        
        const min = document.createElement('button');
        min.innerHTML = '-'
        min.addEventListener('click', () => this.minCount());
        
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = this.value;
        inp.placeholder = '0';
        inp.addEventListener('input', (e) => this.setQty(e.target.value));
        
        const add = document.createElement('button');
        add.innerHTML = '+';
        add.addEventListener('click', () => this.addCount());
        
        const div = document.createElement('div');
        div.classList.add('product_card_count');
        div.append(min, inp, add);
        div.id = this.id;

        return div;
    }
}
