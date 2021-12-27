Vue.component('error', {
    data(){
        return {
            text: ''
        }
    },
    methods: {
      setError(error){
          this.text = error
      }
    },
    computed: {
      isVisible(){
          return this.text !== ''
      }
    },
    template: `
    <div class="error" v-if="isVisible"> 
        <p class="error__block">
            {{ text }}
        </p>
        <button class="del-btn" @click="setError('')">&times;</button>
    </div>
    `
})