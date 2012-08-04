
var $body = $(document.body);

function cursor(val){
  canvas.style.cursor = val;
}

function onDrag(e){
  
  //cursor('move')
  
}

function closeStory(){
  glProp('eyeRadius',5);
  $body.removeClass('storyopen');
  //document.getElementById('story').style.display = 'none';
}

function sphereClick(e){
   window.console && console.log('click!', e, e.timeStamp);
   
   var selected = g_textures[sel.y][sel.x];
   window.selected = selected;
   
   
   animateGL('eyeRadius', glProp('eyeRadius'), 4, 500); 
   
   var wwidth   = $(window).width(),
       wheight  = $(window).height(),
       story    = $('#story').width( ~~(wwidth / 7 * 4) ).height( ~~(wheight / 6 * 5) ), 
       width    = story.width(),
       height   = story.height(),
       miniwidth = 30;

   story.detach()
    .find('#storyinner').find('h3,img').remove().end().end()
    .show();

   story.css({
     left        :   e.pageX,
     top         :   e.pageY,
     marginLeft  :   - width / 2,
     marginTop   :   - height / 2
     
   }).appendTo($body); // we remove and put back on the DOM to reset it to the correct position.
   
   $('style.anim.story').remove();
   $('<style class="anim story">')
      .text( '.storyopen #story { left : ' + (wwidth  / 3 * 2) + 'px !important;  top : ' + wheight / 2 + 'px !important; }' )
      .appendTo($body);
   $(selected.img).prependTo('#storyinner').parent()
   
   $('<h3>').text(selected.msg.replace(/\(.*/,'')).prependTo('#storyinner');
   
   $body.addClass('storyopen');
   
   
   
   
} // eo sphereClick()

function glProp(prop, newValue){
  var area = /^bendRadius|bendAmount$/.test(prop) ? 'imagePlaneConst' : 'globals';
  if (newValue){
    g[area][prop] = newValue;
    
    
    return;
    
    // something about these next two lines causes a GREY screen of death. not sure what....
    var elem = $('#'+ prop);
    elem[0].value = newValue * 1000; // woot for native
    //return elem.change();
  } else
    return g[area][prop];
} 

function animateGL(prop,from,to, duration){
  
 

  jQuery({property: from}).animate({property: to}, {
      duration: duration,
      step: function() {
         glProp(prop, this.property);
         
         // we'll do the slider instead
         //elem.slider('value', this.property);
      }
  });  
}



function kickOffUI(){
  
  
  $('#welcome a').click(function(){
    $body.removeClass('init');
    setTimeout(function () {
      animateGL('bendAmount',0,1,2500); /* always 0 to 1 */
    }, 2500);
  })
  

  for (var ii = 0; ii < g_ui.length; ++ii) {
    var ui = g_ui[ii];
    var obj = g[ui.obj];
    obj[ui.name] = ui.value;
    setupSlider($, undefined, ui, obj);
  }
  
  var img = $('#uiContainer img').click(function(){
    $(this).closest('#uiContainer').toggleClass('open');
  });
  img.next().children().eq(0).children(0);
  
  $('img.close').click(closeStory);
 
} // eo kickOffUI



function getParamId(id) {
  return id.substr(6).replace(/(\w)/, function(m) {return m.toLowerCase() });
}

function setParam(event, ui, obj) {
  var id = event.target.id;
  var value = event.target.value / 1000; // ui.value / 1000;
  wu.log(id + ": " + value);
  obj[id] = value;
}

function getUIValue(obj, id) {
  return obj[id] * 1000;
}



function setupSlider($, elem, ui, obj) {

  if ($('#'+ ui.name).length == 0) return;

  $('<input>',{
    id : ui.name,
    max: ui.max * 1000,
    min: (ui.min * 1000) || 0,
    value: obj[ui.name] * 1000,
    type : 'range'
    
  }).change(function(event){
    setParam(event, ui, obj); 
  })
    .replaceAll( $('#'+ ui.name) )
    



  $.fn.slider && $('#'+ ui.name).slider({
    range: false,
    step: 1,
    max: ui.max * 1000,
    min: ui.min || 0,
    value: getUIValue(obj, ui.name),
    slide: function(event, ui) { 
      if (this.id != 'bendAmount'){
        //var newval = Math.round( $('#bendAmount').slider('value') / 1000 ) * 1000;
        // using slider in beginning transition is a pain.
        //$('#bendAmount').slider('value', 1000);
        // nevermind all this. it seems just fine.
      }
      setParam(event, ui, obj); 
    }
  });
} // setupSlider



var vidcanvas = document.createElement('canvas');
vidcanvas.width = 512;
vidcanvas.height = 512;
var vidcanvasctx = vidcanvas.getContext("2d");


// this is called ontimeupdate of the video tag.
function insertVideo(video) {


    
    (function loopsy(){
      
       if (video === false){
        clearTimeout(insertVideo.tID);
        return; // quit
      }
    
      
      // in general this technique is from http://demos.hacks.mozilla.org/openweb/CSSMAKESUSICK/
      // but ontimeupdate doesnt fire enough so we rapidfire this with some loops.
      
      
      vidtexture.image = video;
      
      vidcanvasctx.drawImage(vidtexture.image, 0, 0, 512, 512); // throw down the video frame

      gl.bindTexture(gl.TEXTURE_2D, vidtexture.texture);
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, vidcanvas);
      gl.generateMipmap(gl.TEXTURE_2D);
      
      insertVideo.tID = setTimeout(loopsy,20);
    })();
    
   
}

$(function(){
  
  $(document).bind('keydown keyup',function(e){
    if (e.which == 'P'.charCodeAt(0)){  // lowercase p
      document.querySelector('#texture')[ (e.type == 'keydown') ? 'play' : 'pause']();
          e.preventDefault();
    }

  });
  
});



// just for safe keeping
// WebGLFloatArray = Float32Array; // big change.
// WebGLUnsignedShortArray = Float32Array // not so sure about this one





/*
 ideas.  

  kill box-shadow etc for transition performance
  
  smoother transitions.
  
  cws. 
  
*/
   

   