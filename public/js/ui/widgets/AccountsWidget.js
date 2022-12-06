/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(element) {
      this.element = element;
      this.update();
    } else {
      console.error('Элемент не задан');
    }
    /**
     * this.registerEvents() перенес в this.update(), потому как не смог найти 
     * способ дать обратботчик элементам, которые пока еще не отрисованы.
     * Может задвоеный вызов
     * */
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    const createAccount = document.querySelector('.create-account');
    createAccount.addEventListener('click', () => {
      App.getModal('createAccount').open();
    });

    let account = this.element.getElementsByClassName('account');
    for(let i = 0; i < account.length; i++) {
      account[i].onclick = this.onSelectAccount(account[i]);
    }
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    const user = User.current();
    if(user) {
      Account.list(user, (err, response) => {
        if(response && response.success) {
          this.clear();
          response.data.find(item => this.renderItem(item));
          this.registerEvents();
        } else {
          console.warn(err);
        }
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    const account = document.querySelectorAll('.account');
    for(let i = 0; i < account.length; i++) {
      account[i].remove();
    }
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    element.addEventListener('click', () => {
      const oldActive = this.element.querySelector('.active');
      if(oldActive) oldActive.classList.remove ('active');
      element.classList.add('active');
      App.showPage( 'transactions', { account_id: element.dataset })
    })
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `
          <li class="account" data-id="${item.id}">
            <a href="#">
                <span>${item.name}</span> /
                <span>${item.sum} ₽</span>
            </a>
          </li>`
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){ 
    this.element.innerHTML += this.getAccountHTML(data);
  }
}
