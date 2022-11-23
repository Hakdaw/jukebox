class Log {
    constructor(model) {
        this.log = function (data) {
            console.log('['+model+']'+data);
        }
        this.info = function (data) {
            console.info('['+model+']'+data);
        }
        this.warn = function (data) {
            console.warn('['+model+']'+data);
        }
        this.error = function (data) {
            console.error('['+model+']'+data);
        }
    }
}

module.exports = {
    Log
};