(function () {
  'use strict';

  var store = {
    tasks: [],
    filter: 'all',
    load: function () {
      var raw = null;
      try {
        raw = localStorage.getItem('tombstone-tasks');
        if (raw === null) {
          this.tasks = [];
          return;
        }
        var parsed = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null || !Array.isArray(parsed.tasks)) {
          this.tasks = [];
          return;
        }
        this.tasks = parsed.tasks;
      } catch (e) {
        this.tasks = [];
      }
    },
    save: function () {
      localStorage.setItem('tombstone-tasks', JSON.stringify({ tasks: this.tasks }));
    },
    generateId: function () {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }
  };

  store.load();
})();
