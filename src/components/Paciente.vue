<template>
  <b-container>
    <b-row>
      <h3>Paciente</h3>
    </b-row>

    <!-- <div v-if="!submitted"> -->
    <b-row>
      <!-- <b-col>{{paciente}}</b-col> -->
    </b-row>
    <b-row align-h="start" class="mt-3">
      <b-btn href="#" v-b-toggle.accordion1 variant="primary">
        <span>
          <b-icon icon="clock-history"></b-icon>
        </span>
        Histórico
        <span class="when-opened">
          <b-icon icon="chevron-up"></b-icon>
        </span>
        <span class="when-closed">
          <b-icon icon="chevron-down"></b-icon>
        </span>
      </b-btn>
    </b-row>
    <b-row class="mt-3">
      <b-col cols="12">
        <b-collapse id="accordion1" class="mt-2">
          <b-card>
            <b-row>
              <b-col>
                <b-form-textarea
                  v-if="currentPaciente && currentPaciente.Historicos && currentPaciente.Historicos.length > 0"
                  id="textarea-plaintext"
                  rows="2"
                  max-rows="8"
                  :plaintext="!isTextAreaEditable"
                  :value="historico"
                ></b-form-textarea>
              </b-col>
            </b-row>
            <b-row class="mt-4">
              <b-col cols="12">
                <div class="float-right">
                  <b-button
                    variant="secondary"
                    size="md"
                    @click="showModal('modal-novo-historico')"
                    class="mr-1"
                  >Novo</b-button>
                  <b-button
                    variant="secondary"
                    size="md"
                    @click="showModal('modal-editar-ultimo-historico')"
                    class="mr-1"
                  >Editar Último</b-button>
                  <b-button
                    variant="secondary"
                    size="md"
                    @click="showModal('modal-remover-ultimo-historico')"
                    class="mr-1"
                  >Remover Último</b-button>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <b-form @submit.stop.prevent="validateBeforeSubmit" v-if="currentPaciente">
      <b-row class="mt-3">
        <b-col>
          <label for="input-nome">Nome:</label>
          <b-form-input
            id="input-nome"
            name="nome"
            key="nome"
            v-model="currentPaciente.DadosPessoais.nome"
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
            v-model="currentPaciente.DadosPessoais.sobrenome"
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
            v-model="currentPaciente.DadosPessoais.estado_civil_id"
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
            v-model="currentPaciente.DadosPessoais.sexo"
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
              v-model="currentPaciente.DadosPessoais.dt_nascimento"
            />
          </div>
        </b-col>
        <b-col>
          <label for="select-profissao">Profissão:</label>
          <b-form-select
            id="select-profissao"
            v-model="currentPaciente.DadosPessoais.profissao_id"
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
            v-model="currentPaciente.DadosPessoais.rg"
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
            v-model="currentPaciente.DadosPessoais.orgao_emissor"
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
            v-model="currentPaciente.DadosPessoais.cpf"
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
            v-model="currentPaciente.DadosPessoais.telefone"
            v-mask="['+55 (##) ####-####']"
            placeholder="+55 (00) 0000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="3">
          <label for="input-celular">Celular:</label>
          <b-form-input
            id="input-celular"
            v-model="currentPaciente.DadosPessoais.celular"
            v-mask="['+55 (##) #####-####']"
            placeholder="+55 (00) 90000-0000"
            trim
          ></b-form-input>
        </b-col>
        <b-col cols="6">
          <label for="input-email">Email:</label>
          <b-form-input
            id="input-email"
            v-model="currentPaciente.DadosPessoais.email"
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
            v-model="currentPaciente.DadosPessoais.cep"
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
            v-model="currentPaciente.DadosPessoais.estado_id"
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
            v-model="currentPaciente.DadosPessoais.cidade_id"
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
          <b-icon icon="arrow-clockwise"></b-icon>&nbsp;Atualizar
        </button>
        <a class="btn btn-light mr-2" :href="'/pacientes'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>
    <b-modal
      id="modal-novo-historico"
      centered
      title="Novo registro de acompanhamento do paciente:"
    >
      <b-form-textarea rows="10" lang="pt-BR" v-model="evolucaoText"></b-form-textarea>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button
              variant="primary"
              size="md"
              class="mr-2"
              @click="adicionarHistorico(evolucaoText)"
            >Adicionar</b-button>
            <b-button
              variant="secondary"
              size="md"
              class="mr-2"
              @click="$bvModal.hide('modal-novo-historico')"
            >Cancelar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
    <b-modal
      id="modal-editar-ultimo-historico"
      centered
      title="Último registro de acompanhamento cadastrado:"
    >
      <b-form-textarea rows="10" lang="pt-BR" v-model="evolucaoText"></b-form-textarea>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button
              variant="primary"
              size="md"
              class="mr-2"
              @click="salvarUltimoHistorico(evolucaoText)"
            >Salvar</b-button>
            <b-button
              variant="secondary"
              size="md"
              class="mr-2"
              @click="$bvModal.hide('modal-editar-ultimo-historico')"
            >Cancelar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
    <b-modal id="modal-remover-ultimo-historico" centered title="Confirmação:">
      <p class="my-4">O último registro de acompanhamento será removido. Deseja prosseguir?</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button variant="primary" size="md" class="mr-2" @click="removerUltimoHistorico">Sim</b-button>
            <b-button
              variant="secondary"
              size="md"
              class="mr-2"
              @click="$bvModal.hide('modal-remover-ultimo-historico')"
            >Não</b-button>
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
import HistoricosDataService from "../services/HistoricosDataService.js";
// Local Directive
import { mask } from "vue-the-mask";

