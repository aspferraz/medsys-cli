<template>
  <b-container>
    <b-row>
      <h3>Cadastro / Dados Pessoais</h3>
    </b-row>

    <!-- <div v-if="!submitted"> -->
    <b-row>
      <b-col>
        <b-form-group label="Tipo Pessoa:">
          <b-form-radio-group
            id="radio-group-1"
            v-model="dadosPessoais.tipo_pessoa"
            :options="tipoPessoaOptions"
            name="radio-options"
          ></b-form-radio-group>
        </b-form-group>
      </b-col>
      <!-- <b-col>{{dadosPessoais}}</b-col> -->
    </b-row>

    <b-form @submit.stop.prevent="validateBeforeSubmit" v-if="dadosPessoais.tipo_pessoa === 'F'">
      <b-row class="mt-3">
        <b-col>
          <label for="input-nome">Nome:</label>
          <b-form-input
            id="input-nome"
            name="nome"
            key="nome"
            v-model="dadosPessoais.nome"
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
            v-model="dadosPessoais.sobrenome"
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
            v-model="dadosPessoais.estado_civil_id"
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
          <b-form-select id="select-sexo" v-model="dadosPessoais.sexo" :options="sexoOptions">
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
              v-model="dadosPessoais.dt_nascimento"
            />
          </div>
        </b-col>
        <b-col>
          <label for="select-profissao">Profissão:</label>
          <b-form-select
            id="select-profissao"
            v-model="dadosPessoais.profissao_id"
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
            v-model="dadosPessoais.rg"
            :state="null"
            v-mask="['##.###.###-##','##.###.###-#']"
            placeholder="Entre com o rg"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-orgao-emissor">Orgão Emissor:</label>
          <b-form-input
            id="input-orgao-emissor"
            v-model="dadosPessoais.orgao_emissor"
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
            v-model="dadosPessoais.cpf"
            v-validate="{ required: true, cpf: true }"
            :state="validateState('cpf')"
            v-mask="['###.###.###-##']"
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
            v-model="dadosPessoais.telefone"
            v-mask="['+55 (##) ####-####']"
            placeholder="+55 (00) 0000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="3">
          <label for="input-celular">Celular:</label>
          <b-form-input
            id="input-celular"
            v-model="dadosPessoais.celular"
            v-mask="['+55 (##) #####-####']"
            placeholder="+55 (00) 90000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="6">
          <label for="input-email">Email:</label>
          <b-form-input
            id="input-email"
            v-model="dadosPessoais.email"
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
            v-model="dadosPessoais.cep"
            v-mask="'#####-###'"
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
            v-model="dadosPessoais.estado_id"
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
            v-model="dadosPessoais.cidade_id"
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
        <a class="btn btn-light mr-2" :href="'/'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>
    <b-form v-else @submit.stop.prevent="validateBeforeSubmit">
      <b-row class="mt-3">
        <b-col>
          <label for="input-razao-social">Razão Social:</label>
          <b-form-input
            id="input-razao-social"
            name="razao social"
            key="razao social"
            v-model="dadosPessoais.razao_social"
            v-validate="{ required: true, min: 3 }"
            :state="validateState('razao social')"
            placeholder="Entre com a razão social"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-nome-fantasia">Nome Fantasia:</label>
          <b-form-input
            id="input-nome-fantasia"
            name="nome fantasia"
            key="nome fantasia"
            v-model="dadosPessoais.nome_fantasia"
            v-validate="{ required: true, min: 3 }"
            :state="validateState('nome fantasia')"
            placeholder="Entre com o nome fantasia"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col>
          <label for="input-cnpj">CNPJ:</label>
          <b-form-input
            id="input-cnpj"
            name="cnpj"
            key="cnpj"
            v-model="dadosPessoais.cnpj"
            v-validate="{ required: true, cnpj: true }"
            :state="validateState('cnpj')"
            v-mask="['##.###.###/####-##']"
            placeholder="Entre com o cnpj"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-nie">Nº Inscrição Estadual:</label>
          <b-form-input
            id="input-nie"
            v-model="dadosPessoais.nie"
            placeholder="Entre com o número da inscrição estadual"
            trim
          ></b-form-input>
        </b-col>
        <b-col>
          <label for="input-nim">Nº Inscrição Municipal:</label>
          <b-form-input
            id="input-nim"
            v-model="dadosPessoais.nim"
            placeholder="Entre com o número da inscrição municipal"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="3">
          <label for="input-telefone">Telefone(fixo):</label>
          <b-form-input
            id="input-telefone"
            v-model="dadosPessoais.telefone"
            v-mask="['+55 (##) ####-####']"
            placeholder="+55 (00) 0000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="3">
          <label for="input-celular">Celular:</label>
          <b-form-input
            id="input-celular"
            v-model="dadosPessoais.celular"
            v-mask="['+55 (##) #####-####']"
            placeholder="+55 (00) 90000-0000"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="6">
          <label for="input-email">Email:</label>
          <b-form-input
            id="input-email"
            v-model="dadosPessoais.email"
            placeholder="email@endereco.com"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="6">
          <label for="input-website">Website:</label>
          <b-form-input
            id="input-website"
            v-model="dadosPessoais.website"
            placeholder="http://www.site.com.br"
            trim
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row class="mt-3">
        <b-col cols="3">
          <label for="input-cep">CEP:</label>
          <b-form-input
            id="input-cep"
            v-model="dadosPessoais.cep"
            v-mask="'#####-###'"
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
            v-model="dadosPessoais.estado_id"
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
            v-model="dadosPessoais.cidade_id"
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
        <a class="btn btn-light mr-2" :href="'/'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>
    <!-- </div> -->

    <b-modal ref="modal-add-new" centered title="Info:">
      <p class="my-4">O cadastro foi gravado com sucesso! Deseja adicionar outro?</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button variant="primary" size="md" class="mr-2" @click="newPessoa">Adicionar</b-button>
            <b-button variant="secondary" size="md" class="mr-2" @click="back">Voltar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import DadosPessoaisDataService from "../services/DadosPessoaisDataService.js";
