var IPADict = {};

function parseDict(lines) {
	console.log('TextToIPA: Beginning parsing to dict...');

	// Fill out the IPA dict by
	// 1) regexing the word and it's corresponding IPA translation into an array
	// 2) using the word as the key and the IPA result as the pair
	for (var i in lines) {
		var arr = lines[i].split(/\s+/g);
		IPADict[arr[0]] = arr[1];
	}

	console.log('TextToIPA: Done parsing.');
}

function loadDict(location){
	console.log('TextToIPA: Loading dict from ' + location + '...');

	if (typeof location !== 'string') {
		console.log('TextToIPA Error: Location is not valid!');
	} else {

		var txtFile = new XMLHttpRequest();

		txtFile.open('GET', location, true);

		txtFile.onreadystatechange = function() {
			// If document is ready to parse...
			if (txtFile.readyState == 4) {
				// And file is found...
				if (txtFile.status == 200 || txtFile.status == 0) {
					// Load up the ipa dict
					parseDict(txtFile.responseText.split('\n'));
				}
			}
		};

		txtFile.send(null);

	}
}

function dictLookup(word) {
	word = word.toLowerCase();
		// It is possible to return undefined, so that case should not be ignored
        if ( typeof IPADict[word] != 'undefined' ) {

		// Some words in english have multiple pronunciations (maximum of 4 in this dictionary)
		// Therefore we use a trick to get all of them

		// Resulting error, null since we don't know if this word has multiple
		// pronunciations
		var error = null;
		// Text, defaults to the IPA word. We build on this if multiple
		// pronunciations exist
		var text = IPADict[word];

		// Iterate from 1 - 3. There are no more than 3 extra pronunciations.
		for (var i = 1; i < 4; i++) {
			// See if pronunciation i exists...
            if ( typeof IPADict[word + '(' + i + ')'] != 'undefined' ) {
				// ...If it does we know that the error should be multi and the text
				// is always itself plus the new pronunciation
				error = 'multi';
				text += ' OR ' + IPADict[word + '(' + i + ')'];
				// ...Otherwise no need to keep iterating
			} else {
				break;
            }
		}

		// Return the new word
		return IPADict[word];

        // Otherwise the word isn't in the dictionary
        } else {
			return 'undefined';
        }
}

