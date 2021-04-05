class Store {
    
    store = {}

    /**
     * Определяет, включает ли хранилище элемент с определенным ключом, 
     * возвращая, при необходимости, true или false.
     * @param {String} key Ключ элемента
     * @returns {Boolean} 
     */
    exist(key) {
        return (Boolean(this.store[key]));
    }

    /**
     * Возвращает элемент из хранилища
     * @param {String} key Ключ элемента
     * @returns {Set} 
     */
    get(key) {
        if (this.store[key]) return this.store[key];
        else return [];
    }

    /**
     * Добавляет в элемент с ключом key значение value
     * @param {String} key Ключ элемента
     * @param {*} value Значение
     */
    set(key, value) {
        if (!this.store[key]) {
            this.store[key] = new Set();
        }
        this.store[key].add(value);
    }

    /**
     * Удаляет из элемента с ключом key значение value
     * @param {String} key Ключ элемента
     * @param {*} value Значение
     */
    remove(key, value) {
        if (this.store[key]) {
            this.store[key].delete(value);
            if (this.store[key].size == 0) delete this.store[key];
        }
    }
}