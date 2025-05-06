<template>
  <general-layout>
    <div class="home bg-white container border shadow my-5" style="min-width:350px;">
      <div class="row spainhn-table-header my-auto py-3">
        <h3 class="my-auto">
            <font-awesome-icon icon="fa-brands fa-fort-awesome"></font-awesome-icon>
            Monumentos
        </h3>
      </div>

      <div class="container">
        <buscador :placeholder="'Nombre del monumento'" :dataToSearch="monumentos" 
          :fieldToSearch="'nombre'" @busqueda="updateMonumentList" />
      </div>

      <div class="p-5">      
        <div class="border d-flex flex-wrap justify-content-center">
          <mdb-container class="justify-content-around">
            <mdb-btn outline="red" v-bind:class="{'active-button':todos}" @click="activeTodos">TODOS</mdb-btn>
            <mdb-btn outline="red" v-bind:class="{'active-button':favoritos}" @click="activeFavoritos">FAVORITOS</mdb-btn>
          </mdb-container>
          <!-- <monumentos-cards v-for="(monumento, index) in monumentosFiltered" v-bind:key="index"
            :idMonumento="monumento.idMonumento"
            :monument="monumento.Monumento"
            :nombreUrl="monumento.Monumento"
            :favorite="monumento.Favorite"
            :autorizado="monumento.EstadoDeMayorista"
            :EstadoDeSolicitud="monumento.EstadoDeSolicitud"
            :bloqueado="false"
            :imageUrl="`${imagenUrl}/monumentos/${monumento.MonumentoReg}/${monumento.imagen}`"
            @toggleFavorite="toggleFavorite(monumento)"
            @enviarSolicitudAprobacion=" (evt) => enviarSolicitud( evt ) ">
          </monumentos-cards> -->
          <ResultsCards  v-for="(monumento, index) in monumentosFiltered" v-bind:key="index"
            :idMonumento="monumento.idMonumento"
            :monument="monumento.Monumento"
            :nombreUrl="monumento.Monumento"
            :favorite="monumento.Favorite"
            :autorizado="monumento.EstadoDeMayorista"
            :EstadoDeSolicitud="monumento.EstadoDeSolicitud"
            :bloqueado="false"
            :imageUrl="`${imagenUrl}/monumentos/${monumento.MonumentoReg}/${monumento.imagen}`"
            @toggleFavorite="toggleFavorite(monumento)"
            @enviarSolicitudAprobacion=" (evt) => enviarSolicitud( evt ) "
          />
        </div>
      </div>
      
    </div>    

    <success-alert-frame :show="successAlert" :mensaje="successMessage" @close="() => successAlert = false"/>
  </general-layout>
</template>

<script>
// import HomeLayout from '../Layout/HomeLayout.vue'
import ApiSellerService from '../services/ApiSeller.service';
import MonumentosCards from '../components/MonumentosCards.vue'
import Buscador from '../components/Buscador.vue';
import SuccessAlertFrame from '../components/SuccessAlertFrame.vue';
import ResultsCards from '../components/ResultsCards.vue';
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
    // HomeLayout,
    // MonumentosCards,
    ResultsCards,
    Buscador,
    SuccessAlertFrame
},
  data(){
    return{
      loading: false,
      monumentos: [],
      monumentosFiltered: [],
      imageUrl: null,
      todos: true,
      favoritos: false,
      mayoristaInfo: {
        id: null,
        nombre: null
      },
      successAlert: false,
      successMessage: ''
    }
  },
  methods:{
    // Actualizamos la lista de monumentos filtrados
    updateMonumentList( evt ){
      this.monumentosFiltered = evt;
    },
    async toggleFavorite( monumento ){
      // console.log( monumento );
      monumento.Favorite = monumento.Favorite ? false : true;
      const result = await ApiSellerService.updateFavoritos( monumento )
    },
    activeFavoritos(){
      this.favoritos = true;
      this.todos = false;
      console.log( this.monumentosFiltered );
      this.monumentosFiltered = this.monumentosFiltered.filter( monumento => monumento.Favorite === true)

    },
    activeTodos(){
      this.favoritos = false;
      this.todos = true;
      this.monumentosFiltered = this.monumentos;
    },
    async enviarSolicitud( evt ){
      const data = {
        idMonumento: evt.idMonumento,
        monumento: evt.monumento,
        idMayorista: this.mayoristaInfo.id,
        mayorista: this.mayoristaInfo.nombre,
        fechaDeSolicitud: new Date()
      }

      try{
        await ApiSellerService.enviarSolicitudAprobacion( data );
        this.successAlert = true;
        this.successMessage = "Se envío la solicitud de aprobación al monumento"

        this.monumentos.forEach( m => {
          if( m.id == evt.idMonumento ){
            m.autorizado = 1;
          }
        })
      }
      catch( err ){
        console.log( err )
      }

    }
  },
  async created(){
    let $vm = this;
    $vm.loading = true;

    // La url a la que se solicitan las imagenes de los cards
    $vm.imagenUrl = process.env.VUE_APP_IMAGES_URL;

    let carritoUuid = $vm.$store.getters.cartStatus.uuid;

    if( carritoUuid ){
      // Si regresamos al home, borramos el carrito
      let result = await ApiSellerService.deleteCarrito( carritoUuid );
      this.$store.commit('removeAllItems');
    }

    try{
      // Buscamos todos los monumentos disponibles en la red de spain
      const _monumentos = await ApiSellerService.getAllEdificaciones('', 'es');
      this.monumentos = [..._monumentos.data];
      this.monumentosFiltered = [...this.monumentos];
    }
    catch( err ){
      console.log(err);
      this.$store.dispatch('removeAccessToken');
      this.$store.dispatch('fetchAccessToken');
      this.$router.push('/login');
    }

    try{
      const _me = await ApiSellerService.me();
      this.mayoristaInfo.id = _me.data.payload.id;
      this.mayoristaInfo.nombre = _me.data.payload.name;
    }    
    catch( err ){
      console.log( err );
    }
  }
}
</script>

<style scoped>
  .spainhn-table-header{
    background-color: rgb(165, 61, 57) !important;
    color: white;
  }

  .active-button{
    background-color: #ff8a80 !important;
    color: white !important;
  }
</style>