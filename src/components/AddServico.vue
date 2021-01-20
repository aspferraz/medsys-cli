<template>
  <b-container class="w-50">
    <b-row>
      <h4>Novo Serviço</h4>
    </b-row>
    <!-- <b-row>
      <b-col>{{servico}}</b-col>
    </b-row>-->
    <b-form @submit.stop.prevent="validateBeforeSubmit" class="mt-3" v-if="!submitted">
      <b-row>
        <b-col>
          <b-form-group
            id="fieldset-1"
            label="Descrição:"
            label-for="input-descricao"
            :state="null"
          >
            <b-input
              id="input-descricao"
              name="descricao"
              type="text"
              v-model="servico.descricao"
              v-validate="{ required: true, min: 3 }"
              :state="validateState('descricao')"
            />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-form-group id="fieldset-2" label="Valor:" label-for="input-valor" :state="null">
            <ValidationProvider
              name="valor"
              :rules="{ required: true, min_value: 0.01 }"
              v-slot="{ classes }"
            >
              <money
                class="form-control"
                id="input-valor"
                name="valor"
                v-model="servico.valor"
                v-bind="moneyConfig"
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
          <b-icon icon="check-circle"></b-icon>&nbsp;Salvar
        </button>
        <a class="btn btn-light mr-2" :href="'/servicos'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>

    <b-modal ref="modal-add-new" centered title="Info:">
      <p class="my-4">O cadastro foi gravado com sucesso! Deseja adicionar outro?</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button variant="primary" size="md" class="mr-2" @click="newServico">Adicionar</b-button>
            <b-button variant="secondary" size="md" class="mr-2" @click="back">Voltar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { Money } from "v-money";
import { ValidationProvider } from "vee-validate";
import ServicosDataService from "../services/ServicosDataService.js";
import Messages from "../util/Messages.js";

export default {
  name: "add-servico",
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
      servico: {
        id: null,
        descricao: null,
        valor: 0
      },
      submitted: false
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
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].changed || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    },

    saveServico() {
      ServicosDataService.create(this.servico)
        .then(response => {
          this.servico.id = response.data.id;
          this.submitted = true;
          this.showModal("modal-add-new");
        })
        .catch(e => {
          Messages.showErrorToast(this, e);
        });
    },

    newServico() {
      this.hideModal("modal-add-new");
      this.submitted = false;
      this.servico = {
        id: null,
        descricao: null,
        valor: 0
      };
      this.$nextTick(() => {
        this.$validator.reset();
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
        this.saveServico();
      });
    },

    back() {
      this.$router.push({ name: "servicos" });
    },

    showModal(ref) {
      this.$refs[ref].show();
    },

    hideModal(ref) {
      this.$refs[ref].hide();
    }
  }
};
</script>

<!--
<style>
.submit-form {
  max-width: 400px;
  margin: auto;
}
</style>
-->