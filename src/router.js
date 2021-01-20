import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
  base: "/",
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/pacientes",
      name: "pacientes",
      component: () => import("./components/PacientesList")
    },
    {
      path: "/add-paciente",
      name: "add-paciente",
      component: () => import("./components/AddPaciente")
    },
    {
      path: "/pacientes/:id",
      name: "paciente-details",
      component: () => import("./components/Paciente")
    },
    {
      path: "/receita",
      name: "receita",
      component: () => import("./components/Receita")
    },
    {
      path: "/recibos",
      name: "recibos",
      component: () => import("./components/RecibosList")
    },
    {
      path: "/add-recibo",
      name: "add-recibo",
      component: () => import("./components/AddRecibo")
    },
    {
      path: "/servicos",
      name: "servicos",
      component: () => import("./components/ServicosList")
    },
    {
      path: "/servicos/:id",
      name: "servico-details",
      component: () => import("./components/Servico")
    },
    {
      path: "/add-servico",
      name: "add-servico",
      component: () => import("./components/AddServico")
    },
    {
      path: "/add-pessoa",
      name: "add-pessoa",
      component: () => import("./components/AddDadosPessoais")
    },
    {
      path: "/relatorios",
      name: "relatorios",
      component: () => import("./components/Relatorios")
    },
  ]
});
