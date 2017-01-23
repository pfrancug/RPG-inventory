/* ---------- ---------- TESTS ---------- ---------- */
$.each(['armor', 'helmet', 'talisman', 'weapon', 'gloves', 'shoes'], function(index, value) {
	$('.' + value).dblclick(function() {

		if ($(this).parent().hasClass('inv')) {
			if ($('.pre-' + value).find('.' + value).length != 0) {
				$('.pre-' + value).children('.item').appendTo('.inv:empty:first').parent('.inv').removeClass('empty').addClass('full');
			}
			if ($('.pre-' + value).find("*").length == 0) {
				$(this).parent('.inv').removeClass('full').addClass('empty');
				$(this).appendTo('.pre-' + value);
			};
		}
		if ($(this).parent().hasClass('pre-item')) {
			$(this).appendTo('.inv:empty:first').parent('.inv').removeClass('empty').addClass('full');

		}
		countSpace();
		getID();
		preImage();
	});
});

/* ---------- ---------- Document Ready ---------- ---------- */

$(document).ready(function() {
	countSpace();
	getID();
	preImage();
});

/* ---------- ---------- get ID ---------- ---------- */

function getID() {

	/* ----- items in inv ----- */
	var elementsInInv = [];
	$(".part.inv").children('.item').each(function() {
		elementsInInv.push($(this).attr('id'));
	});
	elementsInInvNum = $('.part.inv').children('.item').length;
	console.log('Elements in inventory: ' + elementsInInv);
	console.log(elementsInInvNum + ' elements in inventory');

	/* ----- items in use ----- */
	var set = {
		helmet: 0,
		talisman: 0,
		armor: 0,
		weapon: 0,
		gloves: 0,
		shoes: 0,
	};

	$.each(['armor', 'helmet', 'talisman', 'weapon', 'gloves', 'shoes'], function(index, value) {
		set[value] = $('.pre-' + value).children('.item').attr('id');
	});
	console.log("Set contains of: " + JSON.stringify(set));
}

/* ---------- ---------- slots ---------- ---------- */

function countSpace() {
	partnum = 0;
	$(".part").each(function(index) {
		if (($(this).find("*").length == 0) && !$(this).hasClass('locked') && !$(this).hasClass('sell') && !$(this).hasClass('pre')) {
			partnum += 1
		}
	});
	var Space = $('.part').length - $('.locked').length - $('.sell').length - $('.pre').length;
	var takenSpace = Space - partnum;
	$('.inventory-space').children('.space-value').text(takenSpace + '/' + Space);
	if (takenSpace / Space <= 0.5) {
		$('.BuyMoreSlots').css('animation', '4s buyMoreSlotsGreen infinite');
	}
	if (takenSpace / Space > 0.5 && takenSpace / Space < 0.75) {
		$('.BuyMoreSlots').css('animation', '4s buyMoreSlotsYellow infinite');
	}
	if (takenSpace / Space >= 0 && takenSpace / Space >= 0.75) {
		$('.BuyMoreSlots').css('animation', '4s buyMoreSlotsRed infinite');
	}
}

/* ---------- ---------- locked slots ---------- ---------- */

$('.locked').hover(function() {
	$(this).children('.fa').removeClass('fa-lock');
	$(this).children('.fa').addClass('fa-unlock-alt');
}, function() {
	$(this).children('.fa').removeClass('fa-unlock-alt');
	$(this).children('.fa').addClass('fa-lock');
});

/* ---------- ---------- tooltip ---------- ---------- */

$('.item').tooltip({
	track: true,
	content: function() {
		return $(this).children('.tip').html();
	},
	tooltipClass: 'tip'
});
$('.BuyMoreSlots').tooltip({
	track: true,
	content: 'Buy More Slots',
	tooltipClass: 'tip'
});

/* ---------- ---------- pre-item img ---------- ---------- */
/*
function bgImg(tentutaj, item) {
	if ($(tentutaj).hasClass(item)) {
		$('.pre-' + item).addClass('highlighted');
	};
	if ($(tentutaj).parent().hasClass("pre-" + item)) {
		$(tentutaj).parent().css("background-image", "url(http://piotrfrancug.pl/projects/plugin/img/pre-" + item + ".png)");
	};
};
	//		bgImg(this, $(this).attr('class').split(" ")[1]);
*/

function preImage() {
	$.each(['armor', 'helmet', 'talisman', 'weapon', 'gloves', 'shoes'], function(index, value) {
		if ($('.pre-' + value).find("*").length != 0) {
			$('.pre-' + value).css("background-image", "url('')");
		}
		if ($('.pre-' + value).find("*").length == 0) {
			$('.pre-' + value).css("background-image", "url(http://piotrfrancug.pl/projects/plugin/img/pre-" + value + ".png)");
		}
	});
}

/* ---------- ---------- item drag ---------- ---------- */

$('.item').draggable({
	cancel: '.tooltip',
	start: function() {
		$('.tip').hide();
		$('.pre-' + $(this).attr('class').split(" ")[1]).addClass('highlighted');
		$(this).parent('.inv').removeClass('full').addClass('empty');

	},
	stop: function() {
		$('.part').removeClass('highlighted');
		$(this).parent('.inv').removeClass('empty').addClass('full');

	},
	revert: 'invalid',
	opacity: 0.9,
	cursor: 'move'
});

/* ---------- ---------- drop function ---------- ---------- */

goldvalue = 0;

function drop(event, ui) {
	$(this).append(ui.draggable.css({
		top: 0,
		left: 0
	}));
	ui.draggable.position({
		my: "center",
		at: "center",
		of: $(this),
		using: function(pos) {
			$(this).animate(pos, 100, "easeOutBack");
		}
	});
	if ($(this).hasClass('sell')) {
		$(this).children('.item').remove();
		goldvalue += 1;
		$('.gold-value').text(goldvalue);
	}
	countSpace();
	getID();
	preImage();
}

/* ---------- ---------- droppable inventory ---------- ---------- */

$('.inv').droppable({
	accept: function(element) {
		return ($(this).find("*").length == 0)
	},
	drop: drop
});

/* ---------- ---------- droppable set ---------- ---------- */

$.each(['armor', 'helmet', 'talisman', 'weapon', 'gloves', 'shoes'], function(index, value) {
	$('.pre-' + value).droppable({
		accept: function(element) {
			return ($(this).find("*").length == 0 && (element.hasClass(value)));
		},
		drop: drop
	});
});

/* ---------- ---------- droppable sell ---------- ---------- */

$('.part.sell').droppable({
	accept: '.item',
	drop: drop
});