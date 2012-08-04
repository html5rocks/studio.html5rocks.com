/*
 * Copyright (c) 2010 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Original code: http://lavadip.com/experiments/jigsaw/jigsaw.js
 * Modified by: Eric Bidelman <ericbidelman@chromiumg.org>
 */
var IMAGES = [
  {src: 'chrome_poster.jpg', width: document.body.clientWidth, height: document.body.clientHeight,background:'-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 500, from(#f7e1b0), to(black)) no-repeat'},
  {src: 'chrome_poster2.jpg', width: document.width||document.body.clientWidth, height: document.height||document.body.clientHeight,background:'-webkit-gradient(radial, 50% 50%, 0, 50% 50%, 500, from(#e45827), to(black)) no-repeat'}
];
var ROWS = 5;
var COLS = 5;
var M = Math;

// The following code adapted from http://stackoverflow.com/questions/190560/jquery-animate-backgroundcolor
$.each(["backgroundColor"], function(f,e){
  $.fx.step[e]=function(g){if(!g.colorInit){g.start=c(g.elem,e);g.end=b(g.end);g.colorInit=true}g.elem.style[e]="rgb("+[M.max(M.min(parseInt((g.pos*(g.end[0]-g.start[0]))+g.start[0]),255),0),M.max(M.min(parseInt((g.pos*(g.end[1]-g.start[1]))+g.start[1]),255),0),M.max(M.min(parseInt((g.pos*(g.end[2]-g.start[2]))+g.start[2]),255),0)].join(",")+")"}
});
function b(f){var e;if(f&&f.constructor==Array&&f.length==3){return f}if(e=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(f)){return[parseInt(e[1]),parseInt(e[2]),parseInt(e[3])]}if(e=/rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(f)){return[parseFloat(e[1])*2.55,parseFloat(e[2])*2.55,parseFloat(e[3])*2.55]}if(e=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(f)){return[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)]}if(e=/#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(f)){return[parseInt(e[1]+e[1],16),parseInt(e[2]+e[2],16),parseInt(e[3]+e[3],16)]}if(e=/rgba\(0, 0, 0, 0\)/.exec(f)){return a.transparent}return a[$.trim(f).toLowerCase()]}
function c(g,e){var f;do{f=$.curCSS(g,e);if(f!=""&&f!="transparent"||$.nodeName(g,"body")){break}e="backgroundColor"}while(g=g.parentNode);return b(f)}
var a={aqua:[0,255,255],azure:[240,255,255],beige:[245,245,220],black:[0,0,0],blue:[0,0,255],brown:[165,42,42],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgrey:[169,169,169],darkgreen:[0,100,0],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkviolet:[148,0,211],fuchsia:[255,0,255],gold:[255,215,0],green:[0,128,0],indigo:[75,0,130],khaki:[240,230,140],lightblue:[173,216,230],lightcyan:[224,255,255],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightyellow:[255,255,224],lime:[0,255,0],magenta:[255,0,255],maroon:[128,0,0],navy:[0,0,128],olive:[128,128,0],orange:[255,165,0],pink:[255,192,203],purple:[128,0,128],violet:[128,0,128],red:[255,0,0],silver:[192,192,192],white:[255,255,255],yellow:[255,255,0],transparent:[255,255,255]}

var MA = new function() {
    var _uuid = new Date().getTime(),
      svgNS = 'http://www.w3.org/2000/svg',
      xlinkNS = 'http://www.w3.org/1999/xlink',
      origImgTxt = 'Original image',
      myNull = null,
      svg = myNull,
      svgDefs = myNull,
      arena = {},
      containerObj = $('#world'),
      container = containerObj.get(0),
      currPageNum = 1,
      photos = [], currJigsaw,
      photoHashPattern = /#(.*)/,
      photoHashIgnorePattern = /(.*)#.*/;

  function updateStatus(text,hint) {
    $('#status').html(text + (hint ? '<p id="hint">'+hint+'</p>' : '') );
  }

  // animation code adapted from jquery.svg plugin

  // Enable animation for the SVG transform attribute
  $.fx.step['svgTransform'] = $.fx.step['svg-transform'] = function(fx) {
    var attr = fx.elem.attributes.getNamedItem('transform');
    if (!fx.set) {
      fx.start = parseTransform(attr ? attr.nodeValue : '');
      fx.end = parseTransform(fx.end, fx.start);
      fx.set = true;
    }
    var transform = '';
    for (var i = 0; i < fx.end.order.length; i++) {
      switch (fx.end.order.charAt(i)) {
        case 'r':
          transform += (fx.start.rotateA != fx.end.rotateA ||
            fx.start.rotateX != fx.end.rotateX || fx.start.rotateY != fx.end.rotateY ?
            ' rotate(' + (fx.pos * (fx.end.rotateA - fx.start.rotateA) + fx.start.rotateA) + ',' +
            (fx.pos * (fx.end.rotateX - fx.start.rotateX) + fx.start.rotateX) + ',' +
            (fx.pos * (fx.end.rotateY - fx.start.rotateY) + fx.start.rotateY) + ')' : '');
          break;
        case 't':
          transform += (fx.start.translateX != fx.end.translateX || fx.start.translateY != fx.end.translateY ?
            ' translate(' + (fx.pos * (fx.end.translateX - fx.start.translateX) + fx.start.translateX) + ',' +
            (fx.pos * (fx.end.translateY - fx.start.translateY) + fx.start.translateY) + ')' : 'translate('+[fx.start.translateX,fx.start.translateY].join(',')+')');
          break;
      }
    }
    (attr ? attr.nodeValue = transform : fx.elem.setAttribute('transform', transform));
  };

  /* Decode a transform string and extract component values.
     @param  value     (string) the transform string to parse
     @param  original  (object) the settings from the original node
     @return  (object) the combined transformation attributes */
  function parseTransform(value, original) {
    value = value || '';
    if (typeof value == 'object') {
      value = value.nodeValue;
    }
    var transform = $.extend({translateX: 0, translateY: 0, scaleX: 0, scaleY: 0,
      rotateA: 0, rotateX: 0, rotateY: 0, skewX: 0, skewY: 0,
      matrix: [0, 0, 0, 0, 0, 0]}, original || {});
    transform.order = '';
    var pattern = /([a-zA-Z]+)\(\s*([+-]?[\d\.]+)\s*(?:[\s,]\s*([+-]?[\d\.]+)\s*(?:[\s,]\s*([+-]?[\d\.]+)\s*(?:[\s,]\s*([+-]?[\d\.]+)\s*[\s,]\s*([+-]?[\d\.]+)\s*[\s,]\s*([+-]?[\d\.]+)\s*)?)?)?\)/g;
    var result = pattern.exec(value);
    while (result) {
      switch (result[1]) {
        case 'translate':
          transform.order += 't';
          transform.translateX = parseFloat(result[2]);
          transform.translateY = (result[3] ? parseFloat(result[3]) : 0);
          break;
        case 'rotate':
          transform.order += 'r';
          transform.rotateA = parseFloat(result[2]);
          transform.rotateX = (result[3] ? parseFloat(result[3]) : 0);
          transform.rotateY = (result[4] ? parseFloat(result[4]) : 0);
          break;
      }
      result = pattern.exec(value);
    }
    return transform;
  }


  function windowResizeHndl() {
    var thumbs = $('#thumbs');
    thumbs.height($(window).height() - thumbs.offset().top - 2);
  }

  function setAttr(x, key, value) {
    x.setAttribute(key, value);
  }

    function makeNode(parent, name, settings) {
        parent = parent || svg;
        var node = svg.ownerDocument.createElementNS(svgNS, name);
        for (var name in settings) {
            var value = settings[name];
            if (value != myNull && (typeof value != 'string' || value != '')) {
                setAttr(node,name, value);
            }
        }
        parent.appendChild(node);
        return node;
    }
    function addImage(parent, width, height, ref, settings) {
        var node = makeNode(parent, 'image', $.extend({x: 0, y: 0, width: width, height: height}, settings|| {}));
        node.setAttributeNS(xlinkNS, 'href', ref);
        return node;
    }

  this.init = function () {
    //windowResizeHndl();
    //$(window).resize(windowResizeHndl);
    try {
      svg = document.createElementNS(svgNS, 'svg');
      setAttr(svg, 'version', '1.1');
      setAttr(svg, 'width', arena.width);
      setAttr(svg, 'height', arena.height);
      container.appendChild(svg);
    } catch (e) {
      container.innerHTML = '<p class="svg_error">This game is not supported in your Browser. Please try with Firefox, Chrome, Safari or Opera.</p>';
    } finally {
      var specifiedHash = photoHashPattern.exec(window.location.hash);
      if (specifiedHash) {
        updateStatus('Fetching photo from Google Image Search');
        $.getJSON('http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+specifiedHash[1]+'&callback=?', function(response) {
          if (response.responseStatus == 200) {
            if (response.responseData.results) {
              var photo = response.responseData.results[0];
                updateStatus('Observe the tiles. Click on them to begin.');
                currJigsaw = new JigSaw(photo.unescapedUrl, photo.width, photo.height, photo.url, photo.title);
                var locationMatch = photoHashIgnorePattern.exec(window.location),
                    myLocation = locationMatch ? locationMatch[1] : window.location;

            }

          } else {
            updateStatus('Error! Couldn\'t load image');
          }
        });
      } else {
        getInt(0);
      }
    }
  }

  this.loadMore = function() {
    if (currPageNum == 1) {
      $('#thumbs').html('<div>Loading...</div>');
    }
    $('#puzzleLink').hide();
    getInt();
  }

  function getInt() {
    if (currJigsaw) {
      currJigsaw.destroy();
      currJigsaw = myNull;
    }
    var image = IMAGES[Math.floor(Math.random() * IMAGES.length)];
    document.body.style.background = image.background;

     photos.push({
       unescapedUrl: image.src,
       width: image.width,
       height: image.height,
       //url: 'disney_com_files/files/tron_bg2.jpg',
       title: 'Tron Legacy Movie'
     });
     MA.sel(0);
  }

  function makeTitle(t) {
    return t ? (t.length > 0 ? t : origImgTxt ) : origImgTxt;
  }

  this.sel = function(n) {
    if (currJigsaw) {
      currJigsaw.destroy();
    }
    $('#puzzleLink').hide();

    updateStatus('Observe the tiles. Click on them to begin.');
    var p = photos[n];
    currJigsaw = new JigSaw(p.unescapedUrl, p.width, p.height, p.url, p.title);

    var locationMatch = photoHashIgnorePattern.exec(window.location),
        myLocation = locationMatch ? locationMatch[1] : window.location;

    $('#puzzleLink').html('<a href="'+myLocation+'#photo_'+photos[n].id+'">Puzzle\'s link</a>');
  };

  var JigSaw = function(img, width, height, origUrl, title) {

    if (svg) {
      setAttr(svg,'width', width);
      setAttr(svg,'height', height);
    }

    var rows = height > 400 ? ROWS : 2,
        cols = width > 300 ? COLS : 2,
        tileWidth = width / cols,
        tileHeight = height / rows,
        tiles = [],
        allEdges = new Array(rows),
        myLayers = makeNode(svg, 'g'),
        currTile,
        hintOpacity = 6,
        border = makeNode(myLayers,'rect', {x:0,y:0,width:width,height:height,style:'fill:#000;stroke-width:4;stroke:#999'}),
        hintImg = addImage(myLayers, width, height, img, {opacity:hintOpacity/10});

    this.destroy = function() {svg.removeChild(myLayers)};

    // create the tiles
    for (var i = cols; i--;) {
      allEdges[i] = new Array(cols);
      for (var j = rows; j--;) {
        allEdges[i][j] = {
          right : i == (cols-1) ? createEdge(i + 1, j, i+1, j+1) : flip(allEdges[i + 1][j].left),
          bottom : j == (rows-1) ? createEdge(i+1, j+1, i, j+1) : flip(allEdges[i][j+1].top),
          left : createEdge(i, j+1, i, j, i != 0),
          top : createEdge(i, j, i+1, j, j != 0)
        }

        var center = {x:tileWidth * (i + 0.5), y: tileHeight * (j + 0.5)},
            tilePath = makeTilePath(allEdges[i][j]),
            tileP = makeNode(myLayers, 'g', {transform:'translate('+[center.x, center.y].join(',')+')'}),
            tile = makeNode(tileP, 'g', {transform:'translate('+[-center.x, -center.y].join(',')+')'}),
            mclip = makeNode(tile, "clipPath", {id:'tileClip'+[i,j].join('_')}),
            borderNode = makeNode(tile,'path',{d:tilePath, 'class':'tile'});

        makeNode(mclip,'path',{d:tilePath,style:"stroke:#000;fill-opacity:0;"});
        addImage(tile, width, height, img, {"clip-path":"url(#tileClip"+[i,j].join('_')+')'});

        tiles.push({
          pos : center,
          cp : $.extend({}, center),    // current position
          sN : tileP,
          edges : allEdges[i][j],
          r: 90*randInt(4),
          bN : borderNode
        });

      }

    }
    containerObj.mousedown(clickHndlr);

    // Game states
    // 0    initialised
    // 1    startAnimation
    // 2    playing
    // 3    over
    var gameState = 0;
    function clickHndlr(e) {
      e.preventDefault();
      switch (gameState) {
      case 0:
        gameState = 1;
        startPlayInit();
        break;
      case 2:
        if (currTile != myNull) {
          if (e.which == 1) {
            currTile.r = (currTile.r -90);
          } else {
            currTile.r = (currTile.r +90);
          }
          updateTile(true);
        }

        break;
      }
    }

    function randInt(n) {
      return M.floor(M.random()*n);
    }

    function startPlayInit() {
      var imgCenter = {x : width/2, y: height/2};
      for (var i = tiles.length; i--;) {
        $(tiles[i].sN).animate({'svgTransform':'rotate('+[tiles[i].r,imgCenter.x, imgCenter.y].join(',')+') translate('+[imgCenter.x, imgCenter.y].join(',')+')'}, {
          duration:1000,
          complete : startPlay
        });
      }
    }

    var completeTiles = 0;
    function startPlay() {
      completeTiles++;
      if (completeTiles < (rows * cols)) {
        return;
      }
      gameState = 2;
      for (var i = tiles.length; i--;) {
        setAttr(tiles[i].sN, 'display','none');
      }
      pickNextTile();
      containerObj.mousemove(moveHndlr);
    }

    function redrawTile(animate) {
      var x = currTile.cp.x;
      var y = currTile.cp.y;
      var transform = 'rotate('+[currTile.r,x,y].join(',')+') translate('+[x,y].join(',')+')';

      if (animate) {
        currTile.animating = true;
        $(currTile.sN).animate({'svgTransform': transform}, {
          duration:150,
          complete: function() {currTile.animating = false;}
        });
      } else {
        setAttr(currTile.sN,'transform', transform);
      }
    }

    function approxEqual(a, b) {
      var diff = a-b;
      if (diff < 0) {
        diff *= -1;
      }
      return diff < 0.03;
    }

    function dist(a, b) {
      return M.sqrt(M.pow(a.x-b.x,2) + M.pow(a.y-b.y,2));
      
    }
    function updateTile(animate) {
      var d = dist(currTile.pos, currTile.cp);

      setAttr(currTile.bN, 'class', (d < tileWidth/2) ? 'tileVeryNear' : (d < tileWidth) ? 'tileNear' : 'tile');

      if ( (d < (0.05*tileWidth)) &&
          (currTile.r % 360) == 0) {
        currTile.cp = currTile.pos;
        setAttr(currTile.bN, "class","tileFit");
        redrawTile();

        //$('body').css('background-color','#999').animate({'background-color':'#000'}, 300);

        hintOpacity -= 0.7; /* darker each time you click */
        hintOpacity = (hintOpacity >= 0) ? hintOpacity : 0;
        setAttr(hintImg, 'opacity',hintOpacity/10);

        pickNextTile();
      } else {
        redrawTile(animate);
      }
    }

    function moveHndlr(evt) {
      if ((gameState == 2) && currTile && !currTile.animating) {
        var pos = containerObj.offset();
        currTile.cp.x = evt.pageX - pos.left - (containerObj.outerWidth(true) - width)/2; // the final subtraction is because we are not able to modify the width of the container to fit the image. Hence we compute the difference.
        currTile.cp.y = evt.pageY - pos.top;
        updateTile();
      }
    }

    function pickNextTile() {
      // remove currTile
      if (currTile) {
        for(var i = tiles.length; i--;) {
          if (tiles[i] == currTile) {
            break;
          }
        }

        tiles.splice(i, 1);
      }

      if (tiles.length > 0) {
        var pick = randInt(tiles.length);
        var pickedTile = tiles[pick];
        if (currTile) {
          $(pickedTile.sN).insertAfter(currTile.sN);
        }
        currTile = pickedTile;
        setAttr(currTile.sN, 'display','inline');
        currTile.cp = {x:tileWidth/2+randInt(width - tileWidth),y:tileHeight/2 + randInt(height - tileHeight)};
        redrawTile();
        updateStatus('Place this tile','Left/Right click to rotate. '+tiles.length+' tiles remaining' );
        $('#puzzleLink').show();
      } else {
        currTile = myNull;
        gameState = 3;
        updateStatus('Woohoo! You solved it.', '<a href="'+origUrl+'" target="_blank">'+makeTitle(title)+'</a> on Flickr.');
      }
    }

    function flip(edge) {
      return {x1 : edge.x2, y1:edge.y2, x2:edge.x1, y2:edge.y1, knot:edge.knot, dir:!edge.dir};
    }

    function createEdge(x1, y1, x2, y2, knotted) {
      return {
        x1 : tileWidth*x1, y1: tileHeight*y1,
        x2 : tileWidth*x2, y2: tileHeight*y2,
        knot : knotted && M.random() > 0.5,
        dir : M.random() > 0.5
      };
    }

    function createKnot(edge, horiz) {
      var knotStr = '', c1x, c2x, c1y, c2y, base;
      if (edge.knot) {
        if (horiz) {
          base = edge.x1;
          c1x = (edge.x2-base)*0.35 + base;
          c2x = (edge.x2-base)*0.65 + base;
          c1y = c2y = edge.y1;
        } else {
          base = edge.y1;
          c1y = (edge.y2-base)*0.35 + base;
          c2y = (edge.y2-base)*0.65 + base;
          c1x = c2x = edge.x1;
        }
        knotStr = 'L'+[c1x,c1y].join(' ') +
            'A'+[tileWidth/32, tileHeight/32, 0, 0, edge.dir? 1:0, c2x,c2y].join(' ');
      }
      return knotStr;
    }

    function makeTilePath(edges) {
      return 'M'+[edges.top.x1,edges.top.y1].join(' ') +
        createKnot(edges.top, true) +
        'L'+[edges.top.x2, edges.top.y2].join(' ') +

        createKnot(edges.right, false) +
        'L'+[edges.right.x2, edges.right.y2].join(' ') +

        createKnot(edges.bottom, true) +
        'L'+[edges.left.x1, edges.left.y1].join(' ') +

        createKnot(edges.left, false) +
        'z';
    }

  }

}

$(document).ready(function() {
  MA.init();
});
