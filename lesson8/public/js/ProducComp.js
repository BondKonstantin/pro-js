Vue.component('products', {
    data() {
        return {
            catalogUrl: '/catalogData.json',
            products: [],
            filtered: []
        }
    },
    methods: {
        filter(value) {
            let regexp = new RegExp(value, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted() {
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for (let el of data) {
                    this.products.push(el);
                    this.filtered.push(el);
                }
            });
    },
    template: `
            <div class="items__box">
        <product 
        v-for="item of filtered" 
        :key="item.id_product"
        :img="item.img"
        :product="item"
        :text="item.text"></product>
    </div>
    `
});

Vue.component('product', {
    props: ['product'],
    template: `
    <div class="items__box--parent">
                        <img :src="product.img" alt="product.product_name" class="items__img--background">
                        <div class="items__box--bottom">
                            <h3 class="items__box--heading">{{ product.product_name }}</h3>
                            <p class="items__text items__box--paragraph">{{ product.text }}</p>
                            <p class="items__box--sale">$ {{ product.price }}.00 </p>
                            <div class="items__box--opacity">
                                <button class="items__button" @click="$root.$refs.cart.addProduct(product)">
                                    <i class="_icon-card _icon-card--size"></i>
                                    <p class="items__button--paragraph">Купить</p>
                                </button>
                            </div>          
                        </div>
                    </div>
    `
})