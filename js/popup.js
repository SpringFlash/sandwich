class Popup extends Events {

    static events = {
        'close': Symbol('close')
    }

    /**
     * Popup для выбора компонентов к продукту.
     * @param {Product} product Карточка продукта.
     * @param {Object} settings Объект с набором настроек для поп-апа.
     */
    constructor(product, settings) { 
        super(Popup.events);
        
        let {name, image, price = 0, components = {}} = product; 
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
            prod_copy.counter = c;
            prod_copy.name += ' (свой)' 
            settings.toCart(prod_copy, this.components);
        }

        this.init(json);
    }

    /**
     * Инициализирует поп-ап.
     * @param {JSON} json Json объект.
     * 
     * @private
     */
    init(json) {
        this.settings = json.settings;
        for (let key in this.settings) {
            this[this.settings[key].object] = json[this.settings[key].object]
        }
        
        this.show();
        this.createProgressBar(this.settings);

        this.stages=[];
        for (const set in this.settings) {
            const func = () => this.changeStage(this.stages.indexOf(func), set, this.settings[set])
            this.stages.push(func);
        }

        this.updatePrice(this.price);

        this.closeBtn = document.querySelector('.close_popup');
        this.closeBtn.addEventListener('click', () => this.hide());
        
        const popBtnEl = document.querySelector('.popup_nav_btns');
        const stp = () => this.stages[this.stage-1]()
        const stm = () => this.stages[this.stage+1]()
        popBtnEl.children[0].addEventListener('click', stp);
        popBtnEl.children[1].addEventListener('click', stm);
        this.on('close', () => {
            popBtnEl.children[0].removeEventListener('click', stp);
            popBtnEl.children[1].removeEventListener('click', stm);
        });
       
        this.stages[0]();
    }


    /**
     * Создает прогресс-бар в поп-апе.
     * @param {Object} set Объект содержащий пункты прогресс-бара. 
     * 
     * @private
     */
    createProgressBar(set) {
        const root = document.querySelector('.popup_nav_points')
        for (let key in set) {
            const point = document.createElement('li');
            point.setAttribute('name', key)
            point.innerHTML = set[key].name;
            root.append(point);
        }
    }

    /**
     * Меняет заголовок и активный пункт прогресс-бара на указанные.
     * @param {String} title Заголовок поп-апа. 
     * @param {*} compName Название пункта прогресс-бара.
     * 
     * @private
     */
    changeHeader(title, compName) {
        document.querySelector('.popup_header h2').innerText = title;
        try {
            const size_point = document.querySelector(`.popup_nav_points li[name="${compName}"]`);
            for (const el of size_point.parentElement.children) el.classList.toggle('active', el === size_point);
        } catch(er) {
            console.error(er);
        }
    }

    /**
     * Очищает выставленый програмно стиль кнопок и контейнера, также очищая содержимое контейнера.
     * @param {HTMLDivElement} popBtnEl DIV элемент, содержащий кнопки переходов в поп-апе.
     * 
     * @private
     */
    clearStyle(popBtnEl) {
        this.root.style.justifyContent = '';
        this.root.style.flexWrap = '';
        this.root.innerText = '';
        
        popBtnEl.children[0].style.visibility = ''; 
        popBtnEl.children[1].style.visibility = '';
    }

    /**
     * Меняет этап поп-апа, на указанный.
     * @param {Number} stage Номер этапа поп-апа
     * @param {String} compName Название этапа.
     * @param {*} param2 Объект настроек для этапа.
     */
    changeStage(stage, compName, {object, title, multiple=false}) {
        this.stage = stage;

        this.root = document.querySelector('.popup_choose');
        const popBtnEl = document.querySelector('.popup_nav_btns');

        this.changeHeader(title, compName);
        this.clearStyle(popBtnEl);
        
        if (stage == 0) {
            popBtnEl.children[0].style.visibility = 'hidden';
        }

        if (compName == 'finish') {
            popBtnEl.children[0].style.visibility = 'hidden';
            popBtnEl.children[1].style.visibility = 'hidden';
            
            this.root.style.justifyContent = 'flex-start';
            this.root.style.flexWrap = 'nowrap';

            const [img, div, to_cart] = this.done();
            this.root.append(img, div);
            document.querySelector('.popup_footer').append(to_cart);
            return
        }
        
        for (let key in this[object]) {
            let card;

            if (object == 'sizes') 
                card = this.createCard(this[object][key].image, this[object][key].name, this[object][key].price+this.cost);
            else card = this.createCard(this[object][key].image, this[object][key].name, this[object][key].price);
            
            this.addCardListener(card, key, multiple, object, compName);
            card.id = key;
            this.root.append(card);

            if (this.components[compName] == key) {
                for (const el of this.root.children) {
                    el.classList.toggle('active', el === card)
                };
            } else if (this.components[compName] instanceof Array && this.components[compName].indexOf(key) != -1) {
                card.classList.toggle('active');
            }
        } 
        
    }

    /**
     * Создает карточку продукта для поп-апа и возвращает ее.
     * @param {String} image Путь к изображению карточки.
     * @param {String} name Название продукта карточки.
     * @param {(Number|String)} price Стоимость продукта карточки.
     * @returns {HTMLDivElement}
     * 
     * @private
     */
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

    /**
     * Добавляет необходимые слушатели событий на карточку.
     * @param {HTMLDivElement} card Карточка поп-ап продукта.
     * @param {String} key Програмный ключ (имя) продукта.
     * @param {Boolean} multiple Является ли данный этап поп-апа мультивыборным.
     * @param {String} object Название объекта, хранящего данные об этих продуктах.
     * @param {String} compName Програмное название стадии поп-апа. 
     * 
     * @private
     */
    addCardListener(card, key, multiple, object, compName) {
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
                for (const el of this.root.children) el.classList.toggle('active', el === event.target.parentElement);
                if (this.components[compName]) {
                    this.updatePrice(this.price-this[object][this.components[compName]].price);
                }
                this.components[compName] = key;
                this.updatePrice(this.price+this[object][key].price);
            }
        });
    }

    /**
     * Рендерит финальную стадию поп-апа и возвращает ее.
     * @returns {[HTMLImageElement, HTMLDivElement, HTMLDivElement]} Изображение продукта, описание продукта, футер поп-апа.
     * 
     * @private
     */
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
            this.hide();
        });

        const footer_del = () => footer.parentElement.removeChild(footer);
        this.on('close', footer_del);
        this.on('close', () => this.off('close', footer_del))

        toCart_btn.classList.add('btn');
        toCart_btn.innerText = 'В корзину';

        footer.append(count.render('popup'), toCart_btn);

        desc.append(tit, comp, nm);
        return [img, desc, footer];
    }

    /**
     * Обноваляет итоговую стоимость в поп-апе на уазанную.
     * @param {Number} pr Финальная стоимость. 
     * 
     * @private
     */
    updatePrice(pr) {
        this.price = pr;
        document.querySelector('.popup_price').innerText = this.price;
    }

    /**
     * Показывает поп-ап на странице.
     */
    show() {
        document.querySelector('.popup_bg').style.visibility = 'visible';
    }

    /**
     * Скрывает поп-ап.
     */
    hide() {
        document.querySelector('.popup_bg').style.visibility = 'hidden';
        document.querySelector('.popup_nav_points').innerHTML = '';
        this.emit('close');
    }
}