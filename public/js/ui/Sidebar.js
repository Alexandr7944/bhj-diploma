/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    sidebarToggle.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    })
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const btnregister = document.querySelector('.menu-item_register');
    btnregister.addEventListener('click', () => {
      let register = App.getModal('register');
      register.open();
    })

    const btnLogin = document.querySelector('.menu-item_login');
    btnLogin.addEventListener('click', () => {
      let login = App.getModal('login');
      login.open();
    })

    const btnLogout = document.querySelector('.menu-item_logout');
    btnLogout.addEventListener('click', () => {
      User.logout((err, response) => {
        if(response) {
          App.setState('init');
        }else{
          console.log(err);
        }
      });
    })
  }
}