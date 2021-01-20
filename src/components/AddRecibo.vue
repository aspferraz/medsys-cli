<template>
  <b-container>
    <b-row>
      <h3>Novo Recibo</h3>
    </b-row>

    <b-row>
      <!-- <b-col>{{recibo}}</b-col> -->
    </b-row>

    <b-form @submit.stop.prevent="validateBeforeSubmit">
      <b-tabs content-class="mt-3" class="mt-3">
        <b-tab title="Paciente" active>
          <b-row>
            <b-col>
              <label for="typeahead-nome-paciente">Nome:</label>
              <ValidationProvider
                name="nome-paciente"
                :rules="{ required: true }"
                v-slot="{ classes }"
              >
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
                v-model="recibo.Paciente.DadosPessoais.sobrenome"
                disabled
              ></b-form-input>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col>
              <div class="form-group">
                <label for="input-dt-nascimento-paciente">Data Nascimento:</label>
                <input
                  id="input-dt-nascimento-paciente"
                  ref="input-dt-nascimento-paciente"
                  class="form-control"
                  type="text"
                  v-model="recibo.Paciente.DadosPessoais.dt_nascimento"
                  disabled
                />
              </div>
            </b-col>
            <b-col>
              <label for="input-cpf-paciente">CPF:</label>
              <b-form-input
                id="input-cpf-paciente"
                v-mask="['###.###.###-##']"
                v-model="recibo.Paciente.DadosPessoais.cpf"
                disabled
              ></b-form-input>
            </b-col>
            <b-col>
              <label for="input-rg-paciente">RG:</label>
              <b-form-input
                id="input-rg-paciente"
                v-mask="['##.###.###-##','##.###.###-#']"
                v-model="recibo.Paciente.DadosPessoais.rg"
                disabled
              ></b-form-input>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col cols="3">
              <label for="input-cep-paciente">CEP:</label>
              <b-form-input
                id="input-cep-paciente"
                v-model="recibo.Paciente.DadosPessoais.cep"
                v-mask="'#####-###'"
                disabled
              ></b-form-input>
            </b-col>
            <b-col>
              <label for="input-logradouro-paciente">Logradouro:</label>
              <b-form-input
                id="input-logradouro-paciente"
                v-model="recibo.Paciente.DadosPessoais.enderecoObj.logradouro"
                disabled
              ></b-form-input>
            </b-col>
            <b-col>
              <label for="input-bairro-paciente">Bairro:</label>
              <b-form-input
                id="input-bairro-paciente"
                v-model="recibo.Paciente.DadosPessoais.enderecoObj.bairro"
                disabled
              ></b-form-input>
            </b-col>
          </b-row>

          <b-row class="my-3">
            <b-col cols="4">
              <label for="input-complemento-paciente">Complemento:</label>
              <b-form-input
                id="input-complemento-paciente"
                v-model="recibo.Paciente.DadosPessoais.enderecoObj.complemento"
                disabled
              ></b-form-input>
            </b-col>
            <b-col cols="3">
              <label for="input-estado-paciente">Estado:</label>
              <b-form-input
                id="input-estado-paciente"
                v-model="recibo.Paciente.DadosPessoais.enderecoObj.uf"
                disabled
              ></b-form-input>
            </b-col>
            <b-col cols="5">
              <label for="input-cidade-paciente">Cidade:</label>
              <b-form-input
                id="input-cidade-paciente"
                v-model="recibo.Paciente.DadosPessoais.enderecoObj.localidade"
                disabled
              ></b-form-input>
            </b-col>
          </b-row>
        </b-tab>

        <b-tab title="Responsável Pagamento">
          <b-row class="mt-3">
            <b-col>
              <b-form-group label="Tipo:">
                <b-form-radio-group
                  id="radio-group-1"
                  v-model="recibo.tipo_pessoa"
                  :options="tipoPessoaResponsavelOptions"
                  name="radio-options"
                ></b-form-radio-group>
              </b-form-group>
            </b-col>
          </b-row>

          <div v-show="recibo.tipo_pessoa === 'J'">
            <b-row>
              <b-col>
                <label for="typeahead-razao-social-responsavel">Razão Social:</label>

                <ValidationProvider
                  id="validator-provider-razao-social-responsavel"
                  name="razao-social-responsavel"
                  key="razao-social-responsavel"
                  :rules="{ required: true }"
                  v-slot="{ classes }"
                >
                  <vue-bootstrap-typeahead
                    id="typeahead-razao-social-responsavel"
                    name="razao-social-responsavel"
                    key="razao-social-responsavel"
                    ref="razao-social-responsavel"
                    :data="responsaveisPessoaJuridica"
                    v-model="razaoSocialResponsavelSearch"
                    v-validate="{ required: true }"
                    :state="validateState('razao-social-responsavel')"
                    :inputClass="getInputClass(classes, 'razao-social-responsavel')"
                    :serializer="s => s.razao_social"
                    placeholder="Entre com a razão social do responsável..."
                    @hit="selectedResponsavel = $event"
                  />
                </ValidationProvider>
              </b-col>
              <b-col>
                <label for="input-nome-fantasia-responsavel">Nome Fantasia:</label>
                <b-form-input
                  id="input-nome-fantasia-responsavel"
                  v-model="recibo.ResponsavelPagamento.nome_fantasia"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col cols="6">
                <label for="input-cnpj-responsavel">CNPJ:</label>
                <b-form-input
                  id="input-cnpj-responsavel"
                  v-model="recibo.ResponsavelPagamento.cnpj"
                  v-mask="['##.###.###/####-##']"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col cols="3">
                <label for="input-telefone-responsavel">Telefone(fixo):</label>
                <b-form-input
                  id="input-telefone-responsavel"
                  v-model="recibo.ResponsavelPagamento.telefone"
                  v-mask="['+55 (##) ####-####']"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col cols="3">
                <label for="input-celular-responsavel">Celular:</label>
                <b-form-input
                  id="input-celular-responsavel"
                  v-model="recibo.ResponsavelPagamento.celular"
                  v-mask="['+55 (##) #####-####']"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col cols="3">
                <label for="input-cep-responsavel">CEP:</label>
                <b-form-input
                  id="input-cep-responsavel"
                  v-model="recibo.ResponsavelPagamento.cep"
                  v-mask="'#####-###'"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col>
                <label for="input-logradouro-responsavel">Logradouro:</label>
                <b-form-input
                  id="input-logradouro-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.logradouro"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col>
                <label for="input-bairro-responsavel">Bairro:</label>
                <b-form-input
                  id="input-bairro-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.bairro"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="my-3">
              <b-col cols="4">
                <label for="input-complemento-responsavel">Complemento:</label>
                <b-form-input
                  id="input-complemento-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.complemento"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col cols="3">
                <label for="input-estado-responsavel">Estado:</label>
                <b-form-input
                  id="input-estado-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.uf"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col cols="5">
                <label for="input-cidade-responsavel">Cidade:</label>
                <b-form-input
                  id="input-cidade-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.localidade"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>
          </div>

          <div v-show="recibo.tipo_pessoa === 'F'">
            <b-row>
              <b-col>
                <label for="typeahead-nome-responsavel">Nome:</label>

                <ValidationProvider
                  id="validator-provider-nome-responsavel"
                  name="nome-responsavel"
                  key="nome-responsavel"
                  :rules="{ required: true }"
                  v-slot="{ classes }"
                >
                  <vue-bootstrap-typeahead
                    id="typeahead-nome-responsavel"
                    name="nome-responsavel"
                    key="nome-responsavel"
                    ref="nome-responsavel"
                    :data="responsaveisPessoaFisica"
                    v-model="nomeResponsavelSearch"
                    v-validate="{ required: true }"
                    :state="validateState('nome-responsavel')"
                    :inputClass="getInputClass(classes, 'nome-responsavel')"
                    :serializer="s => s.nome"
                    placeholder="Entre com o nome do responsável..."
                    @hit="selectedResponsavel = $event"
                  >
                    <!-- Begin custom suggestion slot -->
                    <template slot="suggestion" slot-scope="{ data, htmlText }">
                      <div class="d-flex align-items-center">
                        <!-- Note: the v-html binding is used, as htmlText contains
                        the suggestion text highlighted with <strong> tags-->
                        <span class="ml-4" v-html="htmlText"></span>
                        <span class="ml-1">{{data.sobrenome}}</span>
                      </div>
                    </template>
                  </vue-bootstrap-typeahead>
                </ValidationProvider>
              </b-col>
              <b-col>
                <label for="input-sobrenome-responsavel">Sobrenome:</label>
                <b-form-input
                  id="input-sobrenome-responsavel"
                  v-model="recibo.ResponsavelPagamento.sobrenome"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col>
                <div class="form-group">
                  <label for="input-dt-nascimento-responsavel">Data Nascimento:</label>
                  <input
                    id="input-dt-nascimento-responsavel"
                    ref="input-dt-nascimento-responsavel"
                    class="form-control"
                    type="text"
                    v-model="recibo.ResponsavelPagamento.dt_nascimento"
                    disabled
                  />
                </div>
              </b-col>
              <b-col>
                <label for="input-cpf-responsavel">CPF:</label>
                <b-form-input
                  id="input-cpf-responsavel"
                  v-mask="['###.###.###-##']"
                  v-model="recibo.ResponsavelPagamento.cpf"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col>
                <label for="input-rg-responsavel">RG:</label>
                <b-form-input
                  id="input-rg-responsavel"
                  v-mask="['##.###.###-##','##.###.###-#']"
                  v-model="recibo.ResponsavelPagamento.rg"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col cols="3">
                <label for="input-cep-responsavel">CEP:</label>
                <b-form-input
                  id="input-cep-responsavel"
                  v-model="recibo.ResponsavelPagamento.cep"
                  v-mask="'#####-###'"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col>
                <label for="input-logradouro-responsavel">Logradouro:</label>
                <b-form-input
                  id="input-logradouro-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.logradouro"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col>
                <label for="input-bairro-responsavel">Bairro:</label>
                <b-form-input
                  id="input-bairro-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.bairro"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>

            <b-row class="my-3">
              <b-col cols="4">
                <label for="input-complemento-responsavel">Complemento:</label>
                <b-form-input
                  id="input-complemento-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.complemento"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col cols="3">
                <label for="input-estado-responsavel">Estado:</label>
                <b-form-input
                  id="input-estado-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.uf"
                  disabled
                ></b-form-input>
              </b-col>
              <b-col cols="5">
                <label for="input-cidade-responsavel">Cidade:</label>
                <b-form-input
                  id="input-cidade-responsavel"
                  v-model="recibo.ResponsavelPagamento.enderecoObj.localidade"
                  disabled
                ></b-form-input>
              </b-col>
            </b-row>
          </div>
        </b-tab>

        <b-tab title="Serviço">
          <b-row>
            <b-col cols="8">
              <label for="select-servico">Descrição:</label>
              <b-form-select
                id="select-servico"
                name="servico"
                v-model="recibo.servico_id"
                v-validate="{ required: true }"
                :state="validateState('servico')"
                :options="servicos"
                value-field="id"
                text-field="descricao"
              >
                <!-- This slot appears above the options from 'options' prop -->
                <template v-slot:first>
                  <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
            <b-col cols="4">
              <label for="input-valor-servico">Valor:</label>
              <money
                class="form-control"
                id="input-valor-servico"
                name="valor-servico"
                v-bind="moneyConfig"
                v-model="recibo.Servico.valor"
                disabled
              />
            </b-col>
          </b-row>

          <b-row class="my-3">
            <b-col cols="4">
              <div class="form-group">
                <label for="input-dt-recibo">Data Recibo:</label>
                <input
                  id="input-dt-recibo"
                  class="form-control"
                  type="date"
                  v-model="recibo.data"
                  disabled
                />
              </div>
            </b-col>
            <b-col cols="4">
              <div class="form-group">
                <label for="input-dt-consulta">Data Consulta:</label>
                <input
                  id="input-dt-consulta"
                  class="form-control"
                  type="date"
                  v-model="recibo.data_consulta"
                />
              </div>
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
      <b-row align-h="end" class="my-5">
        <button type="submit" class="btn btn-success mr-2">
          <b-icon icon="check-circle"></b-icon>&nbsp;Salvar
        </button>
        <a class="btn btn-light mr-2" :href="'/recibos'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
    </b-form>
    <b-modal ref="modal-print-or-add-new" centered title="Info:">
      <p class="my-4">O Recibo foi gravado com sucesso! O que deseja fazer agora?</p>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button variant="primary" size="md" class="mr-2" @click="downloadRecibo">Baixar PDF</b-button>
            <b-button variant="secondary" size="md" class="mr-2" @click="newRecibo">Adicionar Novo</b-button>
            <b-button variant="secondary" size="md" class="mr-2" @click="back">Voltar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import RecibosDataService from "../services/RecibosDataService.js";
