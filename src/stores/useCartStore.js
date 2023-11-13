import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart',{
    state:()=>{
        return{
            cart:[]
        }
    },
    getters:{
        items(state){
            const array = state.cart
            let items = 0
            array.forEach(element => {
                items += element.quantity
            });
            return items
        },
        totalPrice(state){
            let total = 0
            state.cart.forEach(element => {
                total += element.quantity * element.productId.price
            });
            return total
        }
    },
    actions:{
        setCart(data){
            this.cart = data
        },
        clearCart(state){
            this.cart =[]
        }
    }
})