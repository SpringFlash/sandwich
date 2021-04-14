class Events {
  store = undefined;

  /**
   * Пользовательские события, которые можно вызывать во время выполнения функций.
   * @param {Object.<string, symbol>} names
   */
  constructor(names = {}) {
    this.names = names;
    this.store = new Store();
  }

  /**
   * Запускает функцию для события
   * @param {String} name Название события
   * @param  {...any} [args=[]] Аргументы для коллбека
   */
  emit(name, ...args) {
    for (let f of this.store.get(this.names[name])) {
      f(...args);
    }
  }

  /**
   * Подписывает функцию к событию
   * @param {String} name Название события
   * @param {Function} func Callback функция
   */
  on(name, func) {
    if (this.names.hasOwnProperty(name)) this.store.set(this.names[name], func);
  }

  /**
   * Отписывет функцию от события
   * @param {String} name Название события
   * @param {Function} func Callback функция
   */
  off(name, func) {
    this.store.remove(this.names[name], func);
  }
}
