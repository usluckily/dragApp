/**
 * author levi
 * url http://levi.cg.am
 */
$(function() {
	$(document).mousemove(function(e) {
		if (!!this.move) {
			var posix = !document.move_target ? {'x': 0, 'y': 0} : document.move_target.posix

			var xNum = e.pageX - posix.x + parseFloat(this.itemW), 
				yNum = e.pageY - posix.y + parseFloat(this.itemH)

			xNum = xNum > this.boxWidth ? this.boxWidth - parseInt(this.itemW) : 
				xNum <= parseInt(this.itemW) ? 0 : null
				
			yNum = yNum > this.boxHeight ? this.boxHeight - parseInt(this.itemH) : 
				yNum <= parseInt(this.itemH) ? 0 : null

			var callback = document.call_down || function() {
				$(this.move_target).css({
					'top': yNum === null ? (e.pageY - posix.y) : yNum,
					'left': xNum === null ? (e.pageX - posix.x) : xNum
				});
			};

			callback.call(this, e, posix);
		}
	}).mouseup(function(e) {
		if (!!this.move) {
			var callback = document.call_up || function(){};
			callback.call(this, e);
			$.extend(this, {
				'move': false,
				'move_target': null,
				'call_down': false,
				'call_up': false
			});
		}
	});

	// var $box = $('#box').mousedown(function(e) {
	//     var offset = $(this).offset();
	    
	//     this.posix = {'x': e.pageX - offset.left, 'y': e.pageY - offset.top};
	//     $.extend(document, {'move': true, 'move_target': this});
	// }).on('mousedown', '#coor', function(e) {
	//     var posix = {
	//             'w': $box.width(), 
	//             'h': $box.height(), 
	//             'x': e.pageX, 
	//             'y': e.pageY
	//         };
	    
	//     $.extend(document, {'move': true, 'call_down': function(e) {
	//         $box.css({
	//             'width': Math.max(30, e.pageX - posix.x + posix.w),
	//             'height': Math.max(30, e.pageY - posix.y + posix.h)
	//         });
	//     }});
	//     return false;
	// });
});