'use strict';

class ValidationError extends Error {

    /**
     * @type {{string:FieldError}}
     */
    #fieldsErrors = {};

    /**
     * 
     * @param {string} message 
     * @param {FieldError[]} field 
     */
    constructor(fieldErrors = {}) {
        super("Erro de válidação dos campos!");
        this.name = "ValidationError";
        this.#fieldsErrors = fieldErrors;
    }

    /**
     * 
     * @param {FieldError} fieldError 
     */
    addFieldError(fieldError) {
        this.#fieldsErrors[fieldError.fieldName] = fieldError;
    }

    /**
     * @returns {{string: FieldError}}
     */
    get fieldsErrors() {
        return this.#fieldsErrors;
    }
}

class FieldError {
    /**
     * @type {string}
     */
    #fieldName;

    /**
     * @type {string[]}
     */
    #erros = [];

    /**
     * 
     * @param {string} fieldName 
     * @param {string[]} errors 
     */
    constructor(fieldName, errors = []) {
        this.#fieldName = fieldName;
        this.#erros = erros;
    }

    /**
     * 
     * @param {string} msg 
     */
    addMsg(msg) {
        this.#erros.push(msg);
    }

    /**
     * @returns {string}
     */
    get fieldName() {
        return this.#fieldName;
    }

    /**
     * @returns {string[]}
     */
    get erros() {
        return this.#erros;
    }
}

export {ValidationError, FieldError};