(function($) {
  /** Plugin Main Function */
  $.fn.livefilter = function(action, opts) {
    if (typeof action === "undefined") {
      action = "init";
    }
    if (typeof action === "object") {
      opts = action;
      action = "init";
    }
    if (action === "init") {
      opts = $.extend({}, $.fn.livefilter.defaults, opts);
      $(this).data("lf-data", opts);
      $(this).unbind(".livefilter").bind("keyup.livefilter", $.fn.livefilter.onKey(opts));
    } else if (action === "destroy") {
      opts = $(this).data("lf-data");
      $(opts.selector).filter("." + opts.hiddenClass)[opts.showFn]();
      $(this).unbind(".livefilter");
    } else {
      log("action unknown", action);
    }
    return $(this);
  };

  /** keyup event action */
  $.fn.livefilter.onKey = function(opts) {
    var rv = function() {
      var v = $(this).val();
      log("filtering", v);
      if (v) {
        $(opts.selector).filter(":icontains(" + v + ")")[opts.showFn]().removeClass(opts.hiddenClass).end().filter(":not(:icontains(" + v + "))")[opts.hideFn]().addClass(opts.hiddenClass);
      } else {
        $(opts.selector).removeClass(opts.hiddenClass)[opts.showFn]();
      }
    };
    if (opts.debounce) {
      log("debounce active", opts.debounce);
      rv = $.fn.livefilter.debounce(rv, opts.debounce);
    }
    return rv;
  };

  /** Delay execution of too frequent tasks*/
  $.fn.livefilter.debounce = function(func, threshold) {
    var timeout;
    return function debounced() {
      var obj = this, args = arguments;
      function delayed() {
        func.apply(obj, args);
        timeout = null;
      }
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold || 100);
    };
  };

  /** Case insensitive :contains jQuery pseudo selector */
  $.expr[":"].icontains = function(obj, index, meta, stack) {
    return (obj.textContent || obj.innerText || jQuery(obj).text() || "").toLowerCase().indexOf(meta[3].toLowerCase()) >= 0;
  };

  var log=function(){
    if (typeof console!=='undefined' && console.log){
      console.log(Array.prototype.slice.call(arguments).join(', '));
    }
  };

  /** Plugin global defaults */
  $.fn.livefilter.defaults = {
    selector: "tbody tr",
    debounce: 500,

    hiddenClass: "lf-hidden",
    showFn: "show",
    hideFn: "hide"
  };
})(jQuery);

/* LIVE FILTER DATA-API
 * ====================
 *
 * Usage
 * Place a `data-live-filter` attribute on a text input form element to apply the filter.
 * On the same input element place a `data-live-filter-selector` attribute, the value can be any jQuery style DOM
 * element selector.
 *
 * Example
 * <input type="text" data-live-filter=".a-thing">
 *
 * <ul class="things>
 *   <li class="a-thing">searchable test inside</li>
 *   <li class="a-thing"><em>even searches text within nested tags</em></li>
 * </ul>
 * */

$(function() {
  // $('#search').livefilter({selector:'.searchable-project'});

  $('[data-live-filter]').each(function () {
    var selector = $(this).data('live-filter');
    $(this).livefilter({ selector: selector });
    // console.log('Found a data-live-filter, applying the Live Filter plugin.')
  });


});


