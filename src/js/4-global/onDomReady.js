$(document).on("ready", function () {

    function initSlider(){
        // console.log('page-single');
        console.log('init-slider');
        // SLIDER
        slider = $('.slider').slick({
            infinite: true,
            autoplay: true,
            // autoplaySpeed: 5000,
            autoplaySpeed: 6000000,
            speed: 2000,
            prevArrow: $('.prev'),
            nextArrow: $('.next'),
            dots: false,
            rows: 0,
        });

        // $('.next').click(function() {
        //     $('.slider').slick("slickNext");
        // });
        // $('.prev').click(function() {
        //     $('.slider').slick("slickPrev");
        // });
    }

    function _calculateYear(){
        // Return today's date and time
        var currentTime = new Date();   
        // returns the year (four digits)
        var year = currentTime.getFullYear();    
        return year;
    }

    function _calculateAge(birthday) { // birthday is a date
        var year = _calculateYear();
        var difference = year - birthday;
        // console.log(difference);
        $("#age").text(difference);
    }

    function initMainSocial(){
        $(window).on("scroll", function(){
            if($( "#main_social" ).length ){
                var mst = $('#main_social').position().top;
                if(mst > $(window).scrollTop() && mst < $(window).scrollTop() + $(window).height()){
                    setTimeout(function(){
                        $('.tohide').addClass('toshow');
                    }, 200);
                }
                else {
                    $('.tohide').removeClass('toshow');
                }
            }
        });
    }

    function initProgressBar(){
        // ANIMATE PROGRESS BAR
        var getMax = function(){
            var toreturn = $(document).height() - $(window).height();
            return toreturn;
        }
        var getValue = function(){
            return $(window).scrollTop();
        }
        if ('max' in document.createElement('progress')) {
            
            // Browser supports progress element
            var progressBar = $('progress');

            $(document).on('scroll', function(){
                // Set the Max attr for the first time
                progressBar.attr({ max: getMax() });
                // On scroll only Value attr needs to be calculated
                progressBar.attr({ value: getValue() });
            });
            $(window).resize(function(){
            // On resize, both Max/Value attr needs to be calculated
                progressBar.attr({ max: getMax(), value: getValue() });
            });

        } else {
            var progressBar = $('.progress-bar'),
                max = getMax(),
                value, width;
            var getWidth = function() {
            // Calculate width in percentage
                value = getValue();
                width = (value/max) * 100;
                width = width + '%';
                return width;
            }
            var setWidth = function(){
                progressBar.css({ width: getWidth() });
            }

            $(window).on('load resize', function(){
            // Need to reset the Max attr
                $("progress").css({'top': $("header").outerHeight() + 8});
                max = getMax();
                setWidth();
            });
        }
    }

    function initScrollers(){
        $(window).on("scroll", function(){
            if($(this).scrollTop() > 50) {
                $("header").addClass("scroll");
                $(".controllers").addClass("visible");
                $("progress").css("opacity", 1);
            } else {
                $("header").removeClass("scroll");
                $(".controllers").removeClass("visible");
                $("progress").css("opacity", 0);
            }
             // ANIMATE LOGO
            var theta = $(window).scrollTop() / 15;
            $(".header_branding_logo").css({ transform: "rotate(" + theta + "deg)" });
        });
    }

    // INIT
    // if ($('body').hasClass('home')) initHome();
    // if ($('body').hasClass('page-single')) initSlider();
    // if ($('body').hasClass('page-single')) initPhotoSwipeGallery();
    if ($('.slider').length) initSlider();
    if ($('#age').length) _calculateAge(1984);
    if ($('#main_social').length) initMainSocial();
    if ($('progress').length) initProgressBar();
    initScrollers();

    function setTopPadding() {
        $("main").css("padding-top", $("header").outerHeight()+"px");
    }

    $( window ).on( "load scroll resize", function() {
        setTopPadding();
    });

    // calculate the specific offset for the scroll function
    var headeronscroll = 56;
    var specificoffset = (headeronscroll - $('.wowo').outerHeight()) / 2 ;
    // on click on specific titles trigger to scroll
    $('.wowo').click(function () {
        var wowpoffset = $(this).offset().top;
        // console.log(offset);
        $('html,body').stop().animate({
            scrollTop: wowpoffset - specificoffset
        }, 1000);
        // $(this).css('text-align','right').delay(2000)
        return false;
    });

    $(".totop").click(function(event){
        event.preventDefault();
        $("html, body").animate({scrollTop: 0}, 600);
    });

    // Select all links with hashes
    $('a[href*="#"]')
        // Remove links that don't actually link to anything
          .not('[href="#"]')
          .not('[href="#0"]')
          .click(function(event) {
          // On-page links
          if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
              // Figure out element to scroll to
              var target = $(this.hash);
              target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
              // Does a scroll target exist?
              if (target.length) {
              // Only prevent default if animation is actually gonna happen
                  event.preventDefault();
                  $('html, body').animate({
                      scrollTop: target.offset().top - specificoffset
                  }, 1000, function() {
                      // Callback after animation
                      // Must change focus!
                      var $target = $(target);
                      $target.focus();
                      if ($target.is(":focus")) { // Checking if the target was focused
                          return false;
                      } else {
                          $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                          $target.focus(); // Set focus again
                      };
                  });
              }
          }
      });

    // INIT LAZYLOAD
    $('img.lazy').lazyload({
        threshold: '100%',
        effect: 'fadeIn',
        // load: resize,
        placeholder: ''
    });

});