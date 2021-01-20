<template>
  <b-container class="w-50">
    <b-row>
      <h4>Relatórios</h4>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <label for="select-tipo-relatorio">Tipo Relatório:</label>
        <b-form-select
          id="select-tipo-relatorio"
          v-model="tipoRelatorio"
          :options="tiposRelatorioOptions"
        >
          <!-- This slot appears above the options from 'options' prop -->
          <template v-slot:first>
            <b-form-select-option :value="null" disabled>-- Selecione --</b-form-select-option>
          </template>
        </b-form-select>
      </b-col>
    </b-row>
     <b-form @submit.stop.prevent="validateBeforeSubmit" v-show="tipoRelatorio === 1">
       <b-row class="mt-3">
         <b-col>
          <div class="form-group">
            <label for="input-dt-inicial">Data Inicial:</label>
            <input
              id="input-dt-inicial"
              name="dt-inicial"
              key="dt-inicial"
              class="form-control"
              v-validate="{ required: true}"
              :state="validateState('dt-inicial')"
              type="date"
              v-model="recibosPorPeriodoParams.dt_inicial"
            />
          </div>
        </b-col>
       </b-row>
       <b-row class="mt-3">
         <b-col>
          <div class="form-group">
            <label for="input-dt-final">Data Inicial:</label>
            <input
              id="input-dt-final"
              name="dt-final"
              key="dt-final"
              class="form-control"
              v-validate="{ required: true}"
              :state="validateState('dt-final')"
              type="date"
              v-model="recibosPorPeriodoParams.dt_final"
            />
          </div>
        </b-col>
       </b-row>
       <b-row align-h="end" class="my-5">
        <button type="submit" class="btn btn-primary mr-2">
          <b-icon icon="download"></b-icon>&nbsp;Baixar PDF
        </button>
        <a class="btn btn-light mr-2" :href="'/'">
          <b-icon icon="slash-circle"></b-icon>&nbsp;Cancelar
        </a>
      </b-row>
     </b-form>  
  </b-container>
</template>>

<script>
import RecibosDataService from "../services/RecibosDataService.js";
import Messages from "../util/Messages.js";
export default {
name: "relatorios",
  data() {
    return {
      tipoRelatorio: null,
      tiposRelatorioOptions: [
        { text: "Recibos por período", value: 1 },
      ],
      recibosPorPeriodoParams : {
        dt_inicial: null,
        dt_final: null
      }
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
        this.baixarRelatorio();
      });
    },

    baixarRelatorio() {
      if (!this.tipoRelatorio) {
        Messages.showInfoToast(
            this,
            "Por favor, selecione um tipo de relatório. "
          );
      }
      else if (this.tipoRelatorio === 1) {
        this.downloadRecibosPorPeriodo(this.recibosPorPeriodoParams.dt_inicial, this.recibosPorPeriodoParams.dt_final);
      }
    },

    async downloadRecibosPorPeriodo(dt_inicial, dt_final) {
      let res = await RecibosDataService.getPdfPorPeriodo(dt_inicial, dt_final);
      try {
        console.log(res);
        this.downloadFile(res, "recibos");
      } catch (e) {
        console.log(e);
        Messages.showErrorToast(this, e);
      }
    },

    downloadFile(response, fileName) {
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement("a");

      fileLink.href = fileURL;
      fileLink.setAttribute("download", fileName+".pdf");
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
  }

};
</script>