<template>
    <div class="card my-auto mx-2 mt-5 px-0">
        <!-- <div class="container">
          <div class="card-body">
            <strong class="d-block spainhn-lg-text">{{monument}}</strong>
          </div>
        </div> -->
        <mdb-card class="red darken-4 text-white px-0 data-container" role="button">
          <mdb-card-body class="p-0" style="position: relative; z-index: 1;">
            <div @click="() => goToMicrosite()">
              <mdb-view hover style="height: 150px;">
                <mdb-card-image :src="image" alt="Card image cap"></mdb-card-image>
                <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
              </mdb-view>
    
              <mdb-btn
                tag="a"
                floating
                action
                @click="emitAction"
                style="z-index: 4; position: absolute; top: 10"
                :disabled="disableButton"
                :color="buttonColor"
                class="ml-auto mr-2">
                  <mdb-icon :icon="icon"/>
              </mdb-btn>
            </div>
  
            <!-- 
            <mdb-btn 
              tag="a" 
              @click="addToFavorite" 
              floating 
              action 
              class="ml-auto mr-4" 
              v-bind:class="{'red lighten-4':!isFavorite, 'red darken-3':isFavorite, 'd-none': permitidoReservar != 2  }" 
              :style="{zIndex:1}">
              <mdb-icon icon="heart" class="pl-1" />
            </mdb-btn>
  
            <mdb-btn 
              tag="a" 
              @click="addToFavorite" 
              floating 
              action 
              class="ml-auto mr-4" 
              v-bind:class="{'d-none': (permitidoReservar != 3 ) }" 
              :disabled="true"
              :style="{zIndex:1}">
              <mdb-icon icon="lock" class="pl-1" />
            </mdb-btn>
  
            <mdb-btn 
              tag="a" 
              @click="sendAproveRequest" 
              floating 
              action 
              class="ml-auto mr-4 lighten-2" 
              v-bind:class="{'d-none': (permitidoReservar == 3 || permitidoReservar == 2), 'blue': permitidoReservar == 0, 'grey': permitidoReservar == 1 }" 
              :style="{zIndex:1}" 
              :disabled="permitidoReservar == 1">
  
              <mdb-icon icon="paper-plane" class="pl-1" />
  
            </mdb-btn> -->
          </mdb-card-body>
  
            <mdb-card-footer class="pt-4" style="height:100px; position:relative; z-index: 0 !important;">
              <p class="font-small grey-dark-text mb-0 fw-bold mt-auto">{{monument}}</p>
              <!-- <mdb-btn size="sm" class="fw-bold mdb-color lighten-5" @click="goToMicrosite" v-bind:class="{'d-none': permitido }">
                Comprar/Reservar
              </mdb-btn> -->
              <mdb-btn size="sm" class="fw-bold mdb-color lighten-5" @click="goToMicrositeBuy" style="z-index: 1">
                Comprar/Reservar
              </mdb-btn>
            </mdb-card-footer>
        </mdb-card>
    </div>
</template>

