/** Logger.js
    @def: Log manager
    @TODO: 
        [ ] store log in file
        [x] color coding
        [ ] add timestamp prefix
        [ ] logs shouldn't be printed or logged, except prod logs
*/
"use strict"
const chalk = require('chalk');

module.exports = class Logger {
    constructor() {
        // TODO: 
        this.dev = {
            log: (...args) => {
                Logger.print(chalk.styles.yellow, ...args);
            },
            debug: this.debug,
            debugnl: this.debugnl,
            info: this.info,
            json: this.json,
            error: this.error,
            br: this.br,
            line: this.line,
        };

        // Fixed messges
        this.msg = {
            initializing: () => {
                let msg = "Initializing...";
                Logger.print(chalk.styles.cyan, msg);
            },
        };
    }

    // TODO: Basic file method, takes care of all file writting
    static fw() {
        // TODO: 
    }

    // Basic print method, takes care of all printing
    static print(color, ...args) {
        console.log(color.open, ...args, color.close);
    }

    log(...args) {
        Logger.print(chalk.styles.white, ...args);
        return this;
    }

    debug(...args) {
        Logger.print(chalk.styles.cyan, ...args);
        return this;
    }

    info(...args) {
        Logger.print(chalk.styles.white, ...args, '\n');
        return this;
    }

    // pretty prints JSON object
    json(json) {
        if (typeof json == 'object')
            json = JSON.stringify(json, null, 2);
        Logger.print(chalk.styles.white, json);
        return this;
    }

    error(...args) {
        Logger.print(chalk.styles.red, ...args);
        return this;
    }

    // Formatting methods
    br(count) {
        let str = '\n';
        if (!!count)
            str = Array.from(new Array(count), () => '\n').join('');
        Logger.print(chalk.styles.cyan, str);
        return this;
    }

    line(count) {
        let str;
        count = count || 21;
        if (!!count)
            str = Array.from(new Array(count), () => '-').join('');
        Logger.print(chalk.styles.cyan, str);
        return this;
    }

}
