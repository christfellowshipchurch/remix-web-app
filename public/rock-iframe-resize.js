(function () {
  if (window.self === window.top) return;

  var reportTimer = null;
  var debounceTimer = null;
  var freezeTimer = null;
  var burstTimers = [];
  var BOTTOM_PADDING = 12;
  var DEBOUNCE_MS = 200;
  var FREEZE_MAX_MS = 15000;
  var BURST_DELAYS = [100, 250, 500, 1000, 2000, 3000];

  var heightFrozen = false;
  var frozenHeight = 0;
  var lastReportedHeight = 0;
  var stableContentHeight = 0;
  var hadValidationErrors = false;
  var submitAttempted = false;
  var lastScrollTopAt = 0;
  var validationCheckTimer = null;

  var VALIDATION_ERROR_SELECTORS = [
    '.alert-validation',
    '.alert.alert-validation',
    '[id$="vsDetails"]',
    '.validation-summary-errors',
    '.validation-summary',
    '.field-validation-error',
    '.input-validation-error',
    '.validation-error',
    '.alert-danger',
    '.is-invalid',
    '.has-error .help-block',
  ];

  function isElementVisible(el) {
    if (!el || el.nodeType !== 1) return false;

    var style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    if (parseFloat(style.opacity) === 0) return false;

    var rect = el.getBoundingClientRect();
    return rect.width > 0 || rect.height > 0;
  }

  function isFixedPosition(el) {
    if (!el || el.nodeType !== 1) return false;
    return window.getComputedStyle(el).position === 'fixed';
  }

  function isLikelyLoadingOverlay(el) {
    if (!el || el.nodeType !== 1 || !isElementVisible(el)) return false;

    var style = window.getComputedStyle(el);
    var className = (el.className && el.className.toString()) || '';
    var id = el.id || '';
    var label = className + ' ' + id;

    if (/loading|blockui|spinner|overlay|please-wait|processing|modal-backdrop/i.test(label)) {
      return true;
    }

    if (style.position === 'fixed' || style.position === 'absolute') {
      var rect = el.getBoundingClientRect();
      var viewportWidth = window.innerWidth || 0;
      var viewportHeight = window.innerHeight || 0;

      if (!viewportWidth || !viewportHeight) return false;

      var coversWidth = rect.width >= viewportWidth * 0.5;
      var coversHeight = rect.height >= viewportHeight * 0.5;
      var highStack = parseInt(style.zIndex, 10) > 50;

      if (coversWidth && coversHeight) return true;
      if (coversWidth && coversHeight && highStack) return true;
    }

    return false;
  }

  function isLoadingOverlayVisible() {
    var body = document.body;
    if (!body) return false;

    var directChildren = body.children;
    for (var i = 0; i < directChildren.length; i++) {
      if (isLikelyLoadingOverlay(directChildren[i])) return true;
    }

    var candidates = document.querySelectorAll(
      '.blockUI, .blockOverlay, .modal-backdrop, [class*="loading"], [id*="loading"]',
    );

    for (var j = 0; j < candidates.length; j++) {
      if (isLikelyLoadingOverlay(candidates[j])) return true;
    }

    return false;
  }

  function getHeldHeight() {
    return frozenHeight || stableContentHeight || lastReportedHeight || 0;
  }

  function shouldHoldHeight() {
    return heightFrozen || isLoadingOverlayVisible();
  }

  function hasMeaningfulValidationText(el) {
    if (!el) return false;
    return Boolean((el.textContent || '').replace(/\s+/g, ' ').trim());
  }

  function hasVisibleValidationErrors() {
    for (var i = 0; i < VALIDATION_ERROR_SELECTORS.length; i++) {
      var nodes = document.querySelectorAll(VALIDATION_ERROR_SELECTORS[i]);

      for (var j = 0; j < nodes.length; j++) {
        var node = nodes[j];
        if (isElementVisible(node) && hasMeaningfulValidationText(node)) {
          return true;
        }
      }
    }

    if (submitAttempted) {
      var invalidFields = document.querySelectorAll(
        'input:invalid, select:invalid, textarea:invalid, [aria-invalid="true"]',
      );

      for (var k = 0; k < invalidFields.length; k++) {
        if (isElementVisible(invalidFields[k])) return true;
      }
    }

    return false;
  }

  function requestParentScrollTop() {
    var now = Date.now();
    if (now - lastScrollTopAt < 400) return;

    lastScrollTopAt = now;
    window.parent.postMessage({ type: 'rock-iframe-scroll-top' }, '*');
  }

  function checkValidationErrors() {
    if (isLoadingOverlayVisible()) return;

    var hasErrors = hasVisibleValidationErrors();

    if (hasErrors && heightFrozen) {
      unfreezeHeight();
    }

    if (hasErrors && !hadValidationErrors) {
      requestParentScrollTop();
    }

    hadValidationErrors = hasErrors;
  }

  function checkValidationErrorsOnPageReady() {
    if (isLoadingOverlayVisible()) return;

    submitAttempted = true;
    var hasErrors = hasVisibleValidationErrors();

    if (hasErrors) {
      requestParentScrollTop();
    }

    hadValidationErrors = hasErrors;
  }

  function nodeMatchesValidationSelector(node) {
    if (!node || node.nodeType !== 1) return false;

    if (node.matches) {
      for (var i = 0; i < VALIDATION_ERROR_SELECTORS.length; i++) {
        if (node.matches(VALIDATION_ERROR_SELECTORS[i])) return true;
      }
    }

    for (var j = 0; j < VALIDATION_ERROR_SELECTORS.length; j++) {
      if (node.querySelector && node.querySelector(VALIDATION_ERROR_SELECTORS[j])) {
        return true;
      }
    }

    return false;
  }

  function handleValidationMutation(mutations) {
    if (isLoadingOverlayVisible()) return;

    for (var i = 0; i < mutations.length; i++) {
      var mutation = mutations[i];
      var target = mutation.target;

      if (mutation.type === 'attributes' && nodeMatchesValidationSelector(target)) {
        submitAttempted = true;
        if (heightFrozen) unfreezeHeight();
        hadValidationErrors = false;
        checkValidationErrors();
        return;
      }

      if (mutation.type !== 'childList') continue;

      var added = mutation.addedNodes;
      for (var j = 0; j < added.length; j++) {
        if (nodeMatchesValidationSelector(added[j])) {
          submitAttempted = true;
          if (heightFrozen) unfreezeHeight();
          hadValidationErrors = false;
          checkValidationErrors();
          return;
        }
      }
    }
  }

  function scheduleValidationCheck() {
    checkValidationErrors();

    if (validationCheckTimer) {
      window.clearTimeout(validationCheckTimer);
    }

    validationCheckTimer = window.setTimeout(function () {
      validationCheckTimer = null;
      checkValidationErrors();
    }, 150);

    [300, 600, 1200, 2000].forEach(function (delay) {
      window.setTimeout(checkValidationErrors, delay);
    });
  }

  function getScrollY() {
    return (
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0
    );
  }

  function measureElementBottom(el) {
    if (!isElementVisible(el) || isFixedPosition(el)) return 0;

    var rect = el.getBoundingClientRect();
    return rect.bottom + getScrollY();
  }

  function measureSubtreeBottom(root) {
    if (!root) return 0;

    var scrollY = getScrollY();
    var maxBottom = 0;

    function visit(el) {
      if (!el || el.nodeType !== 1 || !isElementVisible(el)) return;
      if (isFixedPosition(el) || isLikelyLoadingOverlay(el)) return;

      var rect = el.getBoundingClientRect();
      maxBottom = Math.max(maxBottom, rect.bottom + scrollY);

      var children = el.children;
      for (var i = 0; i < children.length; i++) {
        visit(children[i]);
      }
    }

    visit(root);
    return maxBottom;
  }

  function measureBodyFlowContentBottom() {
    var body = document.body;
    if (!body) return 0;

    var maxBottom = 0;
    var children = body.children;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      if (isLikelyLoadingOverlay(child) || isFixedPosition(child)) continue;
      maxBottom = Math.max(maxBottom, measureSubtreeBottom(child));
    }

    return maxBottom;
  }

  function collectContentRoots() {
    var roots = [];
    var seen = [];

    function addRoot(el) {
      if (!el || seen.indexOf(el) !== -1) return;
      seen.push(el);
      roots.push(el);
    }

    var form = document.querySelector('form');
    if (form) addRoot(form);

    var selectors = [
      'main',
      '[role="main"]',
      '.main-content',
      '.page-content',
      '.content',
      '#content',
      '.rock-page',
    ];

    for (var i = 0; i < selectors.length; i++) {
      addRoot(document.querySelector(selectors[i]));
    }

    return roots;
  }

  function isViewportLockedHeight(value, viewportHeight) {
    if (!viewportHeight || !value) return false;
    return Math.abs(value - viewportHeight) <= 2;
  }

  function measureHeight() {
    if (shouldHoldHeight()) {
      var held = getHeldHeight();
      if (held > 0) return held;
    }

    var body = document.body;
    var root = document.documentElement;
    if (!body || !root) return 0;

    var viewportHeight = window.innerHeight || root.clientHeight || 0;
    var form = document.querySelector('form');
    var scrollHeights = [];

    if (form) {
      scrollHeights.push(form.scrollHeight);
    } else {
      scrollHeights.push(body.scrollHeight, root.scrollHeight);
    }

    var scrollHeightMax = Math.max.apply(
      null,
      scrollHeights.filter(function (value) {
        return typeof value === 'number' && value > 0;
      }),
    );

    var boundsHeights = [];
    var contentRoots = collectContentRoots();

    for (var i = 0; i < contentRoots.length; i++) {
      var measured = measureSubtreeBottom(contentRoots[i]);
      if (measured > 0) boundsHeights.push(measured);
    }

    var flowBottom = measureBodyFlowContentBottom();
    if (flowBottom > 0) boundsHeights.push(flowBottom);

    if (form) {
      var formBottom = measureElementBottom(form);
      if (formBottom > 0) boundsHeights.push(formBottom);
    }

    var boundsMax =
      boundsHeights.length > 0
        ? Math.max.apply(null, boundsHeights)
        : 0;

    var height = scrollHeightMax;

    if (
      boundsMax > 0 &&
      (isViewportLockedHeight(scrollHeightMax, viewportHeight) ||
        boundsMax > scrollHeightMax)
    ) {
      height = boundsMax;
    } else if (boundsMax > height) {
      height = boundsMax;
    }

    if (!height) return 0;

    height = Math.ceil(height + BOTTOM_PADDING);
    stableContentHeight = height;
    return height;
  }

  function postHeight(height) {
    if (!height) return;
    lastReportedHeight = height;
    window.parent.postMessage({ type: 'rock-iframe-resize', height: height }, '*');
  }

  function reportHeight() {
    if (shouldHoldHeight()) {
      var held = getHeldHeight();
      if (held > 0) {
        postHeight(held);
        return;
      }
    }

    postHeight(measureHeight());
  }

  function clearBurstTimers() {
    for (var i = 0; i < burstTimers.length; i++) {
      window.clearTimeout(burstTimers[i]);
    }
    burstTimers = [];

    if (reportTimer) {
      window.clearTimeout(reportTimer);
      reportTimer = null;
    }
  }

  function scheduleReportHeightImmediate() {
    if (shouldHoldHeight()) {
      reportHeight();
      return;
    }

    clearBurstTimers();
    reportHeight();

    reportTimer = window.setTimeout(reportHeight, 50);

    burstTimers = BURST_DELAYS.map(function (delay) {
      return window.setTimeout(reportHeight, delay);
    });
  }

  function scheduleReportHeightDebounced() {
    if (shouldHoldHeight()) {
      reportHeight();
      return;
    }

    if (debounceTimer) {
      window.clearTimeout(debounceTimer);
    }

    debounceTimer = window.setTimeout(function () {
      debounceTimer = null;
      scheduleReportHeightImmediate();
    }, DEBOUNCE_MS);
  }

  function freezeHeight() {
    frozenHeight = getHeldHeight() || measureHeight();
    stableContentHeight = frozenHeight;
    heightFrozen = true;

    if (freezeTimer) {
      window.clearTimeout(freezeTimer);
    }

    freezeTimer = window.setTimeout(function () {
      freezeTimer = null;
      unfreezeHeight();
      scheduleReportHeightDebounced();
    }, FREEZE_MAX_MS);
  }

  function unfreezeHeight() {
    heightFrozen = false;
    frozenHeight = 0;

    if (freezeTimer) {
      window.clearTimeout(freezeTimer);
      freezeTimer = null;
    }
  }

  function handlePageReady() {
    unfreezeHeight();
    hadValidationErrors = false;
    submitAttempted = false;
    scheduleReportHeightImmediate();
    checkValidationErrorsOnPageReady();
    scheduleValidationCheck();
  }

  function isSubmitLikeTarget(target) {
    if (!target || !target.closest) return false;

    return Boolean(
      target.closest(
        'button, input[type="submit"], [type="submit"], .btn, .btn-primary',
      ),
    );
  }

  function handleDomChange() {
    if (isLoadingOverlayVisible()) {
      if (!heightFrozen) {
        freezeHeight();
      }
      reportHeight();
      return;
    }

    scheduleValidationCheck();
    scheduleReportHeightDebounced();
  }

  function init() {
    scheduleReportHeightImmediate();

    if (typeof ResizeObserver !== 'undefined' && document.body) {
      new ResizeObserver(handleDomChange).observe(document.body);

      if (document.documentElement) {
        new ResizeObserver(handleDomChange).observe(document.documentElement);
      }

      var form = document.querySelector('form');
      if (form) {
        new ResizeObserver(handleDomChange).observe(form);
      }
    }

    if (typeof MutationObserver !== 'undefined' && document.body) {
      new MutationObserver(handleDomChange).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      });

      new MutationObserver(handleValidationMutation).observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class'],
      });
    }

    window.addEventListener('load', handlePageReady);
    window.addEventListener('resize', scheduleReportHeightDebounced);
    window.addEventListener('pageshow', handlePageReady);

    document.addEventListener(
      'invalid',
      function () {
        submitAttempted = true;
        scheduleValidationCheck();
      },
      true,
    );

    document.addEventListener(
      'submit',
      function () {
        submitAttempted = true;
        freezeHeight();
        scheduleValidationCheck();
      },
      true,
    );

    document.addEventListener(
      'mousedown',
      function (event) {
        if (isSubmitLikeTarget(event.target)) {
          freezeHeight();
        }
      },
      true,
    );

    document.addEventListener(
      'click',
      function (event) {
        var target = event.target;
        if (!target || !target.closest) return;

        if (isSubmitLikeTarget(target)) {
          submitAttempted = true;
          freezeHeight();
          reportHeight();
          scheduleValidationCheck();
          return;
        }

        if (target.closest('a')) {
          scheduleReportHeightDebounced();
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

    checkValidationErrorsOnPageReady();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
