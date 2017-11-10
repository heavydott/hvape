var $vForAroma = $('#vForAroma');
var $vForAromaBtns = $('#vForAroma button');
var $aroma = $('#aroma');
var $aromaUl = $('#aroma ul');
var $aromaAdd = $('#aromaAdd');
var $play = $('#play');
var $main = $('#main');
var $result = $('#result');
var $volume = $('#volume');
var $nic = $('#nic');
var $nicbase = $('#nicbase');
var $pgvg = $('#pgvg');
var $message = $('#message');
var $clear = $('#clear');

preDraw(JSON.parse(localStorage.getItem("hvape")));
preDrawDrops(JSON.parse(localStorage.getItem("hvapedrops")));

// Draw from local storage
function preDraw(data) {
	if(data) {
		// VOLUME
		$('#volume option').each(function() {
			$(this).removeAttr('selected');
		});

		$('#volume option[value=' + parseInt(data[0]) + ']').attr('selected', true);

		// NICOTINE'S BASE
		$('#nicbase option').each(function() {
			$(this).removeAttr('selected');
		});

		$('#nicbase option[value=' + parseInt(data[1]) + ']').attr('selected', true);

		// NICOTINE
		$('#nic option').each(function() {
			$(this).removeAttr('selected');
		});

		$('#nic option[value=' + parseInt(data[2]) + ']').attr('selected', true);

		// PG/VG
		$('#pgvg option').each(function() {
			$(this).removeAttr('selected');
		});

		$('#pgvg option[value=' + parseInt(data[3]) + ']').attr('selected', true);

		// DROPS FOR AROMA
		$('#vForAroma button').each(function() {
			$(this).removeClass('on');
			if($(this).val() == parseInt(data[4])) {
				$(this).addClass('on');
			}
		});
	}
}

// Draw flavors from local storage
function preDrawDrops(data) {
	if(data) {
		$('#aroma .aroma-input-1').val(data[0]);
		for(var i = 1; i < data.length; i++) {
			$aromaUl.append('<li class="aroma-' + (i + 1) + '">' +
								'<input type="text" class="aroma-input-' + (i + 1) + '" value="' + data[i] + '" placeholder="in">' +
								'<span class="aroma-span">drops</span>' +
							'</li>');
		}

								// '<span class="aroma-span">' + (i + 1) + '.</span>' +

		if(data.length == 8) {
			$aromaAdd.attr('disabled', 'disabled');
		}

		console.log(data);
	}
}

// Choose volume for drops
$vForAroma.on('click', 'button', function(e) {
	e.target.classList.add('on');

	$vForAromaBtns.each(function(i, el) {
		if(el != e.target) {
			el.classList.remove('on');
		}
	});
});

// Add aroma
$aromaAdd.on('click', function(e) {
	var count = $aromaUl.find('li').length;

	if(count < 8) {
		$aromaUl.append('<li class="aroma-' + (count + 1) + '">' +
							'<input type="text" class="aroma-input-' + (count + 1) + '" placeholder="in">' +
							'<span class="aroma-span">drops</span>' +
						'</li>');
	}

	if(count == 7) {
		$aromaAdd.attr('disabled', 'disabled');
	}
});

// Check if number
function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Calculate drops
function calcDrops() {
	var result = [];
	var drops = 0;

	result.push(drops);

	var $inputs = $('#aroma ul li input[type=text]');

	for(var i = 0; i < $inputs.length; i++) {
		if(isNumeric(parseInt($inputs[i].value))) {
			result[0] += parseInt($inputs[i].value);

			result.push(parseInt($inputs[i].value));
		}
	}

	return result;
}

// For calculate
function calc(volume, nic, pgvg, countForAroma) {
	var pg, nicotine, vg;
	var result = [];
	var drops = calcDrops();
	var dfa = parseInt($('#vForAroma button.on').val());
	var cof;
	var mess = '';
	var data = [];
	var dataDrops = [];

	// DATA

	data.push(volume);
	data.push(parseInt($nicbase.val()));
	data.push(nic);
	data.push(pgvg);
	data.push(countForAroma);

	var $inputs = $('#aroma ul li input[type=text]');

	console.log(isNumeric(parseInt('20')));

	for(var i = 0; i < $inputs.length; i++) {
		if(isNumeric(parseInt($inputs[i].value))) {
			dataDrops.push(parseInt($inputs[i].value));
		}
	}

	// VG
	var vgCof = 1 - pgvg / 100;

	vg = volume * vgCof;

	// PG
	var pgFull = volume - vg;

	cof = dfa / volume;

	nicotine = volume * (nic / 10) / parseInt($nicbase.val());

	for(var i = 0; i < drops.length; i++) {
		drops[i] = Math.round(drops[i] / cof);
	}

	var aroma = drops[0] / 33;

	if(!aroma || aroma <= 0) {
		console.log(drops[0]);
		mess = '<p>No flavors</p>';
		$message.html(mess).addClass('active');

		return false;
	}

	pg = pgFull - nicotine - aroma;

	if(pg > 0) {
		$message.removeClass('active');
		result.push(pg);
		result.push(nicotine);
		result.push(vg);
		result.push(drops);

		localStorage.setItem('hvape', JSON.stringify(data));
		localStorage.setItem('hvapedrops', JSON.stringify(dataDrops));

		return result;
	} else {
		mess = '<p>Too many flavors</p>'
		$message.html(mess).addClass('active');

		return false;
	}
}

// Calculate
$play.on('click', function(e) {
	var volume = parseInt($volume.val());
	var nic = parseInt($nic.val());
	var pgvg = parseInt($pgvg.val());
	var countForAroma = parseInt($('#vForAroma .on').val());

	if(isNumeric(volume) && isNumeric(nic) && isNumeric(pgvg) && isNumeric(countForAroma)) {
		var res = calc(volume, nic, pgvg, countForAroma);

		if(res) {
			$main.removeClass('active');
			$result.addClass('active');

			var aromaStr = '';

			for(var i = 1; i < res[3].length; i++) {
				if(i % 2 == 0) {
					aromaStr += '<p class="even">' + i + '. <b>' + res[3][i] + '</b>dr / <b>' + (Math.round(res[3][i] * 100 / 33) / 100) + '</b>ml</p>';
				} else {
					aromaStr += '<p class="odd">' + i + '. <b>' + res[3][i] + '</b>dr / <b>' + (Math.round(res[3][i] * 100 / 33) / 100) + '</b>ml</p>';
				}
			}

			$result.html('<table>' +
							'<tr>' +
								'<td>PG</td>' +
								'<td>' + (Math.round(res[0] * 100) / 100) + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td>Nic</td>' +
								'<td>' + (Math.round(res[1] * 100) / 100) + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td>VG</td>' +
								'<td>' + (Math.round(res[2] * 100) / 100) + '</td>' +
							'</tr>' +
							'<tr>' +
								'<td>Aroma</td>' +
								'<td style="padding: 5px;">' + aromaStr + '</td>' +
							'</tr>' +
						'</table>' +
						'<button id="return">RETURN</button>');

			// Calculate
			$('#return').on('click', function(e) {
				console.log('1');
				$result.removeClass('active');
				$main.addClass('active');
			});
		}
	}
});

$clear.on('click', function(e) {
	preDraw([60, 54, 20, 30, 30]);

	var $inputs = $('#aroma ul li');

	$('#aroma ul li').each(function(i) {
		if(i == 0) {
			$(this).find('input').val('');
		} else {
			$(this).remove();
		}
	});

	$aromaAdd.removeAttr('disabled');

	localStorage.removeItem('hvape');
	localStorage.removeItem('hvapedrops');
});