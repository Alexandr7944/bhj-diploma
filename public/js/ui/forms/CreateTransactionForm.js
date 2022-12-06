/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.element = element;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const user = User.current();
    if(user) {
      Account.list(user, (err, response) => {
        if(response && response.success) {
          let select = document.getElementsByClassName('accounts-select');
          for(let i = 0; i < select.length; i++) {
            select[i].innerHTML = '';
            for(let k = 0; k < response.data.length; k++) {
              select[i].innerHTML += `<option value="${response.data[k].id}">${response.data[k].name}</option>`
            }
          }
        } else {
          console.warn(err);
        }
      });
    }
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if(response && response.success) {
        this.element.reset();
        new Modal(this.element.closest('.modal')).close()
        App.update();
      }else{
        console.warn(err);
      }
    })
  }
}