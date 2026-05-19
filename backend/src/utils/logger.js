const logger = {
  _format(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length
      ? ', ' + Object.entries(meta).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(', ')
      : '';
    return `[${timestamp}] [${level}] ${message}${metaStr}`;
  },

  info(message, meta) {
    console.log(this._format('INFO', message, meta));
  },

  warn(message, meta) {
    console.warn(this._format('WARN', message, meta));
  },

  error(message, meta) {
    console.error(this._format('ERROR', message, meta));
  },
};

module.exports = logger;
