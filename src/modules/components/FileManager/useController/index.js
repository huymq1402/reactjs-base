import { useRef } from "react";

class Controller {
    #events = {};
    call() {
        const [name, ...args] = arguments;
        let cb = this.#events[name];
        if (typeof cb === "function") {
            return cb(...args);
        }
    }
    set(name, cb) {
        if (typeof cb === "function") {
            this.#events[name] = cb;
        }
    }
    remove(name) {
        delete this.#events[name];
    }
}

const useController = () => {
    const ref = useRef();
    if (ref.current === undefined) {
        ref.current = new Controller();
    }
    return ref.current;
};

export default useController;
