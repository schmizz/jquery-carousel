(function($) { 
	$.fn.carousel = function(o) {
		o = $.extend({
			btnPrev: null,
			btnNext: null,
			btnGo: null,
			mouseWheel: false,
			auto: 3000,

			speed: 2000,
			easing: null,

			vertical: false,
			circular: false,
			size: 1,
			start: 0,
			scroll: 2,

			preSlideCallback: null,
			postSlideCallback: null
		}, o || {});

		// Returns the element collection. Chainable.
		return this.each(function() {
			var running  = false;
			var prepared = false;
			
			var carousel = $(this);
			var list     = $('ul', carousel);
			var items    = $('li', list);
			
			var nofItems   = items.length;
			var itemWidth  = items.width();
			var itemHeight = items.height();
			
			var current  = o.start;
			var direction = 1;
			
			var oneness = o.vertical ? itemHeight : itemWidth;
			
			var dimProp = o.vertical ? 'height' : 'width';
			var posProp = o.vertical ? 'top' : 'left';
			
			var wait = setInterval(function() {
				var complete = false;
				$('img', carousel).each(function(i, it) {
					complete = it.complete;
				});
				
				if(complete) {
					clearTimeout(wait);
					setup();
					if(o.auto && prepared) {
						setInterval(function() {
							slide(current + o.scroll);
						}, o.auto + o.speed);
					}
				}
			}, 500);
			
			console.log(prepared);
			
			function setup() {
				console.log('setup');
				
				// Sets dimension of carousel
				carousel.css(dimProp, (oneness * o.scroll)+'px');

				// Sets dimension of list
				list.css(dimProp,  (nofItems * oneness)+'px');
				
				console.log(itemWidth, itemHeight);
				
				items.css({
					'width' : itemWidth,
					'height' : itemHeight,
					'float' : o.vertical ? 'none' : 'left'
				});
				
				// Show the carousel
				carousel.css('visibility', 'visible');
				
				// We are ready for take-of
				prepared = true;
			}

			function getVisibleOnes() {
				return li.slice(current).slice(0, o.size);
			};
			
			function slide() {
				if (running) {
					console.log('already running');
					return;
				} else {
					running = true;
				}
				
				if (o.preSlideCallback) {
					o.preSlideCallback.call(this, getVisibleOnes());
				}
				
				if (o.circular) {
				}
				else {
					// Toggle direction
					if(direction == 1 && current == (nofItems - o.scroll)) {
						direction = -1;
						console.log('toggle direction: '+direction);
					} 
					else if (direction == -1 && current == 0) {
						direction = 1;
						console.log('toggle direction: '+direction);
					}
					
					// Determine current item
					current = direction > 0 
						? current + o.scroll 
						: current - o.scroll;
				}

				console.log('goto:'+current);

				// We ned to define the style this way, otherwise we cant use dynamic property names.
				var listStyle = {};
				listStyle[posProp] = -(current * oneness);
				
				list.animate(listStyle, o.speed, o.easing, function() {
					if(o.postSlideCallback) {
						o.postSlideCallback.call(this, getVisibleOnes());
					}
						
					running = false;
				});
			}
		});
	};
})(jQuery);