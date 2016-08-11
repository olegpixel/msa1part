'use strict';

$(function () {
  $('a[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').stop().animate({
          scrollTop: target.offset().top
        }, 700);
        return false;
      }
    }
  });
});
//# sourceMappingURL=smoothSlider.js.map
