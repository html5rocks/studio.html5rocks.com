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
 * Author: Michael Mahemoff
 *         Eric Bidelman <ericbidelman@chromiumg.org>
 */

$.fn.radioClass = function(klass) {
  return $(this).addClass(klass).siblings().removeClass(klass);
}
$.fn.invisible = function() {
  return $(this).css("visibility", "hidden");
}
$.fn.visible = function() {
  return $(this).css("visibility", "visible");
}


function PodcastPlayer(id, playButtonId) {
  var audio_ = document.getElementById(id);
  var playButton_ = document.getElementById(playButtonId);

  var status_ = function(message) {
    if (!message) {
      $('#progressbar').invisible();
    } else {
      $('#progressbar').html(message).visible();
    }
  };

  var loadFeed_ = function(url) {
    audio_.addEventListener("loadeddata", onLoadedData_, false);
    status_('Loading episodes ...');
    $('#episodes').empty();

    var feed = new google.feeds.Feed(url);
    feed.setResultFormat(google.feeds.Feed.MIXED_FORMAT);
    feed.setNumEntries(10);
    feed.load(function(result) {
      status_(null);
      if (result.error) {
        return;
      }
      result.feed.entries.forEach(function(entry, i) {
        var $enclosure = $(entry.xmlNode).find('enclosure');
        if (!$enclosure.size) {
          return;
        }
        var url = $enclosure.attr('url');
        if (!url || !url.length) {
          return;
        }
        if (i == 0) {
          $('<li><a href="' + url + '"> &raquo; Select an episode here &laquo;</a></li>').appendTo($('#episodes'));
        }
        var $li = $('<li><a href="' + url + '">' + entry.title + '</a></li>').appendTo($('#episodes'));
        if (localStorage[url]) {
          $li.addClass('played');
        }
      });
    });
  };

  var playAudio_ = function(url) {
    audio_.src = url;
    // unhook time updater to avoid a race condition: if it was still active,
    // it might set time to zero (for next played episode) before onLoadedData_()
    // is called, thus clobbering the localStorage record for the episode being
    // loaded
    audio_.removeEventListener('timeupdate', onTimeUpdate_, false);
    status_('Loading audio ...');
    audio_.load();
  };

  var onLoadedData_ = function() {
    status_(null);
    audio_.addEventListener('timeupdate', onTimeUpdate_, false);
    var startTime = localStorage[audio_.src];
    if (startTime) {
      audio_.currentTime = startTime;
    }
    audio_.play();
    $('#play_button').addClass('playing').text('Pause');

    return false;
  };

  var switchAudio_ = function($episodeLI) {
    var url = $episodeLI.children().attr('href');
    //delete localStorage[url];
    $episodeLI.radioClass('playing');
    $('#episodes li:first-child a').attr('href', url).text($episodeLI.text());
    playAudio_(url);
  };

  var onTimeUpdate_ = function() {
    localStorage[audio_.src] = audio_.currentTime;

    var currSec = parseInt(audio_.currentTime % 60);
    var currMin = parseInt((audio_.currentTime / 60) % 60);
    var totalSec = parseInt(audio_.duration % 60);
    var totalMin = parseInt((audio_.duration / 60) % 60);

    // "onEnded" should be triggered from an onended event, but it's not always reliable.playPause
    if (audio_.ended) {
      onEnded_();
    } else if (audio_.seeking) {
      status_('Seeking...')
    } else {
      status_([currMin >= 10 ? currMin : '0' + currMin, ':',
               currSec >= 10 ? currSec : '0' + currSec,
               ' / ',
               totalMin >= 10 ? totalMin : '0' + totalMin, ':',
               totalSec >= 10 ? totalSec : '0' + totalSec, ].join(''));
      $('#progressbar').css('width', (audio_.currentTime / audio_.duration) * 100 + '%');
    }
  };

  var onEnded_ = function() {
    audio_.removeEventListener("timeupdate", onTimeUpdate_, false);
    //delete localStorage[audio_.src];
    $(".playing").addClass("played");
    var $nextUnplayed = $(".playing ~ li").not(".played").eq(0);
    if ($nextUnplayed.length) {
      switchAudio_($nextUnplayed);
    }
  };

  var playPause_ = function(el) {
    if (audio_.paused) {
      audio_.play();
    } else {
      audio_.pause();
    }
    togglePlayButtonUI_();
  };

  var togglePlayButtonUI_ = function() {
    var $this = $('#play_button');

    if ($this.hasClass('disable')) {
      return;
    }

    if ($this.hasClass('playing')) {
      $this.removeClass('playing').text('Play');
    } else {
      $this.addClass('playing').text('Pause');
    }
  };

  var playNext_ = function() {
    onEnded_();
  };

  var seekIntoAudio_ = function(fraction) {
    audio_.currentTime = audio_.duration * fraction;
  };

  var setVolume_ = function(fraction) {
    audio_.volume = fraction;
  };

  return {
    loadFeed: loadFeed_,
    playAudio: playAudio_,
    switchAudio: switchAudio_,
    playNext: playNext_,
    playPause: playPause_,
    seekIntoAudio: seekIntoAudio_,
    setVolume: setVolume_
  };
}

