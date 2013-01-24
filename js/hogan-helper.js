var CacheManager = Backbone.Model.extend({
  timestamp: page_load_ticks / 60000 | 0,
  browser: localStorage,
  page: {},
  processing: {},
  initialize: function(opts) {
    // if (opts && opts.timestamp) this.timestamp = opts.timestamp;
  },
  _get: function(key) {
    return this.page[key] || this.browser[key];
  },
  _set: function(key, value) {
    this.page[key] = value;
    this.browser[key] = value;
  },
  get: function(url, callback) {
    var self = this;
    // maybe not exactly async
    var cached = this._get(url);
    if (cached !== undefined) {
      callback(cached);
    }
    else {
      this.on(url, callback);
      if (!(url in this.processing)) {
        this.processing[url] = 1;
        $.get(url, function(data) {
          self._set(url, data);
          self.trigger(url, data);
        });
      }
    }
  },
  getTemplate: function(name, callback) {
    var self = this;
    var key = 'template:' + name;
    var cached = this._get(key);
    if (cached !== undefined) {
      callback(cached);
    }
    else {
      var url = '/templates/' + name + '.mu';
      if (this.timestamp)
        url += '?t=' + this.timestamp;

      this.on(key, callback);
      if (!(url in this.processing)) {
        this.processing[url] = 1;
        $.get(url, function(data) {
          console.log("compiling hogan template");
          var compiled = Hogan.compile(data);
          self._set(key, compiled);
          self.trigger(key, compiled);
        });
      }
    }
  }
});
var cache_manager = new CacheManager({});
