  <template>
  <b-container>
    <b-row>
      <h3>Recibos</h3>
    </b-row>

    <div class="mb-4">
      <b-row align-h="end">
        <b-col lg="2" class="my-1">
          <b-button-group size="md" class="ml-3">
            <b-link class="btn btn-outline-primary" :href="'/add-recibo'">
              <b-icon icon="file-plus"></b-icon>&nbsp;Criar Novo
            </b-link>
          </b-button-group>
        </b-col>
      </b-row>
    </div>

    <b-row>
      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filtro:"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          label-for="filterInput"
          class="mb-0"
        >
          <b-input-group size="sm">
            <b-form-input
              v-model="criteria"
              type="search"
              id="filterInput"
              placeholder="Digite algo para buscar"
            ></b-form-input>
            <b-input-group-append>
              <b-button @click="criteria = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
        </b-form-group>
      </b-col>

      <b-col lg="6" class="my-1">
        <b-form-group
          label="Filtrar por:"
          label-cols-sm="3"
          label-align-sm="right"
          label-size="sm"
          description="Deixe todos desmarcados para filtrar todos os dados"
          class="mb-0"
        >
          <b-form-checkbox-group v-model="filterOn" class="mt-1">
            <b-form-checkbox value="Paciente.DadosPessoais.nome">Nome do Paciente</b-form-checkbox>
            <b-form-checkbox value="Servico.descricao">Servico</b-form-checkbox>
            <b-form-checkbox value="data">Data</b-form-checkbox>
            <b-form-checkbox value="ResponsavelPagamento.cpf">CPF do Responsável</b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
      </b-col>
    </b-row>

    <b-row>
      <b-col sm="5" md="6" class="my-1">
        <b-form-group
          label="Itens por página:"
          label-cols-sm="6"
          label-cols-md="4"
          label-cols-lg="3"
          label-align-sm="right"
          label-size="sm"
          label-for="perPageSelect"
          class="mb-0"
        >
          <b-form-select
            v-model="perPage"
            id="perPageSelect"
            size="sm"
            :options="pageOptions"
            @input="refreshTable"
          ></b-form-select>
        </b-form-group>
      </b-col>

      <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="fill"
          size="sm"
          aria-controls="recibos-table"
        ></b-pagination>
      </b-col>
    </b-row>
    <div class="my-3">
      <b-table
        id="recibos-table"
        striped
        hover
        :busy.sync="isBusy"
        :fields="campos"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :no-local-sorting="true"
        :items="getItems"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="criteria"
        :filterIncludedFields="filterOn"
        primary-key="id"
      >
        <template v-slot:table-busy>
          <div class="text-center text-secondary my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Carregando...</strong>
          </div>
        </template>
        <template v-slot:cell(id)="data">
          <b>{{ data.value }}</b>
        </template>
        <template
          v-slot:cell(nomeCompleto)="data"
        >{{ data.item.Paciente.DadosPessoais.nome }} {{ data.item.Paciente.DadosPessoais.sobrenome }}</template>
        <template v-slot:cell(actions)="data">
          <div class="btn-group btn-group-sm" role="group" aria-label="Ações">
            <a class="btn btn-primary" v-b-modal="'modal-confirm-download'" @click="setReciboOptions(data.item)" style="color: #ffffff">
              <b-icon icon="download"></b-icon>&nbsp;Baixar PDF
            </a>
            <!-- <a class="btn btn-warning" :href="'/recibos/' + data.item.id">
              <b-icon icon="pencil-square"></b-icon>&nbsp;Editar
            </a>-->
            <a class="btn btn-danger" @click="deleteRecibo(data.item.id)" style="color: #ffffff">
              <b-icon icon="trash"></b-icon>&nbsp;Remover
            </a>
          </div>
        </template>
      </b-table>
    </div>
    <b-modal id="modal-confirm-download" ref="modal-confirm-download" centered title="Confirmação:">
      <p class="my-4">Confirmar dados do serviço?</p>
      <b-form>
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
                v-model="reciboOptions.descricao_servico"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-form-group id="fieldset-2" label="Valor:" label-for="input-valor">
              <money
                class="form-control"
                id="input-valor"
                name="valor"
                v-model="reciboOptions.valor_servico"
                v-bind="moneyConfig"
              />
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <template v-slot:modal-footer>
        <div class="w-100">
          <div class="float-right">
            <b-button
              variant="primary"
              size="md"
              class="mr-2"
              @click="downloadRecibo"
            >Confirmar e Baixar PDF</b-button>
            <b-button variant="secondary" size="md" class="mr-2" @click="$refs['modal-confirm-download'].hide()">Cancelar</b-button>
          </div>
        </div>
      </template>
    </b-modal>
  </b-container>
</template>

