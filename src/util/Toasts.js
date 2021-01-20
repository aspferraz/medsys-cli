
//primary|secondary|danger|warning|success|info
const defaultVariant = "info";

const defaultTitle = "Aviso:";

export default class Toasts {
    
    static makeToast(vue, options) {
        if (!options.message) {
            throw new Error("the 'message' parameter must be defined.");
        }
        options.title = options.title || defaultTitle;
        options.variant = options.variant || defaultVariant; 
        options.append = options.append || true;
        vue.$bvToast.toast(options.message, {
            title: options.title,
            variant: options.variant,
            solid: true,
            autoHideDelay: 3000,
            appendToast: options.append
        });
    }
}