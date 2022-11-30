/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, response) => {
      if(response) {
        App.setState( 'user-logged' );
        this.element.reset();
        this.element.closest('.modal').style.display = '';
      } else {
        console.warn(err, 'не прошла проверку в loginForm onSubmit');
      }
    });

    
    // const btn = this.element.closest('.modal').querySelector('.btn-primary');
    // btn.onclick = this.close();
    // this.element.closest('.modal').style.display = ''; //найти способ реализации через метод close
  }
}