<script>
import { Money } from "v-money";
import RecibosDataService from "../services/RecibosDataService.js";
import Messages from "../util/Messages.js";
export default {
  name: "recibos-list",
  components: { Money },
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
      selectedRecibo: null,
      reciboOptions: {
        descricao_servico: null,
        valor_servico: null
      },
      isBusy: false,
      sortBy: "id",
      sortDesc: true,
      perPage: 5,
      pageOptions: [5, 10, 15, 25, 50, 100],
      currentPage: 1,
      totalRows: 0,
      items: [],
      criteria: null,
      filterOn: ["Paciente.DadosPessoais.nome"],
      campos: [
        {
          key: "id",
          sortable: true,
          thStyle: "width: 6%"
        },
        {
          key: "nomeCompleto",
          label: "Paciente",
          // sortable: true,
          thStyle: "width: 26%"
        },
        {
          key: "ResponsavelPagamento.cpf",
          label: "CPF do Responsável",
          formatter: "formatarCpf",
          sortable: true,
          thStyle: "width: 16%"
        },
        {
          key: "Servico.descricao",
          label: "Serviço",
          thStyle: "width: 15%"
        },
        {
          key: "data",
          label: "Data",
          formatter: "formatarData",
          sortable: true,
          thStyle: "width: 12%"
        },
        // A virtual column
        { key: "actions", label: "Ações", thStyle: "width: 25%" }
      ]
    };
  },

  methods: {

    setReciboOptions(item) {
      this.selectedRecibo = item;
      this.reciboOptions.descricao_servico = item.Servico.descricao;
      this.reciboOptions.valor_servico = item.Servico.valor; 
    },

    retirarFormatacao(campoTexto) {
      campoTexto.value = campoTexto.value.replace(/(\.|\/|-)/g, "");
    },

    formatarCpf(value) {
      if (value)
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    },

    formatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
      }
    },

    toDate(dateStr) {
      let parts = dateStr.split("/");
      return new Date(parts[2], parts[1] - 1, parts[0]);
    },

    async retrieveCount() {
      let res = await RecibosDataService.getCount();
      try {
        console.log(res.data);
        const count = res.data.count;
        this.totalRows = count;
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
        this.totalRows = 0;
      }
    },

    async getItems(ctx) {
      // Here we don't set isBusy prop, so busy state will be
      // handled by table itself
      this.isBusy = true;
      console.log(
        "filter: " +
          ctx.filter +
          "   current page: " +
          ctx.currentPage +
          "   per page: " +
          ctx.perPage +
          "   sort by: " +
          ctx.sortBy +
          "   sort desc: " +
          ctx.sortDesc
      );

      if (ctx.filter) {
        let queryStr;
        if (!this.filterOn.length) {
          queryStr = [
            "Paciente.DadosPessoais.nome",
            "Servico.descricao",
            "data",
            "ResponsavelPagamento.cpf"
          ]
            .map(f =>
              f === "data"
                ? f + "=" + this.toDate(ctx.filter)
                : f + "=" + ctx.filter
            )
            .join("&");
        } else {
          queryStr = this.filterOn
            .map(f =>
              f === "data"
                ? f + "=" + this.toDate(ctx.filter)
                : f + "=" + ctx.filter
            )
            .join("&");
        }
        return this.searchByQueryStr(
          queryStr,
          "or",
          ctx.currentPage,
          ctx.perPage,
          ctx.sortBy,
          ctx.sortDesc
        );
      } else {
        try {
          let res = await RecibosDataService.getAllWithPagination(
            ctx.currentPage,
            ctx.perPage,
            ctx.sortBy,
            ctx.sortDesc
          );
          const recibos = res.data.recibos;
          this.items = recibos;
          this.totalRows = res.data.count;
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false;
          return this.items;
        } catch (e) {
          console.log(e);
          Messages.showErrorToast(this, e);
          this.items = [];
          // Here we could override the busy state, setting isBusy to false
          this.isBusy = false;
          // Returning an empty array, allows table to correctly handle
          // internal busy state in case of error
          return this.items;
        }
      }
    },

    async searchByQueryStr(query, op, page, size, sortBy, sortDesc) {
      try {
        let res = await RecibosDataService.findByQueryString(
          query,
          op,
          page,
          size,
          sortBy,
          sortDesc
        );
        const recibos = res.data.recibos;
        this.items = recibos;
        this.totalRows = res.data.count;
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false;
        return this.items;
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
        this.items = [];
        // Here we could override the busy state, setting isBusy to false
        this.isBusy = false;
        // Returning an empty array, allows table to correctly handle
        // internal busy state in case of error
        return this.items;
      }
    },

    async deleteRecibo(id) {
      try {
        let res = await RecibosDataService.delete(id);
        console.log(res.data);
        for (let key = 0; key < this.items.length; key++) {
          if (this.items[key].id == id) {
            this.items.splice(key, 1);
            break;
          }
        }
        this.totalRows = this.totalRows ? this.totalRows - 1 : 0;
        this.refreshTable();
        // this.$router.go(0);
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
      }
    },

    async downloadRecibo() {
      let res = await RecibosDataService.getPdf(this.selectedRecibo.id, this.reciboOptions);
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

    refreshTable() {
      console.log("refreshing table: 'recibos-table'");
      this.$root.$emit("bv::refresh::table", "recibos-table");
    },

    showModal(ref) {
      this.$refs[ref].show();
    },

    hideModal(ref) {
      this.$refs[ref].hide();
    }
  },

  mounted() {
    this.retrieveCount();
  }
};
</script>