function convertText(str){
	var IPAOut;
	var IPAError;
	var IPAMulti;

	// Resulting array of IPA text words
	var IPAText = [];
	// Begin converting
	var englishTextArray = str.split(" ");
	for (var i in englishTextArray) {
		//console.log(englishTextArray[i]);
		var currentEl = replaceSigns(englishTextArray[i]);
		if (currentEl == ''){ //if the input is split by " " sometimes there is leftover elements which would be converted to zero, which we dont want
			console.log("upsi");  
		} else if (isDate(currentEl)){
			// Date if exactly 3 elements when split by ".": first a number between 1 and 31, then either a number with either 1 or 2 digits or a word with max 9 characters (september is the longest month with 9 characters), and then a number with < 4 digits 
			console.log("date");
			var date = currentEl.split("."); //ordinal number, string (string abreviation) or number -> string, number
			//day
			date[0] = ordinalInWord(date[0]);
			//month
			date[1] = convertMonth(date[1]);
			//year
            date[2] = date[2].split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g).filter(x => x !== "")[0];
			if (Math.abs(date[2]) < 2000){ // if < 2000 year abcd pronounced as: ab hundred cd
				if (date[2].length == 4){
					var h = date[2].substr(0,2); 
					var tens = date[2].substr(2);
					var h = (h>0)?intToWords(h) + ' hundred':'';
					var tens = intToWords(tens);
					date[2] = h + ' and ' + tens;
				} else {
					date[2] = intToWords(date[2]);
				}	
			} else {
				date[2] = intToWords(date[2]);
			}
			// ------------------------------------------
			textToIpa(date, IPAText);
		} else if (isTime(currentEl)){ // If input is two numbers divided by a ":" with first number in range 0 to 24 and the second number in range 0 to 60 then we suppose it is indicating a time
			//split input by ":" gives an array of e.g. [11,09]
			console.log("time");
			var time = currentEl.split(":");
            if(time[1].length == 3){
                time[1] = time[1].slice(0,2);
            }
			//convert both elements of array to strings
			var stunde = intToWords(time[0]).toString().split(" ");
			var minute = intToWords(time[1]).toString().split(" ");
			//push the hour to the output
			if (minute == "zero"){ // 6:00 -> six o'clock
				minute = "o'clock";
			} else if (time[1] < 10){ // 6:04 -> six oh four 
				minute = 'o ' + minute;
			}
			var timeArr = stunde.concat(minute);
			//---------------------------------------------
			textToIpa(timeArr, IPAText);
		} else if (currentEl.split(".").length == 2 && currentEl.split(".")[1] == '' && isNumber(currentEl.split(".")[0])) { // ordinal numbers
			console.log("ordinal number");
			var number = currentEl.split(".")[0];
			//console.log(intToOrdinaryNr(number));
			var ordNrArr = ordinalInWord(number).split(" ");
			//console.log(ordNrArr);
			textToIpa(ordNrArr, IPAText);
		} else if (currentEl.split(".").length == 2 && (isNumber(currentEl.split(".")[0]) || currentEl.split(".")[0] == '') && isNumber(currentEl.split(".")[1])){ //2 numbers divided by a . -> decimal numbers
			console.log("decimal");
			var decimalArr = currentEl.split(".");
			var el1 = intToWords(decimalArr[0]).toString().split(" "); //number before dot
			var el2 = decimalArr[1]; //number after dot
			var decimal = '';
			if (el1 != 'zero'){ // regular output of numbers for the number before the dot
				for (var a in el1){
					var d = (a==0)?el1[a]:' ' + el1[a];
					decimal = decimal + d;
				}
			}
			// push point to indicate the dot (doesnt matter if the first element was zero or not)
			decimal = decimal + ' point';
			for (var b in el2){ // for the decimals you need to output each digit on its own
				var c = (el2[b] == 0)?'o':intToWords(el2[b]);
				decimal = decimal + ' ' + c;
			}
			//console.log(decimal);
			textToIpa(decimal, IPAText);
		}
		// Lookup the word with TextToIPA. The first element will be the error
		// with the word, the second element will be the converted word itself.
		// We also strip punctuation and and case.
		else if (isNumber(currentEl)){
			console.log("number");
			var IPANumArr = intToWords(currentEl).toString().split(" ");
			//console.log(IPANumArr);
			textToIpa(IPANumArr, IPAText);
		} else if (currentEl.split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g).length > 1) {
			console.log("rest");
			var arr = currentEl.split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g);
			//console.log(arr);
			textToIpa(arr, IPAText);
		} else {
			//console.log(currentEl);
			textToIpa(currentEl, IPAText);
		}
	}
	return IPAText;
}

function textToIpa(str, IPAText) {
	if(typeof str == 'string'){
		str = str.split(" ");
	}
	for (var i in str){
		var c = str[i].split(" ");
		for (var h in c){
			var IPAWord = dictLookup(c[h].toLowerCase());
			//var IPAWord = dictLookup(c[h].toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));
            if (IPAWord == 'undefined'){
				var b = "";
				for (var j = 0; j < c[h].length; j++){
					b += dictLookup(c[h][j].toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));
				}
				IPAWord = b;
			}
			IPAText.push(IPAWord);
		}
	}
	//console.log("converting word " + str);
}

function isNumber(searchValue) {
    var found = searchValue.search(/^(\d*\.?\d*)$/);
    //Change to ^(\d*\.?\d+)$ if you don't want the number to end with a . such as 2.
    //Currently validates .2, 0.2, 2.0 and 2.
    if(found > -1) {
        return true;
    }
    else {
        return false;
    }
}

function intToWords(rawValue){
	if(rawValue == 0){
		return 'zero';
	} else {
	var num=rawValue,
		a=['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '],
		b=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'],
		c=['thousand', 'million',''],
		words='';

	num=('000000000'+num.toString()).substr(-9) // Make number into a predictiable nine character string
		.match(/.{3}/g); // Split string into chuncks of three numbers then reverse order of returned array

	for(var i=0;i<c.length;i++){
		var n=num[i],
			str='';
		str+=(words!='')?' '+c[c.length-1-i]+' ':'';
		str+=(n[0]!=0)?(a[Number(n[0])]+'hundred '):'';
		n=n.substr(1);
		str+=(n!=0)?((str!='')?'and ':'')+(a[Number(n)]||b[n[0]]+' '+a[n[1]]):'';
		words+=str;
	}
	return words.replace(/ +/g,' ').replace(/ $/,'');
	}
}

