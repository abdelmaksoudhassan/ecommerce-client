import { defineStore } from 'pinia'

export const useProductStore = defineStore('product',{
    state:()=>{
        return{
            products:[]
        }
    },
    actions:{
        setProductStore(data){
            this.products = data
        },
        pushToProducts(data){
            this.products.unshift(data)
        },
        removeProduct(id){
            this.products = this.products.filter(product=>product._id != id)
        },
        popProduct(){
            this.products.pop()
        },
        updateProduct(id,product){
            const index = this.products.findIndex(x=>x._id==id)
            if(index != -1){
                this.products[index] = product
            }
        },
        getProduct(id){
            const arr = this.products.filter(x=> x._id == id)
            return arr.length == 0 ? null : arr[0]
        }
    }
})
