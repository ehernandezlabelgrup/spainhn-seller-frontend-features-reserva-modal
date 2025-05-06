<template>
  <monumento-layout>
    <div class="container d-flex mb-3 px-3 my-2">
      <!-- <div class="me-2">
        <span><a href="/">Inicio </a> >> </span>
      </div> -->

      <div class="me-2">
        <!-- <span
          ><a :href="`/${$route.params.monumentoNombre}/tablero`">
            {{ monumentoNombre }}
          </a>
          >>
        </span>
      </div>

      <div class="me-2">
        <span
          ><a :href="`/${$route.params.monumentoNombre}/productos`">
            visitas
          </a>
        </span> -->
      </div>
    </div>

    <div class="container bg-white">
      <div class="text-center">
        <p class="spainhn-title-text">{{ monumentoNombre }}</p>
      </div>
    </div>

    <div class="container px-4">
      <div v-if="!loading">
        <div class="border bg-white">
          <div class="border-bottom text-start py-2 ms-3">
            <h4 class="p-0 my-auto fw-bold">
              {{ $t("default.VISITAS_DISPONIBLES") }}
            </h4>
          </div>
          <div class="px-3 py-3">
            <producto-list-element
              v-for="(producto, index) in productos"
              v-bind:key="index"
              :nombre="producto.nombres[0].texto"
              :imageUrl="`${imagenesUrl}/visitas_castillos/${
                producto.oldId
              }/${encodeURIComponent(producto.banner)}`"
              :descripcion="producto.descripciones[0].texto"
              :horarios="producto.horarios[0].texto"
              :detalles="producto.detalles[0].texto"
              :descuentos="producto.descuentos[0].texto"
              :visitaId="
                typeof producto.oldId === 'string'
                  ? producto.oldId
                  : producto.oldId.toString()
              "
              :disponible="producto.disponible"
              :imagenes="producto.imagenes"
            >
            </producto-list-element>
          </div>
        </div>
      </div>
      <div class="px-3 py-3" v-else>
        <Loader />
      </div>
      <ErrorAlert :show="error" :mensaje="errrorMsg" @close="error = false" />
    </div>
  </monumento-layout>
</template>

<script>
import ProductoListElement from "../components/ProductoListElement.vue";
import ApiSellerService from "../services/ApiSeller.service";
import Loader from "../components/LoaderComponent.vue";
import ErrorAlert from "../components/ErrorAlert.vue";
export default {
  name: "Productos",
  components: {
    ProductoListElement,
    Loader,
    ErrorAlert
  },
  data() {
    return {
      productos: [],
      monumentoNombre: null,
      monumentoId: null,
      imagenesUrl: null,
      loading: false,
      error: false,
      errrorMsg: "Error al cargar los productos",
    };
  },
  methods: {
    logout() {
      localStorage.removeItem("accessToken");
      this.$store.commit("setUser", "");
      this.$router.push("/login");
    },
  },
  computed: {},
  async created() {
    let $vm = this;
    $vm.imagenesUrl = process.env.VUE_APP_IMAGES_URL;
    $vm.monumentoNombre = $vm.$route.params.monumentoNombre.replaceAll(
      "-",
      " "
    );
    $vm.loading = true;
    try {
        
        
      const res = await ApiSellerService.getDescripcion(
        "es",
        $vm.$route.params.monumentoNombre
      );
      this.monumentoId = res.data.id;

      const productosResult = await ApiSellerService.getVisitas(
        "es",
        this.monumentoId
      );

      const tempData = [...productosResult.data];

      tempData.sort((a, b) => {
        return a.orden - b.orden;
      });

      tempData.forEach((p) => {
        p.imagenes.sort((a, b) => {
          return a.order - b.order;
        });
      });
      this.productos = [...tempData];
    } catch (err) {
      if (err.response.status === 403) {
        this.logout();
      }
      this.error = true;
    } finally {
      $vm.loading = false;
    }
  }
};
</script>

<style scoped>
.spainhn-title-text {
  font-size: 1.8rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--spainhn-rojo-corporativo);
  /* background: -webkit-linear-gradient(rgba(242,90,85,1),  rgba(115,43,40,1)); */
  /* background: linear-gradient(90deg,rgba(242,90,85,1),  rgba(115,43,40,1)); */
}
</style>
