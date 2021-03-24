class Counter {
    
    events = {};
    
    constructor(startCount) {
        this.value = startCount;
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
        const htmEl = document.getElementById(this.id).querySelector('input');
        return htmEl
    }

    setQty(val, event=true) {
        if (val >= 0) this.value = Number(val);
        else if (val == '') this.value = 0;
        this.updateCount(event);
    }

    addCount() {
        this.value += 1;
        this.updateCount();
    }

    minCount() {
        if (this.value > 0) this.value -= 1;
        this.updateCount();
    }

    updateCount(event=true) {
        this.getElement().value = this.value;
        if (event) {
            try {
                this.onchangevalue(this.value);
            } catch {}
        }
    }

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
