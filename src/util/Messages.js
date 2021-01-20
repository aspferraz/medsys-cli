import Toasts from "./Toasts.js";

function typeOf(value) {
  var s = typeof value;
  if (s === 'object') {
    if (value) {
      if (Object.prototype.toString.call(value) == '[object Array]') {
        s = 'array';
      }
    } else {
      s = 'null';
    }
  }
  return s;
}

function checkTypes(argList, typeList) {
  for (var i = 0; i < typeList.length; i++) {
    let types;
    if (typeList[i].indexOf("|") !== -1) {
      types = typeList[i].split('|');
    }
    if (!types ?
      (typeOf(argList[i]) !== typeList[i]) :
      (types.indexOf(typeOf(argList[i])) < 0)) {
      throw 'wrong type: expecting ' + typeList[i] + ", found " + this.typeOf(argList[i]);
    }
  }
}

export default class Messages {

  static showWarningToast(vue, msg) {
    checkTypes(arguments, ["object", "string"]);
    Toasts.makeToast(vue, {
      title: "Atenção:",
      message: msg,
      variant: "warning"
    });
  }

  static showSuccessToast(vue, msg) {
    checkTypes(arguments, ["object", "string"]);
    Toasts.makeToast(vue, {
      title: "Concluído:",
      message: msg,
      variant: "success"
    });
  }

  static showInfoToast(vue, msg) {
    checkTypes(arguments, ["object", "string"]);
    Toasts.makeToast(vue, {
      message: msg,
    });
  }

  static showErrorToast(vue, error) {
    checkTypes(arguments, ["object", "object|string"]);
    let msg;
    if (typeOf(error) === "object") {
      // Error 😨
      msg = error.message;
      if (error.response) {
        /*
         * The request was made and the server responded with a
         * status code that falls out of the range of 2xx
         */
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        msg += `: "${error.response.data.message}"`;
      } else if (error.request) {
        /*
         * The request was made but no response was received, `error.request`
         * is an instance of XMLHttpRequest in the browser and an instance
         * of http.ClientRequest in Node.js
         */
        console.log(error.request);
        msg += `: ${error.request}`;
      } else {
        // Something happened in setting up the request and triggered an Error
        console.log("Error", error.message);
      }
    } 
    else {
      //typeof error === "string"
      msg = error;
    }

    Toasts.makeToast(vue, {
      title: "Erro:",
      message: msg,
      variant: "danger"
    });
  }



}