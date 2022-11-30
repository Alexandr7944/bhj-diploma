/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  constructor() {
    this.url = '/user';
  }

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    localStorage.setItem('user', JSON.stringify(user));
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
    return JSON.parse(localStorage.getItem('user'));
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    createRequest({
      url: '/user/current',
      method: 'GET',
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
      url: '/user/login',
      method: 'POST',
      responseType: 'json',
      data,
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
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: '/user/register',
      method: 'POST',
      responseType: 'json',
      data,
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
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    createRequest({
      url: '/user/logout',
      method: 'POST',
      responseType: 'json',
      callback: (err, response) => {
        // callback(err, response);
        if(response && response.success) {
          this.unsetCurrent(response.user);
        } else {
          console.warn(err);
        }
      },
    })
  }
}
