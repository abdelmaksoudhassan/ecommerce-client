import {defineStore} from 'pinia'

export const useAuthStore = defineStore('auth',{
    state:()=>{
        return{
            user:null,
            authenticated: false
        }
    },
    getters:{
        name(state){
            if(state.authenticated){
                return (!!state.user.firstName && !!state.user.lastName) ?
                    `${state.user.firstName} ${state.user.lastName}` : 
                    state.user.email.substr(0,state.user.email.indexOf('@'))
            }else{
                return 'User'
            }
        },
        imageUrl(state){
            return state.user.image ?
             'https://nodejs-ecommerce-o2e5.onrender.com/'+state.user.image :
             "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
        }
    },
    actions:{
        setUser(data){
            this.user = data
        },
        setAuthenticated(){
            this.authenticated = true
        },
        changeImage(url){
            console.log(url,this.user)
            this.user.image = url
        },
        changeName(firstName,lastName){
            this.user.firstName = firstName
            this.user.lastName = lastName
        }
    }
})