import Messages from "../util/Messages.js";

export default {
  directives: { mask },
  name: "paciente",
  data() {
    return {
      sexoOptions: [
        { text: "Masculino", value: "M" },
        { text: "Feminino", value: "F" }
      ],
      profissoes: [],
      estadosCivis: [],
      estados: [],
      cidades: [],
      endereco: null,
      currentPaciente: null,
      isTextAreaEditable: false,
      evolucaoText: ""
      // submitted: false
    };
  },

  computed: {
    historico() {
      let historico = "";
      if (
        this.currentPaciente.Historicos &&
        this.currentPaciente.Historicos.length > 0
      ) {
        this.currentPaciente.Historicos.forEach((h, index) => {
          historico += h.evolucao;
          if (index < this.currentPaciente.Historicos.length - 1)
            historico += "\n\n---\n\n";
        });
      }

      return historico;
    }
  },

  watch: {
    ["currentPaciente.DadosPessoais.estado_id"]: function(val) {
      CidadesDataService.findByEstadoId(val).then(resp => {
        this.cidades = resp.data;
        if (this.endereco.localidade) {
          let cidade = this.cidades
            .filter(cidade => cidade.nome === this.endereco.localidade)
            .shift();
          if (cidade) this.currentPaciente.DadosPessoais.cidade_id = cidade.id;
        }
      });
    },

    ["endereco.logradouro"]: function(val) {
      this.endereco.logradouro = val;
      this.currentPaciente.DadosPessoais.endereco = JSON.stringify(
        this.endereco
      );
    },

    ["endereco.bairro"]: function(val) {
      this.endereco.bairro = val;
      this.currentPaciente.DadosPessoais.endereco = JSON.stringify(
        this.endereco
      );
    },

    ["endereco.complemento"]: function(val) {
      this.endereco.complemento = val;
      this.currentPaciente.DadosPessoais.endereco = JSON.stringify(
        this.endereco
      );
    }
  },

  methods: {
    showModal(nome) {
      if ("modal-novo-historico" === nome) {
        this.evolucaoText = "";
      } else {
        if (
          !this.currentPaciente.Historicos ||
          this.currentPaciente.Historicos.length === 0
        ) {
          Messages.showInfoToast(
            this,
            "Não existem registros de acompanhamento cadastrados para este paciente."
          );
          return;
        }
        if ("modal-editar-ultimo-historico" === nome) {
          this.evolucaoText = this.currentPaciente.Historicos[
            this.currentPaciente.Historicos.length - 1
          ].evolucao;
        }
      }
      this.$bvModal.show(nome);
    },

    async adicionarHistorico(evolucao) {
      const fmtOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      };
      const today = new Date();
      let novoHistorico = {
        data: today,
        evolucao: today.toLocaleString("pt-BR", fmtOptions) + ": " + evolucao,
        paciente_id: this.currentPaciente.id
      };

      try {
        let res = await HistoricosDataService.create(novoHistorico);
        this.currentPaciente.Historicos.push(res.data);
        this.$bvModal.hide("modal-novo-historico");
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
      }
    },

    async salvarUltimoHistorico() {
      if (
        this.currentPaciente.Historicos &&
        this.currentPaciente.Historicos.length > 0
      ) {
        const today = new Date();
        let ultimoHistorico = this.currentPaciente.Historicos.pop();
        ultimoHistorico.data = today;
        ultimoHistorico.evolucao = this.evolucaoText;

        try {
          await HistoricosDataService.update(ultimoHistorico);
          this.currentPaciente.Historicos.push(ultimoHistorico);
          this.$bvModal.hide("modal-editar-ultimo-historico");
        } catch (e) {
          console.log(e);
          Messages.showErrorToast(this, e);
        }
      }
    },

    async removerUltimoHistorico() {
      if (
        this.currentPaciente.Historicos &&
        this.currentPaciente.Historicos.length > 0
      ) {
        try {
          await HistoricosDataService.delete(
            this.currentPaciente.Historicos[
              this.currentPaciente.Historicos.length - 1
            ].id
          );
          this.currentPaciente.Historicos.pop();
          this.$bvModal.hide("modal-remover-ultimo-historico");
        } catch (e) {
          console.length(e);
          Messages.showErrorToast(this, e);
        }
      }
    },

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
          this.endereco.complemento = obj.complemento;
          this.endereco.bairro = obj.bairro;
          this.endereco.localidade = obj.localidade;
          if (obj.uf) {
            EstadosDataService.findByUf(obj.uf).then(resp => {
              this.currentPaciente.DadosPessoais.estado_id = resp.data[0].id;
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
        this.updatePaciente();
      });
    },

    getPaciente(id) {
      PacientesDataService.get(id)
        .then(response => {
          this.currentPaciente = response.data;
          this.endereco = {
            logradouro: null,
            complemento: null,
            bairro: null,
            localidade: null,
            uf: null
          };
          if (this.currentPaciente.DadosPessoais.endereco) {
            try {
              let parsedEndereco = JSON.parse(
                this.currentPaciente.DadosPessoais.endereco
              );
              this.endereco = parsedEndereco;
            } catch (e) {
              console.log(e);
              this.endereco.logradouro = this.currentPaciente.DadosPessoais.endereco;
            }
          }
        })
        .catch(e => {
          console.log(e);
          Messages.showErrorToast(this, e);
        });
    },

    updatePaciente() {
      PacientesDataService.update(this.currentPaciente)
        .then(response => {
          console.log(response.data);
          console.log(response.status);
          console.log(response.headers);
          Messages.showSuccessToast(this, "Paciente atualizado com sucesso!");
        })
        .catch(e => {
          console.log(e);
          Messages.showErrorToast(this, e);
        });
    },

    retrieveProfissoes() {
      ProfissoesDataService.getAll()
        .then(res => {
          this.profissoes = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    retrieveEstadosCivis() {
      EstadosCivisDataService.getAll()
        .then(res => {
          this.estadosCivis = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    retrieveEstados() {
      EstadosDataService.getAll()
        .then(res => {
          this.estados = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    retrieveCidadesByEstadoId(estado_id) {
      CidadesDataService.findByEstadoId(estado_id)
        .then(res => {
          this.cidades = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },

    back() {
      this.$router.push({ name: "pacientes" });
    }

    // showModal(ref) {
    //   this.$refs[ref].show();
    // },

    // hideModal(ref) {
    //   this.$refs[ref].hide();
    // }
  },

  mounted() {
    (async () => {
      await this.retrieveProfissoes();
      await this.retrieveEstadosCivis();
      await this.retrieveEstados();
      await this.getPaciente(this.$route.params.id);
    })();
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
<style scoped>
.collapsed > .when-opened,
:not(.collapsed) > .when-closed {
  display: none;
}
</style>