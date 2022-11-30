/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let formData;
    if(options.method == 'GET') {
        let dataURL = '?';
        for(let key in options.data) {
            dataURL += `${key}=${options.data[key]}&`;
        }
        options.url += dataURL.slice(0, -1);
    } else {
        formData = new FormData;
        for(let key in options.data) {
            formData.append(key, options.data[key]);
        }
    }
    
    const xhr = new XMLHttpRequest();
    try{
        xhr.open(options.method, options.url);
        xhr.responseType = 'json';
        xhr.send(formData);
        xhr.onload = () =>{
            if(xhr.readyState === xhr.DONE && xhr.status == 200) {
                if(xhr.response) {
                    console.log(xhr.response.error, xhr.response);
                    if(xhr.response.success) {
                        options.callback(xhr.response.error, xhr.response);
                    } else {
                        options.callback(xhr.response.error);
                    }
                } else {
                    console.warn('response не получен');
                }
            } else {
                options.callback(`Произошла ошибка, статус запроса: ${xhr.status}`);
            }
        }
    } catch (e) {
        options.callback(e)
    }
}