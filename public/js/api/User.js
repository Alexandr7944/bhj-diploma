/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  static url = '/user';

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
    App.update(); //добавлен, чтобы отрисовка происходила после того, как будет авторизован пользователь
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    delete localStorage.user;
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    return localStorage.user ? JSON.parse(localStorage.user) : undefined
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      url: `${this.url}/current`,
      method: 'GET',
      data: this.current(),
      callback: (err, response) => {
        callback(err, response);
        if(response && response.success) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
          console.warn(err);
        }
      },
    })
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: `${this.url}/login`,
      method: 'POST',
      data,
      callback: (err, response) => {
        callback(err, response);
        if(response && response.success) {
          this.setCurrent(response.user);
        }
      },
    })
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: `${this.url}/register`,
      method: 'POST',
      data,
      callback: (err, response) => {
        callback(err, response);
        if(response && response.success) {
          this.setCurrent(response.user);
        }
      },
    })
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: `${this.url}/logout`,
      method: 'POST',
      data: JSON.parse(localStorage.user),
      callback: (err, response) => {
        callback(err, response);
        if(response && response.success) {
          this.unsetCurrent(response.user);
        }
      },
    })
  }
}
