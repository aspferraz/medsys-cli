<template>
  <b-container class="w-50">
    <b-row>
      <h4>Serviço</h4>
    </b-row>
    <b-form @submit.stop.prevent="validateBeforeSubmit" class="mt-3" v-if="currentServico">
      <b-row>
        <b-col>
          <b-form-group
            id="fieldset-1"
            label="Descrição:"
            label-for="input-descricao"
          >
            <b-input
              id="input-descricao"
              name="descricao"
              type="text"
              v-model="currentServico.descricao"
              v-validate="{ required: true, min: 3 }"
              :state="validateState('descricao')"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group id="fieldset-2" label="Valor:" label-for="input-valor" :state="null">
            <ValidationProvider :rules="{ required: true, min_value: 0.01 }" v-slot="{ classes }">
              <money
                class="form-control"
                id="input-valor"
                name="valor"
                v-bind="moneyConfig"
                v-model="currentServico.valor"
                v-validate="{ required: true, min_value: 0.01 }"
                :state="validateState('valor')"
                :class="getClasses(classes, 'valor')"
              />
            </ValidationProvider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row align-h="end" class="my-5">
        <button type="submit" class="btn btn-success mr-2">
          <b-icon icon="arrow-clockwise"></b-icon>&nbsp;Atualizar
        </button>
        <a class="btn btn-light mr-2" :href="'/servicos'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { Money } from "v-money";
import { ValidationProvider } from "vee-validate";
import ServicosDataService from "../services/ServicosDataService.js";
import Messages from "../util/Messages.js";

export default {
  name: "servico",
  components: { Money, ValidationProvider },
  data() {
    return {
      moneyConfig: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: " #",
        precision: 2,
        masked: false
      },
      currentServico: null
    };
  },

  methods: {
    getClasses(classes, ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].changed || this.veeFields[ref].validated)
      ) {
        return classes;
      }
      return {};
    },

    validateState(ref) {
      if (this.veeFields[ref])
        if (
          this.veeFields[ref] &&
          (this.veeFields[ref].changed || this.veeFields[ref].validated)
        ) {
          return !this.veeErrors.has(ref);
        }
      return null;
    },

    getServico(id) {
      ServicosDataService.get(id)
        .then(response => {
          this.currentServico = response.data;
        })
        .catch(e => {
          console.log(e);
          Messages.showErrorToast(this, e);
        });
    },

    updateServico() {
      ServicosDataService.update(this.currentServico)
        .then(response => {
          console.log(response.data);
          console.log(response.status);
          console.log(response.headers);
          Messages.showSuccessToast(this, "Serviço atualizado com sucesso!");
        })
        .catch(e => {
          console.log(e);
          Messages.showErrorToast(this, e);
        });
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          let fields = this.$validator.errors.items.map(item => item.field);
          Messages.showErrorToast(
            this,
            "Alguns campos obrigatórios não foram preenchidos corretamente: " +
              fields.join(", ")
          );
          return;
        }
        this.updateServico();
      });
    }
  },

  mounted() {
    this.getServico(this.$route.params.id);
  }
};
</script>
<!--
<style>
.edit-form {
  max-width: 400px;
  margin: auto;
}
</style>
-->