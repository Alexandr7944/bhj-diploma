/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, ( err, response ) => {
      if(response && response.success) {
        App.setState( 'user-logged' );
        this.element.closest('.modal').style.display = '';
        this.element.reset();
      }else{
        console.log(err);
      }
    });

    // const btn = this.element.closest('.modal').querySelector('.btn-primary');
    // btn.onclick = this.close();
    // this.element.closest('.modal').style.display = ''; //найти способ реализации через метод close
  }
}