import ProfissoesDataService from "../services/ProfissoesDataService.js";
import EstadosCivisDataService from "../services/EstadosCivisDataService.js";
import EstadosDataService from "../services/EstadosDataService.js";
import CidadesDataService from "../services/CidadesDataService.js";
// Local Directive
import { mask } from "vue-the-mask";

import Messages from "../util/Messages.js";

export default {
  directives: { mask },
  name: "add-dadospessoais",
  data() {
    return {
      tipoPessoaOptions: [
        { text: "Física", value: "F" },
        { text: "Jurídica", value: "J" }
      ],
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
      dadosPessoais: {
        id: null,
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
      },
      submitted: false
    };
  },

  watch: {
    ["dadosPessoais.estado_id"]: function(val) {
      CidadesDataService.findByEstadoId(val).then(resp => {
        this.cidades = resp.data;
        if (this.endereco.localidade) {
          let cidade = this.cidades
            .filter(cidade => cidade.nome === this.endereco.localidade)
            .shift();
          if (cidade) this.dadosPessoais.cidade_id = cidade.id;
        }
      });
    },

    ["endereco.logradouro"]: function(val) {
      this.endereco.logradouro = val;
      this.dadosPessoais.endereco = JSON.stringify(this.endereco);
    },

    ["endereco.bairro"]: function(val) {
      this.endereco.bairro = val;
      this.dadosPessoais.endereco = JSON.stringify(this.endereco);
    },

    ["endereco.complemento"]: function(val) {
      this.endereco.complemento = val;
      this.dadosPessoais.endereco = JSON.stringify(this.endereco);
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

    checkCnpj(value) {
      let cnpj = value.replace(/\D/g, "");

      if (cnpj == "") return false;

      if (!/^(\d){14}(.){0}$/.test(cnpj)) return false;

      // Elimina CNPJs invalidos conhecidos
      if (
        cnpj == "00000000000000" ||
        cnpj == "11111111111111" ||
        cnpj == "22222222222222" ||
        cnpj == "33333333333333" ||
        cnpj == "44444444444444" ||
        cnpj == "55555555555555" ||
        cnpj == "66666666666666" ||
        cnpj == "77777777777777" ||
        cnpj == "88888888888888" ||
        cnpj == "99999999999999"
      )
        return false;

      // Valida DVs
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0;
      let pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(0)) return false;

      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado != digitos.charAt(1)) return false;

      return true;
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
              this.dadosPessoais.estado_id = resp.data[0].id;
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
        this.savePessoa();
      });
    },

    savePessoa() {
      DadosPessoaisDataService.create(this.dadosPessoais)
        .then(response => {
          this.dadosPessoais.id = response.data.id;
          this.submitted = true;
          this.showModal("modal-add-new");
        })
        .catch(e => {
          Messages.showErrorToast(this, e);
        });
    },

    newPessoa() {
      this.hideModal("modal-add-new");
      this.submitted = false;
      this.dadosPessoais = {
        id: null,
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
      this.$router.push("/");
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
    this.$validator.extend("cnpj", {
      getMessage(field, value) {
        return `O campo "${field}" apresenta valor inválido: "${value}"`;
      },
      validate(value) {
        return self.checkCnpj(value);
      }
    });
  }
};
</script>

<style>
.submit-form {
  max-width: 400px;
  margin: auto;
}
</style>
