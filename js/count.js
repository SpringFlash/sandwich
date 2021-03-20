class Counter {
    
    renders = [];
    onchangevalue(){}
    
    constructor(startCount) {
        this.value = startCount;
    }

    on(name, func) {
        this['on'+name.toLowerCase()] = func;
    }

    getElements() {
        let result = [];
        for (let id of this.renders) {
            const htmEl = document.getElementById(id);
            if (htmEl) result.push(htmEl.querySelector('input'));
        }
        return result
    }

    ontype(val) {
        if (val >= 0) this.value = Number(val);
        else if (val == '') this.value = 0;
        this.updateCount();
    }

    addCount() {
        this.value += 1;
        this.updateCount();
    }

    minCount() {
        if (this.value > 0) this.value -= 1;
        this.updateCount();
    }

    updateCount() {
        for (let el of this.getElements()) el.value = this.value;
        this.onchangevalue(this.value);
    }

    render(id_par) {
        let id = id_par + '-counter';
        this.renders.push(id);
        
        const min = document.createElement('button');
        min.innerHTML = '-'
        min.addEventListener('click', () => this.minCount());
        
        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = this.value;
        inp.placeholder = '0';
        inp.addEventListener('input', (e) => this.ontype(e.target.value));
        
        const add = document.createElement('button');
        add.innerHTML = '+';
        add.addEventListener('click', () => this.addCount());

        const div = document.createElement('div');
        div.classList.add('product_card_count');
        div.append(min, inp, add);
        div.id = id;
        return div;
    }
}
