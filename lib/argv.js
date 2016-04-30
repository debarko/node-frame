/** Argv.js
    @def: CLI argument managaer
    @TODO: 
        - parsing
        - get()
        - -e dev/developer or --env dev/developer or --environment dev/developer
        - -p or --port
        - 
*/
"use strict"

module.exports = class Argv {
    constructor(dirname) {
        var argv = process.argv;
        // TODO: parse all args an create JSON object
        this.argv = process.argv;
        let env;
        // Predefined list
        this.ENV = env || 'DEV_ENV';
        this.DIR = {
            HOME: dirname
        };
    }

    // TODO: should be a path e.g. key.key.key
    get(key) {
        return this.argv[key] || false;
    }

    // TODO:
    set(key, value) {

    }
}
