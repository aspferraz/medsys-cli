<template>
  <!-- <div class="list row"> -->
  <b-container>
    <b-row>
      <h3>Serviços</h3>
    </b-row>

    <div class="mb-4">
      <b-row align-h="end">
        <b-col lg="2" class="my-1">
          <b-button-group size="md" class="ml-3">
            <b-link class="btn btn-outline-primary" :href="'/add-servico'">
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
              placeholder="Buscar por descrição"
            ></b-form-input>
            <b-input-group-append>
              <b-button @click="criteria = ''">Limpar</b-button>
            </b-input-group-append>
          </b-input-group>
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
          aria-controls="servicos-table"
        ></b-pagination>
      </b-col>
    </b-row>
    <div class="my-3">
      <b-table
        id="servicos-table"
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
            <router-link :to="{name: 'servico-details', params: {id: data.value}}">{{ data.value }}</router-link>
          </a>
        </template>
        <template v-slot:cell(actions)="data">
          <div class="btn-group btn-group-sm" role="group" aria-label="Ações">
            <a class="btn btn-warning" :href="'/servicos/' + data.item.id">
              <b-icon icon="pencil-square"></b-icon>&nbsp;Editar
            </a>
            <a class="btn btn-danger" @click="deleteServico(data.item.id)" style="color: #ffffff">
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
import ServicosDataService from "../services/ServicosDataService.js";
import Messages from "../util/Messages.js";

export default {
  name: "servicos-list",
  data() {
    return {
      isBusy: false,
      sortBy: "id",
      sortDesc: false,
      perPage: 5,
      pageOptions: [5, 10, 15, 25, 50, 100],
      currentPage: 1,
      totalRows: 0,
      items: [],
      criteria: null,
      filterOn: ["descricao"],
      campos: [
        {
          key: "id",
          sortable: true,
          thStyle: "width: 6%"
        },
        {
          key: "descricao",
          label: "Descrição",
          sortable: true,
          thStyle: "width: 44%"
        },
        {
          key: "valor",
          formatter: "formatarValor",
          thStyle: "width: 25%"
        },
        // A virtual column
        { key: "actions", label: "Ações", thStyle: "width: 25%" }
      ]
    };
  },

  methods: {
    formatarValor(value) {
      if (value)
        return (value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    },

    async retrieveCount() {
      let res = await ServicosDataService.getCount();
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
        return this.searchByDescricao(
          ctx.filter,
          ctx.currentPage,
          ctx.perPage,
          ctx.sortBy,
          ctx.sortDesc
        );
      } else {
        try {
          let res = await ServicosDataService.getAllWithPagination(
            ctx.currentPage,
            ctx.perPage,
            ctx.sortBy,
            ctx.sortDesc
          );
          console.log(res.data);
          const servicos = res.data.servicos;
          this.items = servicos;
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

    async searchByDescricao(desc, page, size, sortBy, sortDesc) {
      try {
        let res = await ServicosDataService.findByDescricao(
          desc,
          page,
          size,
          sortBy,
          sortDesc
        );
        console.log(res.data);
        const servicos = res.data.servicos;
        this.items = servicos;
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

    async deleteServico(id) {
      try {
        let res = await ServicosDataService.delete(id);
        console.log(res.data);
        for (var key = 0; key < this.items.length; key++) {
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
      console.log("refreshing table: 'servicos-table'");
      this.$root.$emit("bv::refresh::table", "servicos-table");
    }
  },

  mounted() {
    this.retrieveCount();
  }
};
</script>

<!--
<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>
-->