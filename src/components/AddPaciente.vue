<template>
  <b-container>
    <b-row>
      <h3>Novo Paciente</h3>
    </b-row>

    <!-- <div v-if="!submitted"> -->
    <b-row>
      <!-- <b-col>{{paciente}}</b-col> -->
    </b-row>

    <b-form @submit.stop.prevent="validateBeforeSubmit">
      <b-row class="mt-3">
        <b-col>
          <label for="input-nome">Nome:</label>
          <b-form-input
            id="input-nome"
            name="nome"
            key="nome"
            v-model="paciente.DadosPessoais.nome"
            v-validate="{ required: true, min: 3 }"
            :state="validateState('nome')"
            placeholder="Entre com o nome"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-nome">Sobrenome:</label>
          <b-form-input
            id="input-sobrenome"
            name="sobrenome"
            key="sobrenome"
            v-model="paciente.DadosPessoais.sobrenome"
            v-validate="{ required: true, min: 3 }"
            :state="validateState('sobrenome')"
            placeholder="Entre com o sobrenome"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="3">
          <label for="select-estado-civil">Estado Civil:</label>
          <b-form-select
            id="select-estado-civil"
            v-model="paciente.DadosPessoais.estado_civil_id"
            :options="estadosCivis"
            value-field="id"
            text-field="nome"
          >
            <!-- This slot appears above the options from 'options' prop -->
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <label for="select-sexo">Sexo:</label>
          <b-form-select
            id="select-sexo"
            v-model="paciente.DadosPessoais.sexo"
            :options="sexoOptions"
          >
            <!-- This slot appears above the options from 'options' prop -->
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
        <b-col>
          <div class="form-group">
            <label for="input-dt-nascimento">Data Nascimento:</label>
            <input
              id="input-dt-nascimento"
              class="form-control"
              type="date"
              v-model="paciente.DadosPessoais.dt_nascimento"
            />
          </div>
        </b-col>
        <b-col>
          <label for="select-profissao">Profissão:</label>
          <b-form-select
            id="select-profissao"
            v-model="paciente.DadosPessoais.profissao_id"
            :options="profissoes"
            value-field="id"
            text-field="nome"
          >
            <!-- This slot appears above the options from 'options' prop -->
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <label for="input-rg">RG:</label>
          <b-form-input
            id="input-rg"
            v-model="paciente.DadosPessoais.rg"
            :state="null"
            v-mask="{mask:'##.###.###-##'}"
            placeholder="Entre com o rg"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-orgao-emissor">Orgão Emissor:</label>
          <b-form-input
            id="input-orgao-emissor"
            v-model="paciente.DadosPessoais.orgao_emissor"
            :state="null"
            placeholder="Entre com o orgão emissor"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-cpf">CPF:</label>
          <b-form-input
            id="input-cpf"
            name="cpf"
            key="cpf"
            v-model="paciente.DadosPessoais.cpf"
            v-validate="{ required: true, cpf: true }"
            :state="validateState('cpf')"
            v-mask="{mask:'###.###.###-##'}"
            placeholder="Entre com o cpf"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="3">
          <label for="input-telefone">Telefone(fixo):</label>
          <b-form-input
            id="input-telefone"
            v-model="paciente.DadosPessoais.telefone"
            v-mask.number="{mask:'+55 (##) ####-####', unmaskedVar: 'paciente.DadosPessoais.unmaskedTelefone'}"
            placeholder="+55 (00) 0000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="3">
          <label for="input-celular">Celular:</label>
          <b-form-input
            id="input-celular"
            v-model="paciente.DadosPessoais.celular"
            v-mask.number="{mask:'+55 (##) #####-####', unmaskedVar: 'paciente.DadosPessoais.unmaskedCelular'}"
            placeholder="+55 (00) 90000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="6">
          <label for="input-email">Email:</label>
          <b-form-input
            id="input-email"
            v-model="paciente.DadosPessoais.email"
            placeholder="email@endereco.com"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="3">
          <label for="input-cep">CEP:</label>
          <b-form-input
            id="input-cep"
            v-model="paciente.DadosPessoais.cep"
            v-mask="{mask:'#####-###'}"
            placeholder="00000-000"
            @blur="consultarCEP"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-logradouro">Logradouro:</label>
          <b-form-input
            id="input-logradouro"
            v-model="endereco.logradouro"
            placeholder="Entre com o logradouro"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-bairro">Bairro:</label>
          <b-form-input
            id="input-bairro"
            v-model="endereco.bairro"
            placeholder="Entre com o bairro"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="4">
          <label for="input-complemento">Complemento:</label>
          <b-form-input
            id="input-complemento"
            v-model="endereco.complemento"
            placeholder="Entre com o complemento"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="3">
          <label for="select-estado">Estado:</label>
          <b-form-select
            id="select-estado"
            v-model="paciente.DadosPessoais.estado_id"
            :options="estados"
            value-field="id"
            text-field="nome"
          >
            <!-- This slot appears above the options from 'options' prop -->
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
        <b-col cols="5">
          <label for="select-cidade">Cidade:</label>
          <b-form-select
            id="select-cidade"
            v-model="paciente.DadosPessoais.cidade_id"
            :options="cidades"
            value-field="id"
            text-field="nome"
          >
            <!-- This slot appears above the options from 'options' prop -->
            <template v-slot:first>
              <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
            </template>
          </b-form-select>
        </b-col>
      </b-row>

      <b-row align-h="end" class="my-5">
        <button type="submit" class="btn btn-success mr-2">
          <b-icon icon="check-circle"></b-icon>&nbsp;Salvar
        </button>
        <a class="btn btn-light mr-2" :href="'/pacientes'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>
    <!-- </div> -->
    <b-modal ref="modal-add-new" centered title="Info:">
      <p class="my-4">O paciente foi gravado com sucesso! Deseja adicionar outro?</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button variant="primary" size="md" class="mr-2" @click="newPaciente">Adicionar</b-button>
            <b-button variant="secondary" size="md" class="mr-2" @click="back">Voltar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
