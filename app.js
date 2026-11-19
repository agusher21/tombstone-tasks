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

  var form = document.getElementById('add-task-form');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var titleInput = document.getElementById('task-title');
    var title = titleInput.value.trim();
    if (!title) {
      titleInput.focus();
      return;
    }
    var dueDateInput = document.getElementById('task-due-date');
    var dueDate = dueDateInput.value || null;
    var levelInput = document.querySelector('input[name="hauntingLevel"]:checked');
    var hauntingLevel = levelInput ? levelInput.value : 'low';
    var task = {
      id: store.generateId(),
      title: title,
      dueDate: dueDate,
      hauntingLevel: hauntingLevel,
      createdAt: new Date().toISOString(),
      buried: false,
      epitaph: null,
      buriedAt: null
    };
    store.tasks.push(task);
    store.save();
    renderAll();
    form.reset();
  });

  function renderAll() {
    renderTasks();
    renderFilters();
    if (typeof renderGraveyard === 'function') { renderGraveyard(); }
    if (typeof renderStats === 'function') { renderStats(); }
    if (typeof renderBats === 'function') { renderBats(); }
  }

  function isOverdue(task) {
    if (!task.dueDate || task.buried) { return false; }
    var todayString = new Date().toISOString().slice(0, 10);
    return task.dueDate < todayString;
  }

  function renderTasks() {
    var section = document.getElementById('graveyard-active');
    section.textContent = '';
    store.tasks.forEach(function (task) {
      if (task.buried) { return; }
      if (store.filter === 'buried') { return; }
      var card = document.createElement('article');
      card.className = 'tombstone-card';
      card.setAttribute('data-id', task.id);
      var heading = document.createElement('h2');
      heading.textContent = task.title;
      card.appendChild(heading);
      if (isOverdue(task)) {
        card.classList.add('is-risen');
        var risenIcon = document.createElement('span');
        risenIcon.setAttribute('aria-hidden', 'true');
        risenIcon.className = 'risen-icon';
        risenIcon.textContent = '⚠️';
        card.appendChild(risenIcon);
        var risenLabel = document.createElement('span');
        risenLabel.className = 'sr-only';
        risenLabel.textContent = 'Overdue';
        card.appendChild(risenLabel);
      }
      if (task.dueDate) {
        var due = document.createElement('p');
        due.textContent = 'Due: ' + task.dueDate;
        card.appendChild(due);
      }
      var badge = document.createElement('span');
      badge.className = 'haunting-badge haunting-' + task.hauntingLevel;
      badge.textContent = task.hauntingLevel;
      card.appendChild(badge);
      var buryBtn = document.createElement('button');
      buryBtn.type = 'button';
      buryBtn.textContent = 'Bury';
      buryBtn.setAttribute('aria-label', 'Bury: ' + task.title);
      card.appendChild(buryBtn);
      var editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit: ' + task.title);
      card.appendChild(editBtn);
      section.appendChild(card);
    });
  }

  var EPITAPHS = [
    'They finally replied to that email.',
    'Gone to the great backlog in the sky.',
    'Here lies a task, done at last.',
    'It only took three moons and a deadline.',
    'Rest in peace, little to-do.',
    'Buried with full honours and zero regrets.'
  ];

  document.getElementById('graveyard-active').addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON' || event.target.textContent !== 'Bury') { return; }
    var card = event.target.closest('article.tombstone-card');
    if (!card) { return; }
    var task = null;
    store.tasks.forEach(function (t) {
      if (t.id === card.getAttribute('data-id')) { task = t; }
    });
    if (task) { openEpitaphDialog(task, card); }
  });

  function openEpitaphDialog(task, card) {
    var dialog = document.getElementById('epitaph-dialog');
    dialog.innerHTML = '<label for="epitaph-input">Epitaph</label>' +
      '<textarea id="epitaph-input" placeholder="They finally replied to that email"></textarea>' +
      '<button type="button" id="epitaph-confirm">Confirm</button>' +
      '<button type="button" id="epitaph-skip">Skip</button>';
    dialog.showModal();
    var input = document.getElementById('epitaph-input');
    input.focus();
    document.getElementById('epitaph-confirm').addEventListener('click', function () {
      dialog.close();
      buryTask(task, card, input.value);
    });
    document.getElementById('epitaph-skip').addEventListener('click', function () {
      var line = EPITAPHS[Math.floor(Math.random() * EPITAPHS.length)];
      dialog.close();
      buryTask(task, card, line);
    });
  }

  function buryTask(task, card, epitaph) {
    task.buried = true;
    task.epitaph = epitaph;
    task.buriedAt = new Date().toISOString();
    card.classList.add('is-burying');
    var done = false;
    var finish = function () {
      if (done) { return; }
      done = true;
      store.save();
      renderAll();
    };
    card.addEventListener('transitionend', finish);
    card.addEventListener('animationend', finish);
    setTimeout(finish, 600);
  }

  function renderGraveyard() {
    var section = document.getElementById('graveyard-buried');
    section.textContent = '';
    store.tasks.forEach(function (task) {
      if (!task.buried) { return; }
      if (store.filter === 'alive') { return; }
      var card = document.createElement('article');
      card.className = 'tombstone-card is-buried';
      card.setAttribute('data-id', task.id);
      var heading = document.createElement('h2');
      heading.textContent = task.title;
      card.appendChild(heading);
      if (task.epitaph) {
        var epitaph = document.createElement('p');
        epitaph.className = 'epitaph';
        epitaph.textContent = task.epitaph;
        card.appendChild(epitaph);
      }
      if (task.buriedAt) {
        var buriedDate = document.createElement('p');
        buriedDate.textContent = 'Buried: ' + task.buriedAt.slice(0, 10);
        card.appendChild(buriedDate);
      }
      var deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete: ' + task.title);
      card.appendChild(deleteBtn);
      section.appendChild(card);
    });
  }

  function renderStats() {
    var buriedCount = 0;
    var aliveCount = 0;
    store.tasks.forEach(function (task) {
      if (task.buried) { buriedCount++; } else { aliveCount++; }
    });
    var buriedDays = {};
    store.tasks.forEach(function (task) {
      if (task.buried && task.buriedAt) {
        buriedDays[task.buriedAt.slice(0, 10)] = true;
      }
    });
    var streak = 0;
    var day = new Date();
    if (!buriedDays[day.toISOString().slice(0, 10)]) {
      day.setDate(day.getDate() - 1);
    }
    while (buriedDays[day.toISOString().slice(0, 10)]) {
      streak++;
      day.setDate(day.getDate() - 1);
    }
    var bar = document.getElementById('stats-bar');
    bar.textContent = 'Alive: ' + aliveCount + '  Buried: ' + buriedCount + '  Streak: ' + streak + ' days ';
    var moon = document.createElement('span');
    moon.id = 'moon-glyph';
    moon.setAttribute('aria-hidden', 'true');
    moon.textContent = '🌕';
    bar.appendChild(moon);
    var moonLabel = document.createElement('span');
    moonLabel.className = 'sr-only';
    moonLabel.textContent = 'Streak moon';
    bar.appendChild(moonLabel);
    document.documentElement.style.setProperty('--tt-streak', Math.min(streak, 10));
  }

  function renderFilters() {
    var controls = document.getElementById('filter-controls');
    controls.textContent = '';
    [['all', 'All'], ['alive', 'Alive'], ['buried', 'Buried']].forEach(function (pair) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = pair[1];
      btn.setAttribute('aria-pressed', store.filter === pair[0] ? 'true' : 'false');
      btn.addEventListener('click', function () {
        store.filter = pair[0];
        renderAll();
      });
      controls.appendChild(btn);
    });
  }

  function findTask(id) {
    var found = null;
    store.tasks.forEach(function (t) {
      if (t.id === id) { found = t; }
    });
    return found;
  }

  document.getElementById('graveyard-active').addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON' || event.target.textContent !== 'Edit') { return; }
    var card = event.target.closest('article.tombstone-card');
    if (!card) { return; }
    var task = findTask(card.getAttribute('data-id'));
    if (task) { openEditDialog(task); }
  });

  function openEditDialog(task) {
    var dialog = document.getElementById('edit-dialog');
    dialog.innerHTML = '<form id="edit-task-form">' +
      '<label for="edit-title">Task title</label>' +
      '<input type="text" id="edit-title" required>' +
      '<label for="edit-due-date">Due date (optional)</label>' +
      '<input type="date" id="edit-due-date">' +
      '<fieldset><legend>Haunting level</legend>' +
      '<label><input type="radio" name="editHauntingLevel" value="low"> Low</label>' +
      '<label><input type="radio" name="editHauntingLevel" value="medium"> Medium</label>' +
      '<label><input type="radio" name="editHauntingLevel" value="high"> High</label>' +
      '</fieldset>' +
      '<button type="submit">Save</button>' +
      '<button type="button" id="edit-cancel">Cancel</button></form>';
    document.getElementById('edit-title').value = task.title;
    document.getElementById('edit-due-date').value = task.dueDate || '';
    var radio = dialog.querySelector('input[name="editHauntingLevel"][value="' + task.hauntingLevel + '"]');
    if (radio) { radio.checked = true; }
    dialog.showModal();
    var titleInput = document.getElementById('edit-title');
    titleInput.focus();

    document.getElementById('edit-task-form').addEventListener('submit', function (event) {
      event.preventDefault();
      var title = titleInput.value.trim();
      if (!title) { titleInput.focus(); return; }
      task.title = title;
      task.dueDate = document.getElementById('edit-due-date').value || null;
      var level = dialog.querySelector('input[name="editHauntingLevel"]:checked');
      if (level) { task.hauntingLevel = level.value; }
      store.save();
      dialog.close();
      renderAll();
    });
    document.getElementById('edit-cancel').addEventListener('click', function () {
      dialog.close();
    });
  }

  document.getElementById('graveyard-buried').addEventListener('click', function (event) {
    if (event.target.tagName !== 'BUTTON' || event.target.textContent !== 'Delete') { return; }
    var card = event.target.closest('article.tombstone-card');
    if (!card) { return; }
    var task = findTask(card.getAttribute('data-id'));
    if (task) { openConfirmDialog(task); }
  });

  function openConfirmDialog(task) {
    var dialog = document.getElementById('confirm-dialog');
    dialog.setAttribute('data-task-id', task.id);
    dialog.innerHTML = '<p></p>' +
      '<button type="button" id="confirm-delete">Confirm</button>' +
      '<button type="button" id="cancel-delete">Cancel</button>';
    dialog.querySelector('p').textContent = 'Delete "' + task.title + '"?';
    dialog.showModal();
    document.getElementById('confirm-delete').focus();
    document.getElementById('confirm-delete').addEventListener('click', function () {
      var index = -1;
      store.tasks.forEach(function (t, i) {
        if (t.id === task.id) { index = i; }
      });
      if (index !== -1) { store.tasks.splice(index, 1); }
      store.save();
      dialog.close();
      renderAll();
    });
    document.getElementById('cancel-delete').addEventListener('click', function () {
      dialog.close();
    });
  }

  function renderBats() {
    var aliveCount = store.tasks.filter(function (t) { return !t.buried; }).length;
    var container = document.getElementById('bat-container');
    container.textContent = '';
    var count = Math.min(aliveCount, 5);
    for (var i = 0; i < count; i++) {
      var bat = document.createElement('span');
      bat.setAttribute('aria-hidden', 'true');
      bat.className = 'bat';
      bat.textContent = '🦇';
      container.appendChild(bat);
    }
  }

  store.load();
  if (store.tasks.length === 0) {
    var today = new Date();
    var future = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    var past = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    store.tasks.push(
      {
        id: store.generateId(),
        title: 'Water the haunted roses',
        dueDate: future.toISOString().slice(0, 10),
        hauntingLevel: 'medium',
        createdAt: new Date().toISOString(),
        buried: false,
        epitaph: null,
        buriedAt: null
      },
      {
        id: store.generateId(),
        title: 'Reply to the graveyard committee',
        dueDate: null,
        hauntingLevel: 'low',
        createdAt: new Date().toISOString(),
        buried: true,
        epitaph: 'They finally replied to that email.',
        buriedAt: new Date().toISOString()
      },
      {
        id: store.generateId(),
        title: 'Sweep the crypt steps',
        dueDate: past.toISOString().slice(0, 10),
        hauntingLevel: 'high',
        createdAt: new Date().toISOString(),
        buried: false,
        epitaph: null,
        buriedAt: null
      }
    );
    store.save();
  }
  renderAll();
  (function scheduleMidnightRefresh() {
    var now = new Date();
    var msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
    setTimeout(function () { renderAll(); }, msUntilMidnight);
  })();
})();
