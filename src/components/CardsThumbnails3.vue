<template class="px-0">
    <div class="w-100 mt-2">
      <div class="row" style="height:175px">
        <div class="card my-auto mt-2 mt-0" v-bind:style="{backgroundImage: image}" role="button" @click="goTo">
          <!-- <div class="container">
            <div class="card-body w-100" v-bind:class="{'active-background':status, 'disabled-background':!status}">
              <strong class="d-inline-block spainhn-text">{{monument}}</strong>
            </div>
          </div> -->
      </div>    
      <div class="col flex-wrap text-start pt-2" style="height:135px; width:123px; max-width: 90vw;">
        <strong class="spainhn-text flex-wrap" style="font-size:9pt;color:var(--spainhn-rojo-corporativo)">{{title}}</strong>
        <div class="text-truncate spainhn-text-small pb-1 mb-2 pt-1" style="font-size:8pt; height:100px; width: 350px; max-width: 100%; white-space: initial; overflow: hidden;">
          <p class="mb-0" v-html="text" style="margin-bottom: 0px; text-overflow: ellipsis !important; overflow-wrap: break-word;"></p>
        </div>
        <div class="text-truncate spainhn-text pb-1" style="font-size:10pt">
          <p class="spainhn-text" style="color:var(--spainhn-rojo-corporativo)"><strong>{{fechasEvento}}</strong></p>
        </div>
      </div>
  
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CardsThumbnail',
    props:{
      imageUrl: String,
      title: String,
      monument: String,
      text: String,
      nombreUrl: String,
      tipo: String,
      fecha: Array
      // date: String
    },
    data(){
      return{
        // image: `url(${require('@/assets/img_avatar.png')})`
        // image: `url(${this.imageUrl})`,
        status: false
        // backgroundImage: {backgroundImage: "url(../assets/img_avatar.png)"}
      }
    },
    methods:{
      showText(){
        if(this.status == true)
          this.status = false;
        else
          this.status = true;
      },
      goTo(){
        let $vm = this;
        if($vm.tipo != "Entrada"){
          $vm.$router.push('/castillos/' + $vm.$route.params.monumentoNombre + '/restaurantes-y-actividades/' + $vm.tipo +'/' + $vm.nombreUrl);        
        }
        else{
          this.$emit('goTo', this.nombreUrl);
        }
      }
    },
    mounted(){
    },
    setup() {
  
    },
    computed:{
      image(){
        let urlEnconded = encodeURI(this.imageUrl)
  
        return `url(${urlEnconded})`;
      },
      fechasEvento(){
  
        if(this.fecha){
  
          if(this.fecha.length == 0){
            return this.$t('default.PROXIMAMENTE_TEXT');
          }
          else{
            let fechasString = "";
  
            let tempFechas = this.fecha;
  
            tempFechas.sort( function(a, b){
                return new Date(a) - new Date(b)
            })
            
            if(this.fecha.length > 1){
              fechasString = new Date(tempFechas[0]).toLocaleDateString('es-ES', {year:'2-digit', month:'2-digit', day:'2-digit'}) + " - ";
              let lastFecha = new Date(tempFechas[ tempFechas.length - 1] ).toLocaleDateString('es-ES', {year:'2-digit', month:'2-digit', day:'2-digit'});
              fechasString += lastFecha;
              return fechasString;
            }
  
            else{
              tempFechas.forEach( date => {
                fechasString += new Date(date).toLocaleDateString('es-ES', {year:'2-digit', month:'2-digit', day:'2-digit'})
              })
              return fechasString;
            }
          }
        }
        else return ""
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
    height: 135px !important;
    width: 132px !important;
    max-width: 90vw;
  }
  .row{
    padding:5px;
    border: 2px solid var(--spainhn-rojo-corporativo);
    border-radius: 10px;
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
    background-color: var(--spainhn-gris-caja);
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
    height: 30%;
    padding: 5% 5%;
    padding-bottom: 10%;
    /* background-color: rgba(0,0,0,0.7); */
    color:white;
    border-radius: 0px 0px 10px 10px;
    z-index: 2;
    overflow: hidden;
  }
  
  .active-background{
    background-color: var(--spainhn-rojo-claro);
  }
  
  .disabled-background{
    background-color: rgba(0,0,0,0.7);
  }
  </style>