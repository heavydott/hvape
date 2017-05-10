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
var $pgvg = $('#pgvg');

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

	if(count < 5) {
		$aromaUl.append('<li class="aroma-' + (count + 1) + '">' +
							'<span class="aroma-span">' + (count + 1) + '.</span>' +
							'<input type="text" class="aroma-input-' + (count + 1) + '" placeholder="input here">' +
							'<span class="aroma-span">drops</span>' +
						'</li>');
	}

	if(count == 4) {
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
		result[0] += parseInt($inputs[i].value);

		result.push(parseInt($inputs[i].value));
	}

	console.log(result);

	return result;
}

// For calculate
function calc(volume, nic, pgvg, countForAroma) {
	var pg, nicotine, vg;
	var result = [];
	var drops = calcDrops();
	var dfa = parseInt($('#vForAroma button.on').val());
	var cof;

	// VG
	var vgCof = 1 - pgvg / 100;

	vg = volume * vgCof;

	// PG
	var pgFull = volume - vg;

	cof = dfa / volume;

	nicotine = volume * (nic / 10) / 100 ;

	for(var i = 0; i < drops.length; i++) {
		drops[i] = Math.round(drops[i] / cof);
	}

	var aroma = drops[0] / 33;

	pg = pgFull - nicotine - aroma;

	result.push(pg);
	result.push(nicotine);
	result.push(vg);
	result.push(drops);

	return result;
}

// Calculate
$play.on('click', function(e) {
	var volume = parseInt($volume.val());
	var nic = parseInt($nic.val());
	var pgvg = parseInt($pgvg.val());
	var countForAroma = parseInt($('#vForAroma .on').val());

	if(isNumeric(volume) && isNumeric(nic) && isNumeric(pgvg) && isNumeric(countForAroma)) {
		$main.removeClass('active');
		$result.addClass('active');

		var res = calc(volume, nic, pgvg, countForAroma);

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
							'<td>Nicotine</td>' +
							'<td>' + (Math.round(res[1] * 100) / 100) + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td>VG</td>' +
							'<td>' + (Math.round(res[2] * 100) / 100) + '</td>' +
						'</tr>' +
						'<tr>' +
							'<td>Aroma</td>' +
							'<td>' + aromaStr + '</td>' +
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
});