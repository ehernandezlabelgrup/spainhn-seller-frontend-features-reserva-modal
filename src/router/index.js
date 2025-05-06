import Vue from 'vue'
import VueRouter from 'vue-router'
import ApiSellerService from '../services/ApiSeller.service'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path:'/:monumentoNombre/tablero',
    name: 'Dashboard',
    component: () => import('../views/Tablero.vue')
  },
  {
    path:'/:monumentoNombre/productos',
    name:'Productos',
    component: () => import('../views/Productos.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path:'/login',
    name:'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path:'/password-reset',
    name:'PasswordReset',
    component: () => import('../views/PasswordReset.vue')
  },
  {
    path:'/:monumentoNombre/reservar/visita::visitaId',
    name:'Reservar',
    component: () => import('../views/ReservarView.vue')
  },
  {
    path:'/:monumentoNombre/reservar/resumenCompra',
    name: 'Carrito',
    component: () => import('../views/Carrito.vue')
  },
  {
    path:'/:monumentoNombre/reservas',
    name:'Reservas',
    component: () => import('../views/Reservas.vue')
  },
  {
    path:'/:monumentoNombre/reservations-payment/payment',
    name:'ReservasPayment',
    component: () => import('../views/PagarReserva.vue')
  },

  {
    path:'/:monumentoNombre/reservations-payment',
    name:'ReservasPaymentBoard',
    component: () => import('../views/PagoDeReservas.vue')
  },
  {
    path:'/:monumentoNombre/reservation/:localizador/edit',
    name:'ReservaEdition',
    component: () => import('../views/EditarReserva.vue')
  },
  {
    path: '/mayoristaPasswordReset',
    name:'PasswordResetToken',
    component: () => import('../views/PasswordResetByToken.vue')
  },
  {
    path:'/:monumentoNombre/payment/confirm',
    name: 'PaymentConfirm',
    component: () => import('../views/PagoComplete.vue')
  },
  {
    path:'/:monumentoNombre/payment/error',
    name:'PaymentError',
    component: () => import('../views/PagoError.vue')
  },
  {
    path:'/:monumentoNombre/reservas/details',
    name:'ReservationDetails',
    component: () => import('../views/DestallesDeReserva.vue')
  },
  {
    path:'/:monumentoNombre/payments',
    name:'Payments',
    component: () => import('../views/Payments.vue')
  },
  {
    path:'/:monumentoNombre/invoices',
    name:'Invoices',
    component: () => import('../views/Facturacion.vue')
  },
  {
    path:'/profile',
    name: 'Profile',
    component: () => import('../views/Profile/ProfileView.vue')
  },

  {
    path:'/profile/actualizar-password',
    name: 'UpdatePassword',
    component: () => import('../views/Profile/ActualizarPassword.vue')
  }


]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(localStorage.getItem('accessToken'));
  // console.log(to);
  if( (localStorage.getItem('accessToken') === null || localStorage.getItem('accessToken') === '') ){

    if( to.name !== 'Login' && to.name !== 'PasswordReset' ){
      if( to.name =='PasswordResetToken' ){

        let token = to.query.token;
        let user = to.query.id;

        console.log("Resetear password")
        if( token == null || token == undefined || token == "" ){
          next( { 'name':'Login' } )
        }
        else{
          ApiSellerService.checkResetURL( {token:token, user: user} )
            .then( () => {
              next();
            })
            .catch( ()=>{
              next( {name:'Login'} )
            } )
        }
      }
      else{
        next( { name:'Login' } )
      }
    }
    else{
      next();
    }
  }

  else if(to.name === 'Login'){
    if( localStorage.getItem('accessToken') !== null ){
      console.log( localStorage.getItem('accessToken') );
      next( {name:'Home'} )
    }
    else {
      // console.log()
      // localStorage.setItem('accessToken','');
      console.log(localStorage.getItem('accessToken'));
      next({});
    }
  }
  // else next();
  // if(to.name !== 'Login') next( { name:'Login' })
  
  else next();
})


export default router