// import DadosPessoaisDataService from "../services/DadosPessoaisDataService.js";
import PacientesDataService from "../services/PacientesDataService.js";
import ProfissoesDataService from "../services/ProfissoesDataService.js";
import EstadosCivisDataService from "../services/EstadosCivisDataService.js";
import EstadosDataService from "../services/EstadosDataService.js";
import CidadesDataService from "../services/CidadesDataService.js";
// Local Directive
//import { mask } from "vue-the-mask";
import { mask } from '@titou10/v-mask';

import Messages from "../util/Messages.js";

export default {
  directives: { mask },
  name: "add-paciente",
  data() {
    return {
      sexoOptions: [
        { text: "Masculino", value: "M" },
        { text: "Feminino", value: "F" }
      ],
      endereco: {
        logradouro: null,
        complemento: null,
        bairro: null,
        localidade: null,
        uf: null
      },
      profissoes: [],
      estadosCivis: [],
      estados: [],
      cidades: [],
      paciente: {
        id: null,
        dados_pessoais_id: null,
        DadosPessoais: {
          tipo_pessoa: "F",
          nome: null,
          sobrenome: null,
          sexo: null,
          dt_nascimento: null,
          razao_social: null,
          nome_fantasia: null,
          rg: null,
          orgao_emissor: null,
          cpf: null,
          cnpj: null,
          nie: null,
          nim: null,
          email: null,
          website: null,
          telefone: null,
          celular: null,
          cep: null,
          endereco: null,
          pagador: true,
          estado_id: null,
          cidade_id: null,
          estado_civil_id: null,
          profissao_id: null
        }
      },
      submitted: false
    };
  },

  watch: {
    ["paciente.DadosPessoais.dt_nascimento"]: function(val) {
      if (!val || /^\s*$/.test(val)) {
        this.paciente.DadosPessoais.dt_nascimento = null;  
      }
    },

    ["paciente.DadosPessoais.estado_id"]: function(val) {
      CidadesDataService.findByEstadoId(val).then(resp => {
        this.cidades = resp.data;
        if (this.endereco.localidade) {
          let cidade = this.cidades
            .filter(cidade => cidade.nome === this.endereco.localidade)
            .shift();
          if (cidade) this.paciente.DadosPessoais.cidade_id = cidade.id;
        }
      });
    },

    ["endereco.logradouro"]: function(val) {
      this.endereco.logradouro = val;
      this.paciente.DadosPessoais.endereco = JSON.stringify(this.endereco);
    },

    ["endereco.bairro"]: function(val) {
      this.endereco.bairro = val;
      this.paciente.DadosPessoais.endereco = JSON.stringify(this.endereco);
    },

    ["endereco.complemento"]: function(val) {
      this.endereco.complemento = val;
      this.paciente.DadosPessoais.endereco = JSON.stringify(this.endereco);
    }
  },

  methods: {
    validateState(ref) {
      if (
        this.veeFields[ref] &&
        (this.veeFields[ref].dirty || this.veeFields[ref].validated)
      ) {
        return !this.veeErrors.has(ref);
      }
      return null;
    },

    checkCpf(value) {
      let cpf = value.replace(/\D/g, "");

      if (cpf == "") return false;

      if (!/^(\d){11}(.){0}$/.test(cpf)) return false;

      // Elimina CPF invalido conhecido
      if (cpf == "00000000000") return false;

      let soma = 0;
      let resto;

      for (let i = 1; i <= 9; i++)
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
      resto = (soma * 10) % 11;

      if (resto == 10 || resto == 11) resto = 0;
      if (resto != parseInt(cpf.substring(9, 10))) return false;

      soma = 0;
      for (let i = 1; i <= 10; i++)
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
      resto = (soma * 10) % 11;

      if (resto == 10 || resto == 11) resto = 0;
      if (resto != parseInt(cpf.substring(10, 11))) return false;
      return true;
    },

    consultarCEP(event) {
      let value = event.target.value;
      if (value) {
        let cep = value.replace(/\D/g, "");
        this.$viaCep.buscarCep(cep).then(obj => {
          this.endereco.logradouro = obj.logradouro;
          this.endereco.bairro = obj.bairro;
          this.endereco.complemento = obj.complemento;
          this.endereco.localidade = obj.localidade;
          if (obj.uf) {
            EstadosDataService.findByUf(obj.uf).then(resp => {
              this.paciente.DadosPessoais.estado_id = resp.data[0].id;
            });
          }
        });
      }
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
        this.savePaciente();
      });
    },

    savePaciente() {
      let clonedPaciente = JSON.parse(JSON.stringify(this.paciente));
      clonedPaciente.DadosPessoais.telefone = this.paciente.DadosPessoais.unmaskedTelefone;
      clonedPaciente.DadosPessoais.celular = this.paciente.DadosPessoais.unmaskedCelular; 
      
      PacientesDataService.create(clonedPaciente)
        .then(response => {
          this.paciente.id = response.data.id;
          this.submitted = true;
          this.showModal("modal-add-new");
        })
        .catch(e => {
          Messages.showErrorToast(this, e);
        });
    },

    newPaciente() {
      this.hideModal("modal-add-new");
      this.submitted = false;
      this.paciente = {
        id: null,
        dados_pessoais_id: null,
        DadosPessoais: {
          tipo_pessoa: "F",
          nome: null,
          sobrenome: null,
          sexo: null,
          dt_nascimento: null,
          razao_social: null,
          nome_fantasia: null,
          rg: null,
          orgao_emissor: null,
          cpf: null,
          cnpj: null,
          nie: null,
          nim: null,
          email: null,
          website: null,
          telefone: null,
          celular: null,
          cep: null,
          endereco: null,
          pagador: true,
          estado_id: null,
          cidade_id: null,
          estado_civil_id: null,
          profissao_id: null
        }
      };
      this.endereco = {
        logradouro: null,
        complemento: null,
        bairro: null,
        localidade: null,
        uf: null
      };
      this.$nextTick(() => {
        this.$validator.reset();
      });
    },

    retrieveProfissoes() {
      ProfissoesDataService.getAll()
        .then(res => {
          console.log(res.data);
          this.profissoes = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    retrieveEstadosCivis() {
      EstadosCivisDataService.getAll()
        .then(res => {
          console.log(res.data);
          this.estadosCivis = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    retrieveEstados() {
      EstadosDataService.getAll()
        .then(res => {
          console.log(res.data);
          this.estados = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    retrieveCidadesByEstadoId(estado_id) {
      CidadesDataService.findByEstadoId(estado_id)
        .then(res => {
          console.log(res.data);
          this.cidades = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    back() {
      this.$router.push({ name: "pacientes" });
    },

    showModal(ref) {
      this.$refs[ref].show();
    },

    hideModal(ref) {
      this.$refs[ref].hide();
    }
  },

  mounted() {
    this.retrieveProfissoes();
    this.retrieveEstadosCivis();
    this.retrieveEstados();
  },

  created() {
    let self = this;
    this.$validator.extend("cpf", {
      getMessage(field, value) {
        return `O campo "${field}" apresenta valor inválido: "${value}"`;
      },
      validate(value) {
        return self.checkCpf(value);
      }
    });
  }
};
</script>