function isDate(input){
    if (input.split(".").length == 3 || (input.split(".").length == 4 && input.split(".")[3] == "")){
        var posDate = input.split(".");
        if(!isNaN(posDate[0]) && posDate[0] > 0 && posDate[0] < 32
           && ((!isNaN(posDate[1]) && posDate[1] < 13 && posDate[1] > 0 && posDate[1].length < 3) || (['january','jan','february','feb','march','mar','april','apr','may','june','jun','july','jul','august','aug','september','sep','october','oct','november','nov','december','dec'].includes(posDate[1].toLowerCase())))
           && !isNaN(posDate[2].split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g).filter(x => x !== "")[0]) && posDate[2].split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g).filter(x => x !== "")[0].length < 5){
                return true;   
            }
        return false;
    }
}

function isTime(input){
    if (input.split(":").length == 2 || input.split(":").length == 3 && input.split(":")[2] == ""){
        var t = input.split(":");
        if (!isNaN(t[0]) && t[0] > 0 && t[0] < 25){
            if (!isNaN(t[1]) && t[1] >= 0 && t[1] < 61){
               return true;
            }
            if(t[1].length == 3){
                if (!isNaN(t[1].slice(0,2)) && (t[1][2] == "." || t[1][2] == "!" || t[1][2] == "?") && t[1].slice(0,2) >= 0 && t[1].slice(0,2) < 61){
                    return true;
                }
                return false;
            }
            return false;
        }
        return false;
    }
    return false;
}

function convertMonth(month){
	var ret;
	if (month == '1' || month == '01' || month == 'jan'){
		return 'january';
	} else if (month == '2' || month == '02' || month == 'feb'){
		return 'february';
	} else if (month == '3' || month == '03' || month == 'mar'){
		return 'march';
	} else if (month == '4' || month == '04' || month == 'apr'){
		return 'april';
	} else if (month == '5' || month == '05' || month == 'may'){
		return 'may';
	} else if (month == '6' || month == '06' || month == 'jun'){
		return 'june';
	} else if (month == '7' || month == '07' || month == 'jul'){
		return 'july';
	} else if (month == '8' || month == '08' || month == 'aug'){
		return 'august';
	} else if (month == '9' || month == '09' || month == 'sep'){
		return 'september';
	} else if (month == '10' || month == '10' || month == 'oct'){
		return 'october';
	} else if (month == '11' || month == '11' || month == 'nov'){
		return 'november';
	} else if (month == '12' || month == '12' || month == 'dec'){
		return 'december';
	}
	return month;
}

function ordinalInWord(cardinal) {
    var ordinals = [ 'zeroth', 'first','second','third','fourth', 'fifth','sixth','seventh','eighth','nineth','tenth','eleventh','twelfth','thirteenth','fourteenth','fifteenth','sixteenth','seventeenth','eighteenth','nineteenth','twentieth'];
    var tens = {
        20: 'twenty',
        30: 'thirty',
        40: 'forty',
		50: 'fifty',
		60: 'sixty',
		70: 'seventy',
		80: 'eighty',
		90: 'ninety',
		100: 'hundred'
    };
    var ordinalTens = {
        30: 'thirtieth',
        40: 'fortieth',
        50: 'fiftieth',
		60: 'sixtieth',
		70: 'seventieth',
		80: 'eightieth',
		90: 'ninetieth',
		100: 'hundredth',
		1000: 'thousandth',
		1000000: 'millionth',
    };
    if( cardinal <= 20 ) {                    
        return ordinals[ cardinal ];
    }

    if( cardinal % 10 === 0 ) {
        return ordinalTens[ cardinal ];
    }
	
    return tens[ cardinal - ( cardinal % 10 ) ] + ' ' + ordinals[ cardinal % 10 ];
}

function replaceSigns(string){ // converts signs to words
	string = string.replace('-',' minus ');
	string = string.replace('+',' plus ');
	string = string.replace('&',' and ');
	string = string.replace('%',' percent ');
	string = string.replace('@',' at ');
	string = string.replace('#',' hash tag ');
	string = string.replace('%',' percent ');
	string = string.replace('<',' less than ');
	string = string.replace('>',' greater than ');
	string = string.replace('=',' equals ');
	string = string.replace('(',' opening parenthesis ');
	string = string.replace(')',' closing parenthesis ');
	return string;
}