export interface Controller {
    set: (name: String, callback: (...arguments) => {}) => void;
    call: (name: String, ...arguments) => any;
    remove: (name: String) => void;
}

declare const useController: () => Controller;

export default useController;
