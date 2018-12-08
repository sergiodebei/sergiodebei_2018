$(document).ready(function() {

    $('body').on('click', '.lazy-video', placeLazyVideo);
  
  });
  
  function placeLazyVideo(){
    var video = $($(this).children('.lazy-video__embed').text());
    var autoplay = '?showinfo=0&controls=1&autoplay=1';
    if(video.attr('src').indexOf('?') > -1) {
      autoplay = '&showinfo=0&controls=1&autoplay=1';
    }
    video.attr('src', video.attr('src') + autoplay);
    $(this).prepend(video);
    $(this).addClass('lazy-loaded');
  }
  