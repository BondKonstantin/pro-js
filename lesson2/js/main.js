class ProductsList {
    constructor(container = '.products'){
        this.container = container;
        this.goods = [];
        this.allProducts = [];
        this._fetchProducts();
    }

    _fetchProducts() {
        this.goods = [
            {id: 1, title: 'Notebook', img:'img/Notebook.png', price: 2000},
            {id: 2, title: 'Mouse', img:'img/Mouse.png', price: 20},
            {id: 3, title: 'Keyboard', img:'img/Keyboard.png', price: 200},
            {id: 4, title: 'Gamepad', img:'img/Gamepad.png', price: 50},
        ];
    }
    render() {
        const block = document.querySelector(this.container);
        for(let product of this.goods){
            const productObj = new ProductItem(product);
            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend',productObj.render())
        }
    }
    getSum() {
        let res = document.querySelector(this.container);
        res.insertAdjacentHTML("afterend", `<div class="sum container">Сумма заказа: <span>${this.allProducts.reduce((s, item) => s + item.price,0)}</span> </div>`);
    }
}


class ProductItem {
    constructor(product){
        this.title = product.title;
        this.price = product.price;
        this.id = product.id;
        this.img = product.img;

    }

    render() {
        return `<div class="products__item">
                <a href="#">
                    <img src="${this.img}" alt="${this.title}">
                </a>
                 <div class="products__buy">
                    <a href="#" class="products__title">
                        <h3>${this.title}</h3>
                        <p>${this.price}</p>
                    </a>
                    <button class="buy-btn">Купить</button>
                </div>
            </div>`
    }
}

let list = new ProductsList();
list.render();
list.getSum();

class Basket {
    addGoods() {

    }
    removeGoods() {

    }
    changeGoods() {

    }

    render(){

    }
}

class ElemBasket {
    render(){}

}