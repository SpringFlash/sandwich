class Popup {
    constructor(product, impCount, toCart) { 
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
        // инициализация функции импорта счетчика количества и добавления в корзину
        this.impCount = impCount;
        this.toCart = toCart;
        
        fetch('./1/data.json')
            .then(response => response.json())
            .then(jsonResponse => this.init(jsonResponse));
    }

    init(json) {
        // считывание и распределение по переменным данных о компонентах
        this.sizes = json.sizes;
        this.breads = json.breads;
        this.vegetables = json.vegetables;
        this.sauces = json.sauces;
        this.fillings = json.fillings;

        // объект с данными о стадиях в поп-апе
        this.stgs = [
            {
                'name': 'Размер',
                'compName': 'size',
                'object': 'sizes',
                'title': 'Выберите размер сендвича',
            }, 
            {
                'name': 'Хлеб',
                'compName': 'bread',
                'object': 'breads',
                'title': 'Хлеб для сендвича на выбор'
            }, 
            {
                'name': 'Овощи',
                'compName': 'vegetable',
                'object': 'vegetables',
                'title': 'Дополнительные овощи бесплатно',
                'multiple': true
            }, 
            {
                'name': 'Соус',
                'compName': 'sauce',
                'object': 'sauces',
                'title': 'Выберите 3 бесплатных соуса по вкусу',
                'multiple': true
            }, 
            {
                'name': 'Начинка',
                'compName': 'filling',
                'object': 'fillings',
                'title': 'Добавьте начинку по вкусу',
                'multiple': true
            }, 
            {
                'compName': '',
                'object': 'finish',
                'title': 'Проверьте и добавьте в корзину'
            }
        ];

        // показываем поп-ап
        this.show();
        
        // создание массива функций по отображению этапов
        this.stages = [];
        this.stgs.forEach ((stg, i) => {
            this.stages.push(() => this.changeStage(i, stg));
        });

        // обновляем цену на полученную от продукта
        this.updatePrice(this.price);

        // добавляем функции к кнопкам закрытия, смены этапа
        const close = document.querySelector('.close_popup');
        close.addEventListener('click', () => this.hide());
        
        const popBtnEl = document.querySelector('.popup_nav_btns');
        popBtnEl.children[0].addEventListener('click', () => this.stages[this.stage-1]());
        popBtnEl.children[1].addEventListener('click', () => this.stages[this.stage+1]());

        this.stages[0](); // запускаем первый этап
    }

    changeStage(stage, {object, compName, title, multiple=false}) {
        this.stage = stage;
        // меняем заголовок поп-апа и ставим активным нужный пункт прогресс-бара
        document.querySelector('.popup_header h2').innerText = title;
        try {
            const size_point = document.querySelector(`.popup_nav_points li[name="${object}"]`);
            for (const el of size_point.parentElement.children) el.classList.toggle('active', el === size_point);
        } catch(er) {
            console.error(er);
        }

        const root = document.querySelector('.popup_choose');
        root.style.justifyContent = '';
        root.style.flexWrap = '';
        root.innerHTML = '';

        const popBtnEl = document.querySelector('.popup_nav_btns');
        popBtnEl.children[0].style.visibility = ''; 
        popBtnEl.children[1].style.visibility = '';

        // в первом пункте убираем кнопку 'Назад'
        if (stage == 0) {
            popBtnEl.children[0].style.visibility = 'hidden';
        }

        // В последнем пункте прячем кнопки смены этапов и выполняя функцию получаем нужные элементы
        if (object == 'finish') {
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

            // создаем карточку: если этап с размерами - то немного иначе определяем цену
            if (object == 'sizes') 
                card = this.createCard(this[object][key].image, this[object][key].name, this[object][key].price+this.cost);
            else card = this.createCard(this[object][key].image, this[object][key].name, this[object][key].price);
            
            // по клику на картинку добавляем функцию выбора этого компонента
            card.querySelector('img').addEventListener('click', (event) => {
                if (multiple) { // если в данной категории компонента можно выбрать несколько
                    
                    if (!event.target.parentElement.classList.contains('active')) { // добавление компонента                    
                        if (object == 'sauces' && this.components[compName].length >= 3) alert('Максимум 3 соуса!');
                        else {
                            this.components[compName].push(key);
                            this.updatePrice(this.price+this[object][key].price);
                            event.target.parentElement.classList.add('active');
                        }          
                    } else { // удаление компонента
                        this.components[compName].splice(this.components[compName].indexOf(key), 1);
                        this.updatePrice(this.price-this[object][key].price);
                        event.target.parentElement.classList.remove('active');
                    }
                    
                } else { // если можно выбрать только один
                    for (const el of root.children) el.classList.toggle('active', el === event.target.parentElement);
                    if (this.components[compName]) {
                        this.updatePrice(this.price-this[object][this.components[compName]].price);
                    }
                    this.components[compName] = key;
                    this.updatePrice(this.price+this[object][key].price);
                }
            });
            card.id = key;
            root.append(card);

            // если в списке продукта данный компонент присутствует
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

    done() {
        const img = document.createElement('img');
        img.src = this.image;
        img.classList.add('product-pic');

        const desc = document.createElement('div');
        desc.classList.add('popup_descr');

        const tit = document.createElement('h3');
        tit.innerText = 'Ваш сендвич готов!';

        const comp = document.createElement('div');
        comp.classList.add('popup_options');

        let i = 0;
        for (let opt in this.components ) {
            const par = document.createElement('p');
            const und = document.createElement('u');
            und.innerText = this.stgs[i].name;
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
            i++;
        }

        const nm = document.createElement('h3');
        nm.innerText = this.name;
        nm.classList.add('popup_product');

        const footer = document.createElement('div');
        const count = this.impCount((c) => this.updatePrice(c), this.price);
        
        const toCart_btn = document.createElement('button');
        toCart_btn.addEventListener('click', () => {
            this.toCart(this.price, this.components);
            this.hide();
        });
        toCart_btn.classList.add('btn');
        toCart_btn.innerText = 'В корзину';

        footer.append(count, toCart_btn);

        desc.append(tit, comp, nm);
        return [img, desc, footer];
    }

    updatePrice(pr) {
        this.price = pr;
        document.querySelector('.popup_price').innerText = this.price;
    }

    show() {
        const popEl = document.querySelector('.popup_bg');
        popEl.style.visibility = 'visible';
    }

    hide() {
        const popEl = document.querySelector('.popup_bg');
        popEl.style.visibility = 'hidden';
    }
}