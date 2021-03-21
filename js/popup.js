class Popup {
    constructor(product, settings) { 
        // инициализация данных товара для поп-апа
        let {name, image, price = 0, components = {
            "size": "1x",
            "bread": "white-italian",
            "vegetable": [],
            "sauce": [],
            "filling": []
        }} = product; 
        this.name = name; 
        this.image = image; 
        this.cost = price;
        this.price = price; 

        const json = settings.json;
        
        this.components = {};
        for (const key in components) {
            if (components[key] instanceof Array) {
                this.components[key] = Array.from(components[key]);
            } else if (components[key] instanceof Object) {
                this.components[key] = {};
                this.components[key] = Object.assign({}, components[key]);
            } else {
                this.components[key] = components[key];
            }
        }

        this.toCart = (c) => {
            const prod_copy = Object.assign({}, product);
            prod_copy.name += ' (свой)' 
            prod_copy.counter = c;
            settings.toCart(prod_copy, this.components);
        }

        this.init(json);
    }

    init(json) {
        this.sizes = json.sizes;
        this.breads = json.breads;
        this.vegetables = json.vegetables;
        this.sauces = json.sauces;
        this.fillings = json.fillings;
        this.settings = json.settings;
        
        this.show();
        this.createProgressBar(this.settings);

        this.stages=[];
        for (const set in this.settings) {
            const func = () => this.changeStage(this.stages.indexOf(func), set, this.settings[set])
            this.stages.push(func);
        }

        this.updatePrice(this.price);

        const close = document.querySelector('.close_popup');
        close.addEventListener('click', () => this.hide());
        
        const popBtnEl = document.querySelector('.popup_nav_btns');
        popBtnEl.children[0].addEventListener('click', () => this.stages[this.stage-1]());
        popBtnEl.children[1].addEventListener('click', () => {
            this.stages[this.stage+1]()});
        this.stages[0]();
    }

    createProgressBar(set) {
        const root = document.querySelector('.popup_nav_points')
        for (let key in set) {
            const point = document.createElement('li');
            point.setAttribute('name', key)
            point.innerHTML = set[key].name;
            root.append(point);
        }
    }

    changeHeader(title, compName) {
        document.querySelector('.popup_header h2').innerText = title;
        try {
            const size_point = document.querySelector(`.popup_nav_points li[name="${compName}"]`);
            for (const el of size_point.parentElement.children) el.classList.toggle('active', el === size_point);
        } catch(er) {
            console.error(er);
        }
    }

    clearStyle(root, popBtnEl) {
        root.style.justifyContent = '';
        root.style.flexWrap = '';
        root.innerText = '';
        
        popBtnEl.children[0].style.visibility = ''; 
        popBtnEl.children[1].style.visibility = '';
    }

    changeStage(stage, compName, {object, title, multiple=false}) {
        this.stage = stage;

        const root = document.querySelector('.popup_choose');
        const popBtnEl = document.querySelector('.popup_nav_btns');

        this.changeHeader(title, compName);
        this.clearStyle(root, popBtnEl);
        
        if (stage == 0) {
            popBtnEl.children[0].style.visibility = 'hidden';
        }

        if (compName == 'finish') {
            popBtnEl.children[0].style.visibility = 'hidden';
            popBtnEl.children[1].style.visibility = 'hidden';
            
            root.style.justifyContent = 'flex-start';
            root.style.flexWrap = 'nowrap';

            const [img, div, to_cart] = this.done();
            root.append(img, div);
            document.querySelector('.popup_footer').append(to_cart);
            return
        }
        
        for (let key in this[object]) {
            let card;

            if (object == 'sizes') 
                card = this.createCard(this[object][key].image, this[object][key].name, this[object][key].price+this.cost);
            else card = this.createCard(this[object][key].image, this[object][key].name, this[object][key].price);
            
            this.addCardListener(card, key, multiple, object, compName, root);
            card.id = key;
            root.append(card);

            if (this.components[compName] == key) {
                for (const el of root.children) {
                    el.classList.toggle('active', el === card)
                };
            } else if (this.components[compName] instanceof Array && this.components[compName].indexOf(key) != -1) {
                card.classList.toggle('active');
            }
        } 
        
    }

    createCard(image, name, price) {
        const clone = document.getElementById('templ_popup_card').content.cloneNode(true);
        const imageEl = clone.querySelector('img');
        const titleEl = clone.querySelector('h3');
        const priceEl = clone.querySelector('span');

        imageEl.src = image;
        titleEl.innerText = name;
        priceEl.innerText = price;

        return clone.children[0];
    }

    addCardListener(card, key, multiple, object, compName, root) {
        card.querySelector('img').addEventListener('click', (event) => {
            if (multiple) {
                if (!event.target.parentElement.classList.contains('active')) {
                    if (object == 'sauces' && this.components[compName].length >= 3) alert('Максимум 3 соуса!');
                    else {
                        this.components[compName].push(key);
                        this.updatePrice(this.price+this[object][key].price);
                        event.target.parentElement.classList.add('active');
                    }          
                } else { 
                    this.components[compName].splice(this.components[compName].indexOf(key), 1);
                    this.updatePrice(this.price-this[object][key].price);
                    event.target.parentElement.classList.remove('active');
                }

            } else {
                for (const el of root.children) el.classList.toggle('active', el === event.target.parentElement);
                if (this.components[compName]) {
                    this.updatePrice(this.price-this[object][this.components[compName]].price);
                }
                this.components[compName] = key;
                this.updatePrice(this.price+this[object][key].price);
            }
        });
    }

    done() {
        const img = document.createElement('img');
        img.src = this.image;
        img.classList.add('product-pic');

        const desc = document.createElement('div');
        desc.classList.add('popup_descr');

        const tit = document.createElement('h3');
        tit.innerText = this.settings.finish.title;

        const comp = document.createElement('div');
        comp.classList.add('popup_options');

        for (let opt in this.components ) {
            const par = document.createElement('p');
            const und = document.createElement('u');
            und.innerText = this.settings[opt].name;
            par.append(und);
            par.innerHTML += ': ';
            if (this.components[opt] == '' || this.components[opt] == []) par.innerHTML += 'Нет';
            else if (this.components[opt] instanceof Array) {
                this.components[opt].forEach((k, ind) => {
                    if (ind != 0) par.innerHTML += ', '
                    par.innerHTML += this[opt+'s'][k].name;
                });
            } else par.innerHTML += this[opt+'s'][this.components[opt]].name;
            
            comp.append(par);
        }

        const nm = document.createElement('h3');
        nm.innerText = this.name;
        nm.classList.add('popup_product');

        const footer = document.createElement('div');
        const count = new Counter(1);
        
        const toCart_btn = document.createElement('button');
        toCart_btn.addEventListener('click', () => {
            this.toCart(count);
            footer.parentElement.removeChild(footer);
            this.hide();
        });
        toCart_btn.classList.add('btn');
        toCart_btn.innerText = 'В корзину';

        footer.append(count.render('popup'), toCart_btn);

        desc.append(tit, comp, nm);
        return [img, desc, footer];
    }

    updatePrice(pr) {
        this.price = pr;
        document.querySelector('.popup_price').innerText = this.price;
    }

    show() {
        document.querySelector('.popup_bg').style.visibility = 'visible';
    }

    hide() {
        document.querySelector('.popup_bg').style.visibility = 'hidden';
        document.querySelector('.popup_nav_points').innerHTML = '';
    }
}