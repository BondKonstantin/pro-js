class Validator {
    constructor(form) { //принимаем id формы
        this.patterns = { // правила для формы
            name: /^[a-zа-яё]+$/i,
            phone: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
            email: /^[\w._-]+@\w+\.[a-z]{2,4}$/i
        };
        this.errors = { // сообщения об ошибках
            name: 'Имя содержит только буквы',
            phone: 'Телефон подчиняется шаблону +7(000)000-0000',
            email: 'E-mail выглядит как mymail@mail.ru, или my.mail@mail.ru, или my-mail@mail.ru'
        };
        this.errorClass = 'error-msg';
        this.form = form;
        this.valid = false; // по умолчанию считаем, что форма заполнена не верно
        this._validateForm();// метод для проверки валидации
    }
    validate(regexp, value){
        regexp.test(value)
    }
    
    _validateForm(){
        let errors = [...document.getElementById(this.form).querySelectorAll(`.${this.errorClass}`)]; //ищем элемент с нашей формы и в этой форме все элементы с классом ошибка
        // для того чтобы при каждой новой проверки стирать все предыдущии ошибки
        for (let error of errors){
            error.remove();
        }
        let formFields = [...document.getElementById(this.form).getElementsByTagName('input')]; //ищем в нашей форме все элементы с тегом input получаем коллекцию инпутов которую распакаовываем
        for (let field of formFields){ // в цикле по нашему массиву проходим и каждый input передаем в метод _validate
            this._validate(field);
        }
        if(![...document.getElementById(this.form).querySelectorAll('.invalid')].length){ // ищем все красные рамки
           this.valid = true; // если нет красной рамки значит все хорошо и  valid = true 
            //  ВЫПОЛНЯЕТСЯ СОБЫТИЕ submit и данные отправляются 
        }
    }
    _validate(field){ // в него принимаем наш input и проверяем на валидацию
        if(this.patterns[field.name]){ // обращаемся к объекту this.patterns и ищем у него свойство fild.name если true
            if(!this.patterns[field.name].test(field.value)){ // тестируем наше выражение если значение fols то значит подсвечиваем красной рамкой
               field.classList.add('invalid'); // 
               this._addErrorMsg(field); // вызываем метод для получения текстового выражения
               this._watchField(field); // следим за каждым изменением в этом input
            }
        }
    }
    _addErrorMsg(field){ // на вход приходит input с ошибкой
        let error = `<div class="${this.errorClass}">${this.errors[field.name]}</div> `; // строим бок с текстом ошибки
        field.parentNode.insertAdjacentHTML('beforeend', error); // обращаемся к элементу который содержит наш input - parentNote - базовый элемент lable перед его окончанием видим сообщение об ошибке
    }
    _watchField(field){
        field.addEventListener('input', () => { // при каждом действии запускается функция
            let error = field.parentNode.querySelector(`.${this.errorClass}`); // в теге lable ищем ошибку
            if(this.patterns[field.name].test(field.value)){ // проверяем на корректность input
                field.classList.remove('invalid'); // если true то все корректно то удаляем красную рамку
                field.classList.add('valid'); // преобразуя ее в зеленую
                if(error){
                    error.remove();
                }
            } else {
                field.classList.remove('valid');
                field.classList.add('invalid');
                if(!error){
                    this._addErrorMsg(field);
                }
            }
        })
    }
}









