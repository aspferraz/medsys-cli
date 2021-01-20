<template>
  <div id="app">
    <b-navbar class="navbar-dark bg-dark">
      <b-navbar-brand href="#">
        <img
          src="./assets/logo_color_white.png"
          class="d-inline-block align-top"
          width="100"
          height="50"
          alt="logo"
        />
      </b-navbar-brand>

      <div class="navbar-nav mr-auto">
        <b-nav-item href="/servicos">Serviços</b-nav-item>

        <b-nav-item-dropdown
          id="my-nav-dropdown"
          text="Cadastro"
          toggle-class="nav-link-custom"
          left
        >
          <b-dropdown-item href="/add-pessoa">Dados pessoais</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item href="/">Pacientes</b-nav-item>
        <b-nav-item href="/receita">Receita</b-nav-item>
        <b-nav-item href="/recibos">Recibos</b-nav-item>
        <b-nav-item href="/relatorios">Relatorios</b-nav-item>
        <b-nav-item @click="$refs['modal-contact-us'].show()">#Contato</b-nav-item>
      </div>
    </b-navbar>

    <div class="container mt-3">
      <router-view />
    </div>

   <b-modal ref="modal-contact-us" centered title="Info:">
      <p class="my-4">Para mais informações, entre em contato conosco pelo e-mail: aspferraz@gmail.com ou pelo whatsapp: +55 75 98896-6597.</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button variant="secondary" size="md" class="mr-2" @click="$refs['modal-contact-us'].hide()">Voltar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>

export default {
  name: "app"
};
</script>