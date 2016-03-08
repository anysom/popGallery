;(function(w, _){
  'use strict';

  /*if underscore or lodash is not defined. Create fallback object with simple throttle method*/
  if(!_) {
    _ = {
      throttle: function(func, wait) {
        var timer = null;

        return function() {
          var context = this,
              args = arguments;

          if(timer === null) {
            timer = setTimeout(function() {
              func.apply(context, args);
              timer = null;
            }, wait);
          }
        };
      },
    };
  }

  var PopGallery = function(elem) {
    var galleryItems = elem.find('.pop-gallery__item');
    var cols;
    var self = this;

    var initialize = function () {
        //determine cols pr row
        var width = $(window).width();
        var colWidth = galleryItems[0].getBoundingClientRect().width;
        cols = Math.floor(width/colWidth);
    };

    initialize();

    window.addEventListener('resize', _.throttle(initialize, 50, { 'leading': true }));

    //Method for opening a subGallery
    var openSubgallery = function (clickedItem) {
        //index diff to item that should append container
        var thisIndex = clickedItem.index();

        clickedItem.addClass('pop-gallery__item--open');

        //if index is less than cols, calculate diff, else to modulus
        var modulus = (thisIndex + 1) % cols;
        var indexDiff = 0;
        if (modulus > 0) { //if modulus is 0, then it means that the clicked element is in the end of a row
            indexDiff = cols - modulus;
        }

        var targetIndex = thisIndex + indexDiff;

        if (targetIndex >= galleryItems.length) {
            targetIndex = galleryItems.length - 1;
        }

        var appendOnItem = $(galleryItems[targetIndex]);

        var subGallery = clickedItem.find('.pop-gallery__sub-gallery').clone();

        //generate arrow position class
        var side = 'left';
        if (modulus === 2 || cols === 1) {
            side = 'center';
        } else if (modulus === 0) {
            side = 'right';
        }
        var arrowPositionClass = 'arrow-pos-' + side;

        var galleryDisplaySection = $('<div class="pop-gallery__sub-gallery-display col-sm-12"></div>');
        galleryDisplaySection.append($('<div class="arrow-container ' + arrowPositionClass + '"></div>'));
        galleryDisplaySection.append(subGallery);

        setTimeout(function () {
            galleryDisplaySection.height(subGallery.outerHeight() + 20); //20 for bottom margin
            galleryDisplaySection.addClass('open');

        }, 1);

        appendOnItem.after(galleryDisplaySection);
    };

    //Toggle the specified item either open or closed.
    this.toggleItem = function(galleryItem) {
      //if the clicked item is already active, do nothing
      var galleryDisplaySection = $('.pop-gallery__sub-gallery-display');
      if (galleryDisplaySection.length > 0) {

          galleryDisplaySection.removeClass('open');
          galleryDisplaySection.height(0);


          //after it has animated out, remove it
          setTimeout(function () {
            galleryDisplaySection.remove();
          },600);

          //if the clicked item was not the one already open, open it after the previous one has closed.
          if (!galleryItem.hasClass('pop-gallery__item--open')) {
            setTimeout(function () {
              openSubgallery(galleryItem);
            },600);
          }

          galleryItems.removeClass('pop-gallery__item--open');
      } else {
          openSubgallery(galleryItem);
      }
    };

    //Add event listener to all gallery items to toggle items.
    galleryItems.click(function () {
      self.toggleItem($(this));
    });
  };

  w.PopGallery = PopGallery;
})(window, (typeof window._ === 'undefined' ? null : window._));
