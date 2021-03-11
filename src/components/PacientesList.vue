<template>
  <b-container>
    <b-row>
      <h3>Pacientes</h3>
    </b-row>

    <div class="mb-4">
      <b-row align-h="end">
        <b-col lg="2" class="my-1">
          <b-button-group size="md" class="ml-3">
            <b-link class="btn btn-outline-primary" :href="'/add-paciente'">
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
            <b-form-checkbox value="id">Id</b-form-checkbox>
            <b-form-checkbox value="DadosPessoais.nome">Nome</b-form-checkbox>
            <b-form-checkbox value="DadosPessoais.sobrenome">Sobrenome</b-form-checkbox>
            <b-form-checkbox value="DadosPessoais.cpf">Cpf</b-form-checkbox>
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
          aria-controls="pacientes-table"
        ></b-pagination>
      </b-col>
    </b-row>
    <div class="my-3">
      <b-table
        id="pacientes-table"
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
          <a>
            <router-link :to="{name: 'paciente-details', params: {id: data.value}}">{{ data.value }}</router-link>
          </a>
        </template>
        <template v-slot:cell(actions)="data">
          <div class="btn-group btn-group-sm" role="group" aria-label="Ações">
            <a class="btn btn-warning" :href="'/pacientes/' + data.item.id">
              <b-icon icon="pencil-square"></b-icon>&nbsp;Editar
            </a>
            <a class="btn btn-danger" @click="deletePaciente(data.item.id)" style="color: #ffffff">
              <b-icon icon="trash"></b-icon>&nbsp;Remover
            </a>
          </div>
        </template>
      </b-table>
    </div>
  </b-container>
  <!-- </div> -->
</template>

<script>
import PacientesDataService from "../services/PacientesDataService.js";
import Messages from "../util/Messages.js";

export default {
  name: "pacientes-list",
  data() {
    return {
      isBusy: false,
      sortBy: "id",
      sortDesc: true,
      perPage: 5,
      pageOptions: [5, 10, 15, 25, 50, 100],
      currentPage: 1,
      totalRows: 0,
      items: [],
      criteria: null,
      filterOn: ["id"],
      campos: [
        {
          key: "id",
          sortable: true,
          thStyle: "width: 6%"
        },
        {
          key: "DadosPessoais.nome",
          label: "Nome",
          sortable: true,
          thStyle: "width: 22%"
        },
        {
          key: "DadosPessoais.sobrenome",
          label: "Sobrenome",
          sortable: true,
          thStyle: "width: 17%"
        },
        {
          key: "DadosPessoais.cpf",
          label: "CPF",
          formatter: "formatarCpf",
          thStyle: "width: 15%"
        },
        {
          key: "DadosPessoais.dt_nascimento",
          label: "Data Nascimento",
          formatter: "formatarData",
          thStyle: "width: 15%"
        },
        // A virtual column
        { key: "actions", label: "Ações", thStyle: "width: 25%" }
      ]
    };
  },

  methods: {
    retirarFormatacao(campoTexto) {
      campoTexto.value = campoTexto.value.replace(/(\.|\/|-)/g, "");
    },

    formatarCpf(value) {
      if (value)
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    },

    formatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
      }
    },

    async retrieveCount() {
      let res = await PacientesDataService.getCount();
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
            "id",
            "DadosPessoais.nome",
            "DadosPessoais.sobrenome",
            "DadosPessoais.cpf"
          ]
            .map(f => f + "=" + ctx.filter)
            .join("&");
        } else {
          queryStr = this.filterOn.map(f => f + "=" + ctx.filter).join("&");
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
          let res = await PacientesDataService.getAllWithPagination(
            ctx.currentPage,
            ctx.perPage,
            ctx.sortBy,
            ctx.sortDesc
          );
          const pacientes = res.data.pacientes;
          this.items = pacientes;
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
        let res = await PacientesDataService.findByQueryString(
          query,
          op,
          page,
          size,
          sortBy,
          sortDesc
        );
        const pacientes = res.data.pacientes;
        this.items = pacientes;
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

    async deletePaciente(id) {
      try {
        let res = await PacientesDataService.delete(id);
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

    refreshTable() {
      console.log("refreshing table: 'pacientes-table'");
      this.$root.$emit("bv::refresh::table", "pacientes-table");
    }
  },

  mounted() {
    this.retrieveCount();
  }
};
</script>