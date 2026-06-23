(function () {
  if (window.self === window.top) return;

  var reportTimer = null;

  function measureHeight() {
    var body = document.body;
    var root = document.documentElement;
    if (!body || !root) return 0;

    // scrollHeight tracks content. offsetHeight/clientHeight mirror the parent
    // iframe height and prevent shrinking after multi-step form transitions.
    var heights = [body.scrollHeight, root.scrollHeight];

    var form = document.querySelector('form');
    if (form) {
      heights.push(form.scrollHeight);
    }

    return Math.max.apply(
      null,
      heights.filter(function (value) {
        return typeof value === 'number' && value > 0;
      }),
    );
  }

  function reportHeight() {
    var height = measureHeight();
    if (!height) return;

    window.parent.postMessage({ type: 'rock-iframe-resize', height: height }, '*');
  }

  function scheduleReportHeight() {
    reportHeight();

    if (reportTimer) {
      window.clearTimeout(reportTimer);
    }

    reportTimer = window.setTimeout(reportHeight, 50);

    // Rock WebForm step changes often finish rendering after observers fire.
    [100, 250, 500, 1000, 2000].forEach(function (delay) {
      window.setTimeout(reportHeight, delay);
    });
  }

  function init() {
    scheduleReportHeight();

    if (typeof ResizeObserver !== 'undefined' && document.body) {
      new ResizeObserver(scheduleReportHeight).observe(document.body);

      if (document.documentElement) {
        new ResizeObserver(scheduleReportHeight).observe(document.documentElement);
      }
    }

    if (typeof MutationObserver !== 'undefined' && document.body) {
      new MutationObserver(scheduleReportHeight).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });
    }

    window.addEventListener('load', scheduleReportHeight);
    window.addEventListener('resize', scheduleReportHeight);
    window.addEventListener('pageshow', scheduleReportHeight);

    document.addEventListener('submit', scheduleReportHeight, true);
    document.addEventListener(
      'click',
      function (event) {
        var target = event.target;
        if (!target || !target.closest) return;

        if (
          target.closest('[type="submit"]') ||
          target.closest('button') ||
          target.closest('a')
        ) {
          scheduleReportHeight();
        }
      },
      true,
    );

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
