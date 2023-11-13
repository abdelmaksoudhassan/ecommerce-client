<template>
    <div class="margin_h">
      <el-input placeholder="Search By Product Title" v-model="query"></el-input>
      <div v-loading="loading">
        <el-row :gutter="10">
          <el-col v-for="product in productsFilterd" :key="product._id" :xs="12" :sm="8" :md="8" :lg="8" :xl="15">
            <CardDialog :product="product"></CardDialog>
          </el-col>
        </el-row>
      </div>
      <!--  -->
      <div class="splitter"></div>
      <div class="flex-center">
        <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="currentChange()">
      </el-pagination>
      </div>
    </div>
  </template>
  <script>
  import {ref} from 'vue'
  import {mapState,mapActions} from 'pinia'
  import {useProductStore} from '../stores/useProductStore'
  import {useAuthStore} from '../stores/useAuthStore'
  import CardDialog from '../components/card-dialog.vue'
  import {io} from '../helpers/socket'
  export default {
    components:{CardDialog},
    setup(){
      const loading=ref(false)
        const query=ref('')
        const total=ref(0)
        const pageSize=ref(3)
        const currentPage=ref(1)
        const productStore = useProductStore()
        return{loading,query,total,pageSize,currentPage,loading,productStore}
    },
    computed:{
      ...mapState(useProductStore,['products']),
      ...mapState(useAuthStore,['authenticated']),
      productsFilterd(){
        return this.query ? this.products.filter(p=>p.title.toLowerCase().includes(this.query.toLowerCase())) : this.products
      }
    },
    created(){
      const q = this.$route.query.page
      q ? this.currentPage = parseInt(q) : this.currentPage = 1
      this.fetchData()
    },
    mounted(){
      io.on('addProduct',(product)=>{
        const {title} = product
        if(this.currentPage == 1){
          this.popProduct()
          this.pushToProducts(product)
        }
        this.$message({ message: `New product (${title}) added`, type: 'success', showClose: true })
      }),
      io.on('deleteProduct',(id)=>{
        const product = this.getProduct(id)
        if(product){
          const {title} = product
          this.removeProduct(id)
          this.$message({ message: `(${title}) product deleted`, type: 'error', showClose: true })
        }
      }),
      io.on('editProduct',(product)=>{
        const {_id,title} = product
        this.$message({ message: `(${title}) product updated`, type: 'warning', showClose: true })
        this.updateProduct(_id,product)
      })
    },
    methods:{
        ...mapActions(useProductStore,['setProductStore','popProduct','pushToProducts','getProduct','removeProduct','updateProduct']),
    fetchData(){
        this.loading=true
        this.$axios.instance().get(`all-products?page=${this.currentPage}&count=${this.pageSize}`).then(res=>{
          this.total = res.data.total
          this.setProductStore(res.data.products)
          this.loading = false
        }).catch(err=>{
          console.log(err.response)
          this.loading = false
        })
    },
    currentChange(){
      this.$router.push({query:{page:this.currentPage}})
      this.fetchData()
    }
    }
  }
  </script>
  <style scoped>
  .el-input{
    margin: 20px 0px;
  }
  </style>
