<template>
  <b-container>
    <b-row>
      <h4>Receita</h4>
    </b-row>

    <b-form @submit.stop.prevent="validateBeforeSubmit">
      <b-row class="mt-3">
        <b-col>
          <label for="typeahead-nome-paciente">Nome:</label>
          <ValidationProvider name="nome-paciente" :rules="{ required: true }" v-slot="{ classes }">
            <vue-bootstrap-typeahead
              id="typeahead-nome-paciente"
              name="nome-paciente"
              ref="nome-paciente"
              :data="pacientes"
              v-model="pacienteSearch"
              v-validate="{ required: true }"
              :state="validateState('nome-paciente')"
              :inputClass="getInputClass(classes, 'nome-paciente')"
              :serializer="s => s.DadosPessoais.nome"
              placeholder="Entre com o nome do paciente..."
              @hit="selectedPaciente = $event"
            >
              <!-- Begin custom suggestion slot -->
              <template slot="suggestion" slot-scope="{ data, htmlText }">
                <div class="d-flex align-items-center">
                  

                  <!-- Note: the v-html binding is used, as htmlText contains
                  the suggestion text highlighted with <strong> tags-->
                  <span class="ml-4" v-html="htmlText"></span>
                  <span class="ml-1">{{data.DadosPessoais.sobrenome}}</span>
                </div>
              </template>
            </vue-bootstrap-typeahead>
          </ValidationProvider>
        </b-col>
        <b-col>
          <label for="input-sobrenome-paciente">Sobrenome:</label>
          <b-form-input
            id="input-sobrenome-paciente"
            v-model="paciente.DadosPessoais.sobrenome"
            disabled
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="4">
          <div class="form-group">
            <label for="input-dt-nascimento">Data Nascimento:</label>
            <input
              id="input-dt-nascimento"
              class="form-control"
              type="date"
              v-model="paciente.DadosPessoais.dt_nascimento"
              disabled
            />
          </div>
        </b-col>
        <b-col cols="4">
          <label for="input-cpf-paciente">CPF:</label>
          <b-form-input
            id="input-cpf-paciente"
            v-mask="['###.###.###-##']"
            v-model="paciente.DadosPessoais.cpf"
            disabled
          ></b-form-input>
        </b-col>
        <b-col cols="4">
          <label for="input-rg">RG:</label>
          <b-form-input
            id="input-rg"
            v-model="paciente.DadosPessoais.rg"
            :state="null"
            v-mask="['##.###.###-##','##.###.###-#']"
            disabled
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <b-form-textarea id="textarea-plaintext" v-model="receita" rows="10" wrap="hard"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row class="my-3">
        <b-col cols="12">
          <div class="float-right">
            <button type="submit" class="btn btn-primary mr-2">
              <b-icon icon="download"></b-icon>&nbsp;Baixar PDF
            </button>
            <a class="btn btn-light mr-2" :href="'/'">
              <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
            </a>
          </div>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import ReceitasDataService from "../services/ReceitasDataService.js";
import PacientesDataService from "../services/PacientesDataService.js";
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
import { ValidationProvider } from "vee-validate";
import { mask } from "vue-the-mask";
import _ from "underscore";

import Messages from "../util/Messages.js";
export default {
  components: {
    VueBootstrapTypeahead,
    ValidationProvider
  },
  directives: { mask },
  name: "receita",
  data() {
    return {
      receita: "",
      pacientes: [],
      pacienteSearch: "",
      selectedPaciente: null,
      paciente: {
        id: null,
        DadosPessoais: {
          id: null,
          nome: null,
          sobrenome: null,
          cpf: null,
          rg: null,
          dt_nascimento: null
        }
      },
      submitted: false
    };
  },
  watch: {
    pacienteSearch: _.debounce(async function(val) {
      if (this.pacienteSearch.trim().length === 0) {
        this.$refs["nome-paciente"].inputValue = "";
        this.selectedPaciente = null;
        return;
      }
      try {
        this.pacientes = await this.getItemsByNomePaciente(val);
      } catch (error) {
        this.pacientes = [];
      }
    }, 500),

    selectedPaciente: async function(val) {
      if (!val) {
        this.paciente = {
          id: null,
          DadosPessoais: {
            id: null,
            nome: null,
            sobrenome: null,
            cpf: null,
            rg: null,
            dt_nascimento: null
          }
        };
      } else {
        this.paciente = val;
      }
    }
  },

  methods: {
    getInputClass(classes, ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].changed || this.veeFields[ref].validated)
      ) {
        let selectedObject;
        if (ref === "nome-paciente") {
          selectedObject = this.selectedPaciente;
        }
        return classes["is-valid"] && selectedObject
          ? "is-valid"
          : "is-invalid";
      }
      return "";
    },

    validateState(ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].changed || this.veeFields[ref].validated)
      ) {
        let isValid = !this.veeErrors.has(ref);
        return isValid;
      }
      return null;
    },

    async getItemsByNomePaciente(text) {
      console.log("search criteria: " + text);
      if (text && text.trim().length > 0) {
        try {
          const data = await this.searchPacientesByQueryStr(
            `DadosPessoais.nome=${text}`,
            "and",
            1,
            25,
            "DadosPessoais.nome",
            false
          );
          console.log(data);
          return data;
        } catch (e) {
          console.log(e);
          Messages.showErrorToast(this, e);
          return [];
        }
      }
    },

    async searchPacientesByQueryStr(query, op, page, size, sortBy, sortDesc) {
      try {
        let res = await PacientesDataService.findByQueryString(
          query,
          op,
          page,
          size,
          sortBy,
          sortDesc
        );
        const pacientes = res.data.pacientes;
        return pacientes;
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
        // Returning an empty array, allows table to correctly handle
        // internal busy state in case of error
        return [];
      }
    },

    async downloadReceita() {
      let res = await ReceitasDataService.getPdf(
        this.paciente.id,
        this.receita
      );
      try {
        console.log(res);
        this.downloadFile(res, "receita");
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
      }
    },

    downloadFile(response, fileName) {
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", fileName + ".pdf");
      document.body.appendChild(fileLink);

      fileLink.click();

      // It is necessary to create a new blob object with mime-type explicitly set
      // otherwise only Chrome works like it should
      // var newBlob = new Blob([response.data], { type: "application/pdf" });

      // IE doesn't allow using a blob object directly as link href
      // instead it is necessary to use msSaveOrOpenBlob
      // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      //   window.navigator.msSaveOrOpenBlob(newBlob);
      //   return;
      // }

      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      // const data = window.URL.createObjectURL(newBlob);
      // var link = document.createElement("a");
      // link.href = data;
      // link.download = fileName + ".pdf";
      // link.click();
      // setTimeout(function() {
      //   // For Firefox it is necessary to delay revoking the ObjectURL
      //   window.URL.revokeObjectURL(data);
      // }, 100);
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
        this.downloadReceita();
      });
    }
  }
};
</script>