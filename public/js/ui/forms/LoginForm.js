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
        this.element.reset();
        App.setState( 'user-logged' );
        new Modal(this.element.closest('.modal')).close(); //не уверен, что это нормально, прошу дать комментарий
      } else {
        console.warn(err, 'не прошла проверку в loginForm onSubmit');
      }
    });
  }
}