// Info Note: vanilla popover (hover + click, no jQuery / Bootstrap required)
(function() {
  var state = {
    tooltip: null,
    activeBtn: null,
    pinned: false,
    hideTimer: null
  };

  function createTooltip(text) {
    var el = document.createElement('div');
    el.className = 'info-note-popup';
    el.setAttribute('role', 'tooltip');
    el.textContent = text;
    document.body.appendChild(el);
    return el;
  }

  function positionTooltip(trigger, tip) {
    var rect = trigger.getBoundingClientRect();
    var scrollY = window.scrollY || document.documentElement.scrollTop;
    var scrollX = window.scrollX || document.documentElement.scrollLeft;
    var margin = 10;
    var tipW = tip.offsetWidth;
    var vpW = window.innerWidth;

    var idealLeft = rect.left + rect.width / 2 - tipW / 2;
    var clampedLeft = Math.max(margin, Math.min(idealLeft, vpW - tipW - margin));

    tip.style.left = (clampedLeft + scrollX) + 'px';
    tip.style.top = (rect.top + scrollY - tip.offsetHeight - 8) + 'px';

    var arrowLeft = (rect.left + rect.width / 2) - clampedLeft;
    tip.style.setProperty('--arrow-left', arrowLeft + 'px');
  }

  function openFor(btn) {
    clearTimeout(state.hideTimer);
    if (state.tooltip && state.activeBtn === btn) return;
    closeTooltip(false);
    state.tooltip = createTooltip(btn.getAttribute('data-info'));
    state.activeBtn = btn;
    positionTooltip(btn, state.tooltip);
    btn.setAttribute('aria-expanded', 'true');

    // Hovering over the popup itself cancels the hide timer
    state.tooltip.addEventListener('mouseenter', function() {
      clearTimeout(state.hideTimer);
    });
    state.tooltip.addEventListener('mouseleave', function() {
      if (!state.pinned) scheduleClose();
    });
    state.tooltip.addEventListener('click', function(e) {
      e.stopPropagation();
    });
  }

  function scheduleClose() {
    clearTimeout(state.hideTimer);
    state.hideTimer = setTimeout(function() {
      if (!state.pinned) closeTooltip(true);
    }, 120); // small grace period so mouse can reach popup
  }

  function closeTooltip(unpin) {
    clearTimeout(state.hideTimer);
    if (unpin) state.pinned = false;
    if (state.tooltip) {
      var tip = state.tooltip;
      state.tooltip = null;
      tip.classList.add('info-note-popup--closing');
      tip.addEventListener('animationend', function() { tip.remove(); }, { once: true });
    }
    if (state.activeBtn) {
      state.activeBtn.setAttribute('aria-expanded', 'false');
      state.activeBtn = null;
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.info-note-trigger').forEach(function(btn) {

      // Hover (desktop)
      btn.addEventListener('mouseenter', function() { openFor(btn); });
      btn.addEventListener('mouseleave', function() {
        if (!state.pinned) scheduleClose();
      });

      // Click / tap (desktop + mobile)
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (state.tooltip && state.activeBtn === btn) {
          // Popup already open — toggle pin
          state.pinned ? closeTooltip(true) : (state.pinned = true);
        } else {
          // Not open → open and pin (important for mobile)
          openFor(btn);
          state.pinned = true;
        }
      });
    });

    // Click outside → close if pinned
    document.addEventListener('click', function() {
      if (state.pinned) closeTooltip(true);
    });

    window.addEventListener('scroll', function() { closeTooltip(true); }, { passive: true });
    window.addEventListener('resize', function() { closeTooltip(true); }, { passive: true });
  });
}());
