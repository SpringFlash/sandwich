class Menu {
    
    items = [];
    events = {};
    
    constructor(categories) {
        for (let key in categories) {
            const item = new MenuItem(categories[key], key);
            item.on('active', () => {try {this.onitemchange(item)} catch{}});
            this.items.push(item);
        }
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

    render() {
        const el = document.createElement('menu');
        for (let it of this.items) {
            const it_el = it.render();
            el.append(it_el);
        }
        return el;
    }
}