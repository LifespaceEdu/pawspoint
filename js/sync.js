/* ═══ PawsPoint Cloud Sync (Vercel KV) ═══ */

var PP = (function () {
  var SKILLS = ['station', 'look', 'tuck', 'chin', 'middle', 'paws'];

  // ── Local helpers ──
  function getCode() {
    return localStorage.getItem('pawspoint-code') || '';
  }

  function setCode(code) {
    localStorage.setItem('pawspoint-code', code.toUpperCase());
  }

  function getDogName() {
    return localStorage.getItem('pawspoint-dog-name') || '';
  }

  function setDogName(name) {
    localStorage.setItem('pawspoint-dog-name', name.trim());
  }

  function getProgress() {
    try {
      var d = JSON.parse(localStorage.getItem('pawspoint-progress'));
      if (d && typeof d === 'object') return d;
    } catch (e) {}
    return { station: 0, look: 0, tuck: 0, chin: 0, middle: 0, paws: 0 };
  }

  function setProgress(p) {
    localStorage.setItem('pawspoint-progress', JSON.stringify(p));
  }

  // ── Code generator: NAME-XXX ──
  function generateCode(name) {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 confusion
    var suffix = '';
    for (var i = 0; i < 3; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    var prefix = name.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    if (!prefix) prefix = 'DOG';
    return prefix + '-' + suffix;
  }

  // ── Cloud calls ──
  function saveToCloud(callback) {
    var code = getCode();
    if (!code) return;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/save');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (callback) callback(xhr.status === 200);
    };
    xhr.onerror = function () {
      if (callback) callback(false);
    };
    xhr.send(JSON.stringify({
      code: code,
      name: getDogName(),
      progress: getProgress()
    }));
  }

  function loadFromCloud(code, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/load?code=' + encodeURIComponent(code));
    xhr.onload = function () {
      if (xhr.status === 200) {
        try {
          var data = JSON.parse(xhr.responseText);
          callback(null, data);
        } catch (e) {
          callback('Bad response');
        }
      } else if (xhr.status === 404) {
        callback('Code not found');
      } else {
        callback('Server error');
      }
    };
    xhr.onerror = function () {
      callback('Network error');
    };
    xhr.send();
  }

  // ── Apply dog name to all .pp-dog-name elements ──
  function applyDogName() {
    var name = getDogName();
    document.querySelectorAll('.pp-dog-name').forEach(function (el) {
      el.textContent = name || 'your dog';
    });
  }

  // ── Public API ──
  return {
    SKILLS: SKILLS,
    getCode: getCode,
    setCode: setCode,
    getDogName: getDogName,
    setDogName: setDogName,
    getProgress: getProgress,
    setProgress: setProgress,
    generateCode: generateCode,
    saveToCloud: saveToCloud,
    loadFromCloud: loadFromCloud,
    applyDogName: applyDogName
  };
})();
