class MenuItem {
    
    onclick(){};
    onactive(){};
    
    constructor(category, id) {
        this.name = category.name;
        this.id = id;
    }

    on(name, func) {
        this['on'+name.toLowerCase()] = func;
    }

    getElement() {
        return document.getElementById(this.id);
    }

    setActive() {
        this.getElement().classList.add('active');
        this.onactive();
        return 
    }

    removeActive() {
        return this.getElement().classList.remove('active');
    }

    render() {
        const el = document.createElement('li');
        el.addEventListener('click', () => this.onclick());
        el.innerHTML = this.name;
        el.id = this.id;
        return el
    }
}