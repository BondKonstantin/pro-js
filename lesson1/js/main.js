const products = [
    {id: 1, title: 'Notebook', img:'img/Notebook.png', price: 2000},
    {id: 2, title: 'Mouse', img:'img/Mouse.png', price: 20},
    {id: 3, title: 'Keyboard', img:'img/Keyboard.png', price: 200},
    {id: 4, title: 'Gamepad', img:'img/Gamepad.png', price: 50},
];
//Функция для формирования верстки каждого товара
//Добавить в выводе изображение
const renderProduct = (product) => {
    return `<div class="products__item">
                <a href="#">
                    <img src="${product.img}" alt="${product.title}">
                </a>
                <div class="products__buy">
                    <a href="#" class="products__title">
                        <h3>${product.title}</h3>
                        <p>${product.price}</p>
                    </a>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
};
const renderPage = list => {
    document.querySelector('.products').innerHTML = list.map(product => renderProduct(product)).join('');
};

renderPage(products);