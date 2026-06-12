(function () {
  if (window.self === window.top) return;

  function measureHeight() {
    var body = document.body;
    var root = document.documentElement;

    return Math.max(
      body ? body.scrollHeight : 0,
      body ? body.offsetHeight : 0,
      root ? root.clientHeight : 0,
      root ? root.scrollHeight : 0,
      root ? root.offsetHeight : 0,
    );
  }

  function reportHeight() {
    var height = measureHeight();
    if (!height) return;

    window.parent.postMessage({ type: 'rock-iframe-resize', height: height }, '*');
  }

  function init() {
    reportHeight();

    if (typeof ResizeObserver !== 'undefined' && document.body) {
      new ResizeObserver(reportHeight).observe(document.body);
    }

    if (typeof MutationObserver !== 'undefined' && document.body) {
      new MutationObserver(reportHeight).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    window.addEventListener('load', reportHeight);
    window.addEventListener('resize', reportHeight);

    window.addEventListener('message', function (event) {
      if (event.data && event.data.type === 'rock-iframe-height-request') {
        reportHeight();
      }
    });

    document.addEventListener('click', function (event) {
      var link = event.target.closest('[data-rock-parent-navigate]');
      if (!link) return;

      event.preventDefault();
      var url = link.getAttribute('data-rock-parent-navigate');
      if (!url) return;

      window.parent.postMessage(
        { type: 'rock-iframe-navigate', url: url },
        '*',
      );
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
