class MenuItem {
    
    events = {};
    
    constructor(category, id) {
        this.name = category.name;
        this.id = id;
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

    getElement() {
        return document.getElementById(this.id);
    }

    setActive() {
        this.getElement().classList.add('active');
        try {
            this.onactive();
        } catch {};
        return 
    }

    removeActive() {
        return this.getElement().classList.remove('active');
    }

    render() {
        const el = document.createElement('li');
        el.addEventListener('click', () => {try {this.onclick()} catch{}});
        el.innerHTML = this.name;
        el.id = this.id;
        return el
    }
}