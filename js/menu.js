class Menu extends Events {
    
    items = [];

    /**
     * Меню категорий.
     * @param {Object} categories Объект с данными о категориях.
     */
    constructor(categories) {
        super(['itemChange']);
        
        for (let key in categories) {
            const item = new MenuItem(categories[key], key);
            item.on('active', () => this.emit('itemChange', item));
            this.items.push(item);
        }
    }

    /**
     * Рендерит HTML элемент DIV меню и возвращает его.
     * @returns {HTMLMenuElement}
     */
    render() {
        const el = document.createElement('menu');
        for (let it of this.items) {
            const it_el = it.render();
            el.append(it_el);
        }
        return el;
    }
}