import PacientesDataService from "../services/PacientesDataService.js";
import DadosPessoaisDataService from "../services/DadosPessoaisDataService.js";
import CidadesDataService from "../services/CidadesDataService.js";
import EstadosDataService from "../services/EstadosDataService.js";
import ServicosDataService from "../services/ServicosDataService.js";
import { ValidationProvider } from "vee-validate";
import { Money } from "v-money";
import _ from "underscore";
import VueBootstrapTypeahead from "vue-bootstrap-typeahead";
// Local Directive
import { mask } from "vue-the-mask";
import Messages from "../util/Messages.js";

export default {
  components: {
    VueBootstrapTypeahead,
    ValidationProvider,
    Money
  },
  directives: { mask },
  name: "add-recibo",
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
      tipoPessoaResponsavelOptions: [
        { text: "Pessoa Física", value: "F" },
        { text: "Pessoa Jurídica", value: "J" }
      ],
      servicos: [],
      pacientes: [],
      responsaveisPessoaFisica: [],
      responsaveisPessoaJuridica: [],
      pacienteSearch: "",
      nomeResponsavelSearch: "",
      razaoSocialResponsavelSearch: "",
      selectedPaciente: null,
      selectedResponsavel: null,
      recibo: {
        id: null,
        servico_id: null,
        paciente_id: null,
        dados_pessoais_responsavel_id: null,
        data: new Date().toISOString().split("T")[0],
        data_consulta: null,
        tipo_pessoa: "F",
        Paciente: {
          id: null,
          DadosPessoais: {
            id: null,
            nome: null,
            sobrenome: null,
            cpf: null,
            cidade_id: null,
            estado_id: null,
            enderecoObj: {
              logradouro: null,
              complemento: null,
              bairro: null,
              localidade: null,
              uf: null
            }
          }
        },
        ResponsavelPagamento: {
          id: null,
          tipo_pessoa: "F",
          nome: null,
          sobrenome: null,
          dt_nascimento: null,
          razao_social: null,
          nome_fantasia: null,
          telefone: null,
          celular: null,
          rg: null,
          cpf: null,
          cnpj: null,
          cep: null,
          endereco: null,
          cidade_id: null,
          estado_id: null,
          enderecoObj: {
            logradouro: null,
            complemento: null,
            bairro: null,
            localidade: null,
            uf: null
          }
        },
        Servico: {
          id: null,
          descricao: null,
          valor: 0
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
        this.recibo.Paciente = {
          id: null,
          DadosPessoais: {
            id: null,
            nome: null,
            sobrenome: null,
            cpf: null,
            endereco: null,
            cidade_id: null,
            estado_id: null,
            enderecoObj: {
              logradouro: null,
              complemento: null,
              bairro: null,
              localidade: null,
              uf: null
            }
          }
        };
        this.recibo.paciente_id = null;
      } else {
        val.DadosPessoais.enderecoObj = {
          logradouro: null,
          complemento: null,
          bairro: null,
          localidade: null,
          uf: null
        };

        if (val.DadosPessoais.endereco) {
          try {
            let parsedEndereco = JSON.parse(val.DadosPessoais.endereco);
            val.DadosPessoais.enderecoObj = parsedEndereco;
          } catch (e) {
            console.log(e);
            val.DadosPessoais.enderecoObj.logradouro =
              val.DadosPessoais.endereco;
          }
        }

        if (val.DadosPessoais.estado_id) {
          try {
            let res = await EstadosDataService.get(val.DadosPessoais.estado_id);
            val.DadosPessoais.enderecoObj.uf = res.data.uf;
          } catch (error) {
            console.log(error);
          }
        }

        if (val.DadosPessoais.cidade_id) {
          try {
            let res = await CidadesDataService.get(val.DadosPessoais.cidade_id);
            val.DadosPessoais.enderecoObj.localidade = res.data.nome;
          } catch (error) {
            console.log(error);
          }
        }

        this.recibo.paciente_id = val.id;
        this.recibo.Paciente = val;
      }
    },

    nomeResponsavelSearch: _.debounce(async function(val) {
      if (this.nomeResponsavelSearch.trim().length === 0) {
        this.$refs["nome-responsavel"].inputValue = "";
        this.selectedResponsavel = null;
        return;
      }
      try {
        this.responsaveisPessoaFisica = await this.getItemsByNomeOuRazaoSocialResponsavel(
          val
        );
      } catch (error) {
        this.responsaveisPessoaFisica = [];
      }
    }, 500),

    razaoSocialResponsavelSearch: _.debounce(async function(val) {
      if (this.razaoSocialResponsavelSearch.trim().length === 0) {
        this.$refs["razao-social-responsavel"].inputValue = "";
        this.selectedResponsavel = null;
        return;
      }
      try {
        this.responsaveisPessoaJuridica = await this.getItemsByNomeOuRazaoSocialResponsavel(
          val
        );
      } catch (error) {
        this.responsaveisPessoaJuridica = [];
      }
    }, 500),

    selectedResponsavel: {
      handler: async function(newVal, oldVal) {
        let val;
        if (newVal && newVal !== oldVal) val = newVal;
        else if (!newVal) {
          this.recibo.ResponsavelPagamento = {
            id: null,
            tipo_pessoa: this.recibo.ResponsavelPagamento.tipo_pessoa,
            nome: null,
            sobrenome: null,
            dt_nascimento: null,
            razao_social: null,
            nome_fantasia: null,
            telefone: null,
            celular: null,
            rg: null,
            cpf: null,
            cnpj: null,
            cep: null,
            endereco: null,
            cidade_id: null,
            estado_id: null,

            enderecoObj: {
              logradouro: null,
              complemento: null,
              bairro: null,
              localidade: null,
              uf: null
            }
          };
          this.recibo.dados_pessoais_responsavel_id = null;
        }

        if (val) {
          this.recibo.tipo_pessoa = val.tipo_pessoa;
          val.enderecoObj = {
            logradouro: null,
            complemento: null,
            bairro: null,
            localidade: null,
            uf: null
          };

          if (val.endereco) {
            try {
              let parsedEndereco = JSON.parse(val.endereco);
              val.enderecoObj = parsedEndereco;
            } catch (e) {
              console.log(e);
              val.enderecoObj.logradouro = val.endereco;
            }
          }

          if (val.estado_id) {
            try {
              let res = await EstadosDataService.get(val.estado_id);
              val.enderecoObj.uf = res.data.uf;
            } catch (error) {
              console.log(error);
            }
          }

          if (val.cidade_id) {
            try {
              let res = await CidadesDataService.get(val.cidade_id);
              val.enderecoObj.localidade = res.data.nome;
            } catch (error) {
              console.log(error);
            }
          }

          this.recibo.dados_pessoais_responsavel_id = val.id;
          this.recibo.ResponsavelPagamento = val;
        }
      }
    },

    ["recibo.Paciente.DadosPessoais.dt_nascimento"]: function(val) {
      if (val && val.trim().length > 0) {
        this.$refs["input-dt-nascimento-paciente"].type = "date";
      } else {
        this.$refs["input-dt-nascimento-paciente"].type = "text";
      }
    },

    ["recibo.ResponsavelPagamento.dt_nascimento"]: function(val) {
      if (val && val.trim().length > 0) {
        this.$refs["input-dt-nascimento-responsavel"].type = "date";
      } else {
        this.$refs["input-dt-nascimento-responsavel"].type = "text";
      }
    },

    ["recibo.servico_id"]: function(val) {
      if (val) {
        this.recibo.Servico = this.servicos.filter(s => s.id === val)[0];
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
        } else {
          selectedObject = this.selectedResponsavel;
        }

        return classes["is-valid"] &&
          selectedObject &&
          (ref === "nome-paciente" ||
            (ref === "nome-responsavel" &&
              selectedObject.tipo_pessoa === "F") ||
            (ref === "razao-social-responsavel" &&
              selectedObject.tipo_pessoa === "J"))
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

    async getItemsByNomeOuRazaoSocialResponsavel(text) {
      console.log("search criteria: " + text);
      if (text && text.trim().length > 0) {
        const tipoPessoa = this.recibo.tipo_pessoa;
        let query, sortBy;
        try {
          if (tipoPessoa === "F") {
            query = `nome=${text}`;
            sortBy = "nome";
            const data = await this.searchDadosPessoaisByQueryStr(
              query,
              "and",
              1,
              25,
              sortBy,
              false
            );
            console.log(data);
            return data;
          } else if (tipoPessoa === "J") {
            query = `razao_social=${text}`;
            sortBy = "razao_social";
            const data = await this.searchDadosPessoaisByQueryStr(
              query,
              "and",
              1,
              25,
              sortBy,
              false
            );
            console.log(data);
            return data;
          }
        } catch (e) {
          console.log(e);
          Messages.showErrorToast(this, e);
          return [];
        }
      }
      return [];
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
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false;
        return pacientes;
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false;
        // Returning an empty array, allows table to correctly handle
        // internal busy state in case of error
        return [];
      }
    },

    async searchDadosPessoaisByQueryStr(
      query,
      op,
      page,
      size,
      sortBy,
      sortDesc
    ) {
      try {
        let res = await DadosPessoaisDataService.findByQueryString(
          query,
          op,
          page,
          size,
          sortBy,
          sortDesc
        );
        const dadosPessoais = res.data;
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false;
        return dadosPessoais;
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false;
        // Returning an empty array, allows table to correctly handle
        // internal busy state in case of error
        return [];
      }
    },

    validateBeforeSubmit() {
      this.$validator.validateAll().then(result => {
        if (!result) {
          let fields = this.$validator.errors.items
            .map(item => item.field)
            .sort();
          let showErrors;
          const toFilter = ["razao-social-responsavel", "nome-responsavel"];

          let containsAll = toFilter.every(f => fields.indexOf(f) > -1);
          let containsOne =
            !containsAll && fields.some(f => toFilter.indexOf(f) > -1);
          let containsNone = !containsAll && !containsOne;

          showErrors = showErrors || containsNone;
          if (!showErrors) {
            var index = fields
              .reverse()
              .findIndex(f => toFilter.indexOf(f) > -1);
            if (containsOne) {
              fields.splice(index, 1);
              if (fields.length) showErrors = true;
            } else {
              if (containsAll) {
                fields.splice(index, 1);
                showErrors = true;
              }
            }
          }
          if (showErrors) {
            Messages.showErrorToast(
              this,
              "Alguns campos obrigatórios não foram preenchidos corretamente: " +
                fields.join(", ")
            );
            return;
          } else {
            this.saveRecibo();
          }
        } else {
          this.saveRecibo();
        }
      });
    },

    async saveRecibo() {
      RecibosDataService.create(this.recibo)
        .then(response => {
          this.recibo.id = response.data.id;
          this.submitted = true;
          this.showModal("modal-print-or-add-new");
        })
        .catch(e => {
          Messages.showErrorToast(this, e);
        });
    },

    async downloadRecibo() {
      let res = await RecibosDataService.getPdf(this.recibo.id);
      try {
        console.log(res);
        this.downloadFile(res, "recibo");
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

    newRecibo() {
      this.hideModal("modal-print-or-add-new");
      this.submitted = false;
      this.recibo = {
        id: null,
        servico_id: null,
        paciente_id: null,
        dados_pessoais_responsavel_id: null,
        data: new Date().toISOString().split("T")[0],
        data_consulta: null,
        tipo_pessoa: "F",
        Paciente: { DadosPessoais: { enderecoObj: {} } },
        ResponsavelPagamento: { enderecoObj: {} },
        Servico: {}
      };
      this.pacientes = [];
      this.responsaveisPessoaFisica = [];
      this.responsaveisPessoaJuridica = [];
      this.pacienteSearch = "";
      this.nomeResponsavelSearch = "";
      this.razaoSocialResponsavelSearch = "";
      this.recibo.Servico = {
        id: null,
        descricao: null,
        valor: 0
      };

      this.$nextTick(() => {
        this.$validator.reset();
      });
    },

    retrieveServicos() {
      ServicosDataService.getAll()
        .then(res => {
          console.log(res.data);
          this.servicos = res.data.servicos;
        })
        .catch(e => {
          console.log(e);
        });
    },

    back() {
      this.$router.push({ name: "recibos" });
    },

    showModal(ref) {
      this.$refs[ref].show();
    },

    hideModal(ref) {
      this.$refs[ref].hide();
    }
  },
  mounted() {
    this.retrieveServicos();
  }
};
</script>