const product = {
    props: ['product'],
    template: `<div class="items__box--parent">
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
                    </div>`
}

const products = {
    components: {product},
    data () {
        return {
            products: [],
            filtered: []
        }
    },
    mounted () {
        console.log (this.$root.$refs)

        this.$parent.getJson(`getProducts.json`)
            .then(data => {
                for(let el of data){
                    this.products.push(el);
                    this.filtered.push(el);
                }
                console.log (this.filtered)
            });
    },
    methods: {
        filter (val) {
			let regExp = new RegExp (val, 'i');
            this.filtered = this.products.filter (el => regExp.test (el.product_name))
        }
    },
    template: `
    <div class="items__box">
        <product 
        v-for="product of filtered" 
        :key="product.id_product"
        :img="product.img"
        :product="product"
        :text="product.text"></product>
    </div>
    `
}