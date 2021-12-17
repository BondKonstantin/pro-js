const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// класс общий Список с общими методами для всех списков класса
class List {
    constructor(url, container, list = list2) { // конструктор с универсальными свойствами актуальными и для каталога и для корзины
// далее создаем поля классов
        this.container = container; //контейнер
        this.list = list; // список
        this.url = url; // адрес
        this.goods = []; // массив товаров и для каталога и для корзины
        this.allProducts = []; // массив объектов класса Товар
        this._init(); // вызывается метод инит который переопределен в потомках
    }

    getJson(url) {
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())// преобразыем массив объектов
            .catch(error => {
                console.log(error);
            })
    }

    handleData(data) {
        this.goods = [...data]; // из внешнего файла получили массив товаров и записали его в goods
        this.render();//вызываем метод
    }

    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }

// вывод всех товаров
    render() {
        console.log(this.constructor.name);// имя класса из которого вызывается метод рендер
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new this.list[this.constructor.name](product);//мы сделали объект товара либо CartItem, либо ProductItem
            console.log(productObj);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }

    _init() {
        return false
    }
}

// Класс товар базовый
class Item {
    constructor(el, img = 'https://via.placeholder.com/200x150') {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }

    render() {//генерация товара для каталога товаров
        return `<div class="products__item" data-id="${this.id_product}">
                <a href="#">
                    <img src="${this.img}" alt="${this.product_name}">
                </a>
                <div class="products__buy">
                    <a href="#" class="products__title">
                        <h3>${this.product_name}</h3>
                        <p>${this.price} $</p>
                    </a>
                    <button class="buy-btn"
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`
    }
}

// Каталог товаров потомок общего класса Списка
class ProductsList extends List {
    constructor(cart, container = '.products', url = "/catalogData.json") {
        //конструктор принимает объект cart класса Корзина
        super(url, container); //вызываем конструктор базового класса List далее все записывается в поля класса List
//далее в основном классе List вызывается метод this.init() (this - тем кто его вызвал в данном случаем ProductsList) _init()
        this.cart = cart;
        this.getJson() // в этом методе черз Родителя класса List мы парсим наш url
            .then(data => this.handleData(data));// запускает паралельно вывод товаров корзины и каталога
    }

    _init() { //регистрация события добавить товар
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('buy-btn')) {
                this.cart.addProduct(e.target); // добавляем товар в корзину принимая источник события через объект евент передавая его в метод addProduct извлекая из кнопки все data атрибуты
            }
        });

    }
}

// Товар каталога полностью совпадает с классом товар
class ProductItem extends Item {
}

// Список товаров корзины, потомок общего класса Список
class Cart extends List {
    constructor(container = ".cart-block", url = "/getBasket.json") {
        super(url, container);//после переходим к методу this.init который в свою очередь отправит нас выполнять метод инит в классе корзина
        this.getJson()
            .then(data => {
                this.handleData(data.contents);//вывели все товары в корзине как в каталоге
            });
    }

//добавление в корзину
    addProduct(element) {
        this.getJson(`${API}/addToBasket.json`) //резалт 1 добавление товаров разрешается
            .then(data => {
                if (data.result === 1) {
                    let productId = +element.dataset['id'];
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find) {
                        find.quantity++;
                        this._updateCart(find);
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'],
                            product_name: element.dataset['name'],
                            quantity: 1
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }

    removeProduct(element) { //удаление товара
        this.getJson(`${API}/deleteFromBasket.json`)
            .then(data => {
                if (data.result === 1) { //если 1 удалять можно
                    let productId = +element.dataset['id']; // получаеи id товара
                    let find = this.allProducts.find(product => product.id_product === productId);// ищим в корзине
                    if (find.quantity > 1) {
                        find.quantity--;
                        this._updateCart(find);
                    } else {
                        this.allProducts.splice(this.allProducts.indexOf(find), 1);// если товар в одном экземпляре то мы его стираем splice - удаление элемента из масива deleteCount 1
                        document.querySelector(`.cart-item[data-id="${productId}"]`).remove(); // удаляем визуально
                    }
                } else {
                    alert('Error');
                }
            })
    }

    _updateCart(product) { //обновляется и пересчитывается на странице
        let block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
        block.querySelector('.product-quantity').textContent = `Quantity: ${product.quantity}`;
        block.querySelector('.product-price').textContent = `$${product.quantity * product.price}`;
    }

    _init() {
        document.querySelector('.btn-cart').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');// либо скрываем либо показываем
        });
        document.querySelector(this.container).addEventListener('click', e => {
            if (e.target.classList.contains('del-btn')) {
                this.removeProduct(e.target); // удаляем товар
            }
        })
    }

}

// Товары корзины потомок базового класса Товаров
class CartItem extends Item {
    constructor(el, img = 'https://via.placeholder.com/100x70') {
        super(el, img);
        this.quantity = el.quantity;
    }

    render() {
        return `<div class="cart-item" data-id="${this.id_product}">
            <div class="product-bio">
            <img src="${this.img}" alt="Some image">
            <div class="product-desc">
            <p class="product-title">${this.product_name}</p>
            <p class="product-quantity">Quantity: ${this.quantity}</p>
        <p class="product-single-price">$${this.price} each</p>
        </div>
        </div>
        <div class="right-block">
            <p class="product-price">$${this.quantity * this.price}</p>
            <button class="del-btn" data-id="${this.id_product}">&times;</button>
        </div>
        </div>`
    }
}

// Данный объект (связь между классами) сделан для того, чтобы в одном методе (render) осуществить вывод Списка товаров одновременно и в каталог и в  корзину
const list2 = {
    ProductsList: ProductItem, // Свойство Каталог Товаров : значение Товар каталога
    Cart: CartItem // Свойство Список товаров корзины : значение Товары корзины
};

let cart = new Cart();
// создали объект класса корзина и передаем его в качестве параметра в коструктор класса
//каталог товаров (ProductsList) чтобы в нем вызывать любые методы класса Cart
let products = new ProductsList(cart);//Если мы хотим использовать в классе
//методы другого класса, то удобнее всего в конструктор передать объект класса,
//методы которого нам нужны в данном классе
//products.getJson(`getProducts.json`).then(data => products.handleData(data));



