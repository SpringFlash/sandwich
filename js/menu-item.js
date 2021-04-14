class MenuItem extends Events {
  static events = {
    click: Symbol("click"),
    active: Symbol("active"),
  };

  /**
   * Пункт меню.
   * @param {String} category Название категории.
   * @param {String} id ID пункта меню.
   */
  constructor(category, id) {
    super(MenuItem.events);
    this.name = category.name;
    this.id = id;
  }

  /**
   * Возвращает HTML элемент "пункта меню".
   * @returns {HTMLLIElement}
   */
  getElement() {
    return document.getElementById(this.id);
  }

  /**
   * Делает активным "пункт меню".
   */
  setActive() {
    this.getElement().classList.add("active");
    this.emit("active");
  }

  /**
   * Делает не активным "пункт меню".
   */
  removeActive() {
    return this.getElement().classList.remove("active");
  }

  /**
   * Рендерит HTML элемент LI "пункта меню" и возвращает его.
   * @returns {HTMLLIElement}
   */
  render() {
    const el = document.createElement("li");
    el.addEventListener("click", () => this.emit("click"));
    el.innerHTML = this.name;
    el.id = this.id;
    return el;
  }
}
