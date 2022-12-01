/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(element) {
      this.element = element;
    }else{
      console.log('TransactionsPage не передан element');
    }
    this.lastOptions;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const removeAccount = document.querySelector('.remove-account');
    removeAccount.addEventListener('click', this.removeAccount);

    const transactionRemove = document.querySelector('.transaction__remove');
    if(transactionRemove) {
      transactionRemove.addEventListener('click', this.removeTransaction(this.lastOptions))
    };
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(this.lastOptions && confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove(this.lastOptions, (err, response) => {
        if(response && response.success) {
          App.updateWidgets();
          App.updateForms();
        }else{
          console.log('TransactionsPage отсутствует ответ для Account.remove', err);
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(confirm('Вы действительно хотите удалить счёт?')) {
      Transaction.remove(id, (err, response) => {
        if(response && response.success) {
          App.update() || this.update();
        }else{
          console.log('TransactionsPage отсутствует ответ для Transaction.remove', err);
        }
      })
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.lastOptions = options;

      Account.get(options, (err, response) => {
        if(response && response.success) {
          response.data.find(item => {
            if(item.id.includes(options.account_id.id)) {
              this.renderTitle(item.name);
            }
          })
        }else{
          console.log('TransactionsPage отсутствует ответ для Account.get', err);
        }
      })

      Transaction.list({account_id: options.account_id.id}, (err, response) => {
        if(response && response.success) {
          this.renderTransactions(response.data);
        }else{
          console.log('TransactionsPage отсутствует ответ для Transaction.list', err);
        }
      })
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = '';
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    const title = document.querySelector('.content-title');
    title.innerText = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const formDate = new Date(date);

    const optionsDate = {
      day: 'numeric',
      month: 'long',
      year:'numeric'
    }
    const optionsTime = {
      hour: "2-digit",
      minute: "2-digit"
    }

    return `${formDate.toLocaleDateString('ru-RU', optionsDate)} в ${formDate.toLocaleTimeString([], optionsTime)}`
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    if(!item) {
      return '';
    }
    return `
    <div class="transaction transaction_${item.type} row">
      <div class="col-md-7 transaction__details">
        <div class="transaction__icon">
            <span class="fa fa-money fa-2x"></span>
        </div>
        <div class="transaction__info">
            <h4 class="transaction__title">${item.name}</h4>
            <div class="transaction__date">${this.formatDate(item.created_at)}</div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="transaction__summ">
            ${item.sum} <span class="currency">₽</span>
        </div>
      </div>
      <div class="col-md-2 transaction__controls">
          <button class="btn btn-danger transaction__remove" data-id="${item.id}">
              <i class="fa fa-trash"></i>  
          </button>
      </div>
    </div>`
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content');
    content.innerHTML = '';
    for(let i = 0; i < data.length; i++) {
      content.innerHTML += this.getTransactionHTML(data[i]);
    }
  }
}