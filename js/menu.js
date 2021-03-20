class Menu {
    
    items = [];
    onitemchange(){}
    
    constructor(categories) {
        for (let key in categories) {
            const item = new MenuItem(categories[key], key);
            item.on('active', () => this.onitemchange(item));
            this.items.push(item);
        }
    }

    on(name, func) {
        this['on'+name.toLowerCase()] = func;
    }

    render() {
        const el = document.createElement('menu');
        for (let it of this.items) {
            const it_el = it.render();
            el.append(it_el);
        }
        return el;
    }
}