<script>
export default {
  name: 'Cards2',
  props:{
    imageUrl: String,
    // title: String,
    bloqueado: Boolean,
    monument: String,
    idMonumento: String,
    text: String,
    nombreUrl: String,
    favorite: {type: Boolean, default:false},
    autorizado: { type: String, default: 'Waiting'},
    EstadoDeSolicitud: String
    // date: String
  },
  data(){
    return{
      status: false,
      // icon: ''
    }
  },
  methods:{
    emitAction(){
      let action = null;
      // if( this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'None' ){
      //   action = 'Enviar_Solicitud';
      // }
      action = 'Agregar_Favorito';
      this.actions( action );
    },
    actions( action ){
      switch( action ){
        case 'Enviar_Solicitud':
          return this.$emit('enviarSolicitudAprobacion', { idMonumento: this.idMonumento, monumento: this.monument } )
        case 'Agregar_Favorito':
          return this.$emit( 'toggleFavorite' )
      }
    },
    showText(){
      this.status = true;
    },
    hideText(){
      this.status = false;
    },
    goToMicrosite(){
      let $vm = this;
      $vm.$router.push('/' + $vm.encodedUrl + '/tablero');
    },
    goToMicrositeBuy(){
      this.$router.push('/' + this.encodedUrl + '/productos');
    },
    addToFavorite(){
      this.$emit('toggleFavorite')
    },
    sendAproveRequest(){
      const payload = {
        idMonumento : this.idMonumento,
        monumento: this.monument
      }
      this.$emit( 'enviarSolicitudAprobacion', payload );
    }
  },
  setup() {

  },
  created(){
  },
  computed: {
    icon(){
      // return
      if( this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'None' ){
        return 'paper-plane'
      }
      else if( this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'Sent' ){
        return 'paper-plane'
      }
      // else if( this.autorizado === 'Ok' && this.Favorite === false ){
      //   return 'heart'
      // }
      else if( this.autorizado === 'Ok' ){
        return 'heart';
      }
      // Para volver al estado anterior, quitar este comentario
      // return 'paper-plane';
      return 'heart'
    },
    disableButton(){
      if( this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'Sent' ){
        return true
      }
      
      return false;
    },
    permitido(){
      if( this.autorizado === 'Ok' ){
        return false
      }
      else{
        return true;
      }
      
    },
    buttonColor(){
      if( this.autorizado === 'Waiting' && this.EstadoDeSolicitud === 'Sent' ){
        return 'light-blue'
      }
      else if( this.autorizado === 'Ok' && this.favorite === false ){
        return 'danger'
      }
      else if( this.autorizado === 'Ok' && this.favorite === true ){
        return 'deep-orange'
      }
      else{
        return 'primary'
      }
    },

    isFavorite(){
      return this.favorite;
    },
    image(){
      return `${this.imageUrl}`;
    },
    encodedUrl(){
      let $vm = this;

      let rawName =  $vm.nombreUrl.replaceAll(',', '');
      rawName =  rawName.replaceAll('.', '');

      let nombreNormalizado = rawName.normalize("NFD").replace( /[\u0300-\u036f]|[^0-9a-zA-Z]+[\u0020]/g,'')
      let nombreNormalizadoLowerCase = nombreNormalizado.toLowerCase().replace(/[\u0020]/g, '-');
      
      return nombreNormalizadoLowerCase;
    },
    permitidoReservar(){
      return this.autorizado;
    }
  }
}
</script>

<style scoped>
.card {
  /* Add shadows to create the "card" effect */
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
  transition: 0.3s;
  border-radius: 10px;
  /* background-image: url('../assets/img_avatar.png'); */
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  align-items: center;
  height: 250px;
  width: 250px;
  min-width: 120px;
  position: relative;
  z-index: 0;
}

.data-container{
  z-index: 0;
  position: relative;
}

img {
    border-radius: 10px 1px 0 0;
}
/* On mouse-over, add a deeper shadow */
.card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
}

/* Add some padding inside the card container */
.container {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0px 0px;
  height: 100%;
  border-radius: 10px;
  position: relative;
}

.content{
  z-index: 1;
  position: absolute;
  height: 100%;
  width: 100%;
  top:0%;
  /* padding-top:5%; */
  padding: 5% 8% 5% 8%;
  padding-bottom: 20%;
  overflow: hidden;
  border-radius: 10px 10px 0px 0px;
  transition: 0.3s;
}

.card-body{
  padding: 5% 5%;

  padding-bottom: 10%;
  background-color: rgba(0,0,0,0.7);
  color:white;
  border-radius: 0px 0px 10px 10px;
  z-index: 2;
  overflow: hidden;

}

.active-background{
  background-color: var(--spainhn-rojo-corporativo);
}

.disabled-background{
  background-color: rgba(0,0,0,0.7);
}
</style>