

// remap jQuery to $
(function($){

 
  /**
  * hoverIntent r5 // 2007.03.27 // jQuery 1.1.2+
  * <http://cherne.net/brian/resources/jquery.hoverIntent.html>
  * 
  * @param  f  onMouseOver function || An object with configuration options
  * @param  g  onMouseOut function  || Nothing (use configuration options object)
  * @author    Brian Cherne <brian@cherne.net>
  */
  (function($){$.fn.hoverIntent=function(f,g){var cfg={sensitivity:7,interval:100,timeout:0};cfg=$.extend(cfg,g?{over:f,out:g}:f);var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).unbind("mousemove",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var p=(e.type=="mouseover"?e.fromElement:e.toElement)||e.relatedTarget;while(p&&p!=this){try{p=p.parentNode;}catch(e){p=this;}}if(p==this){return false;}var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}if(e.type=="mouseover"){pX=ev.pageX;pY=ev.pageY;$(ob).bind("mousemove",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).unbind("mousemove",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.mouseover(handleHover).mouseout(handleHover);};})(jQuery);


 // allow $('elem').css({ 'left' : '+=10px' });
// so you dont need to do:
//   $('elem').animate({ 'left' : '+=10px' }, 0);
// by paul irish
// for ralph holzmann
// http://github.com/paulirish/lazyweb-requests/issues#issue/10
(function($, oldcss) {

  // magic from the core.
  var rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/;

  $.fn.css = function(obj, val) {


      var parts = rfxnum.exec(val),
          that = this;


      if ($.isPlainObject(obj)) {
          $.each(obj, function(k, v) {
              $(that).css(k, v);
          });

          // here's the magic.  
      } else if (val && parts && parts[1]) {

          var end = parseFloat(parts[2])

          return oldcss.call(this, obj, function(index, currentValue) {
              return ((parts[1] === "-=" ? -1 : 1) * end) + parseFloat(currentValue);
          });

          // no fancypants  
      } else {

          return oldcss.apply(this, arguments);
      }

      return this;

  };

})(jQuery, jQuery.fn.css);




})(jQuery);




/*!
 * jQuery Tiny Pub/Sub - v0.3 - 11/4/2010
 * http://benalman.com/
 * 
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */

(function($){
  
  var o = $({});
  
  $.subscribe = function() {
    o.bind.apply( o, arguments );
  };
  
  $.unsubscribe = function() {
    o.unbind.apply( o, arguments );
  };
  
  $.publish = function() {
    o.trigger.apply( o, arguments );
  };
  
})(jQuery);
