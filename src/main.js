import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ViaCep from 'vue-viacep'
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Install ViaCep
Vue.use(ViaCep)

//Install VeeValidate
Vue.use(VeeValidate, {
  // This is the default
  inject: true,
  // Important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
  // This is not required but avoids possible naming conflicts
  errorBagName: 'veeErrors',
  //Apply classes on your native HTML input fields 
  classes: true,
  classNames: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
})

// Install BootstrapVue
Vue.use(BootstrapVue)

// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})