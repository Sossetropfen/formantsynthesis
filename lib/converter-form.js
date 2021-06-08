//  converter-form.js

//  This file creates a global ConverterForm object containing the public convert
//  and all additional helper methods.

//  The purpose of this program is to act as a tool to help interface with the text-to-ipa.js program
//  by providing a method to take text input from a text field, output the translated
//  IPA text, and output any error messages if need be.

//      ConverterForm.convert(inID, outID, errID)
//          inID        This is the name of the unique ID (string) of a text area
//                      that input should be read from. The program will find
//                      the first instance of this ID and assume it contains
//                      the english text to convert.
//          outID       This is the name of the unique ID (string) of a text area
//                      that out should be sent to. The program will find
//                      the first instance of this ID and assume it is a text
//                      field, and output the translated IPA there.
//          errID       This is the name of the unique ID (string) of a div that errors
//                      will be output to. The div will automatically be filled
//                      with a paragraph <p> element, and existing data in it
//                      will be overwritten
//          This method produces no output, but will take the value of the inID
//          text area and convert that text with TextToIPA. If the inID, or
//          TextToIPA object do not exist or are not objects, the method will
//          not do anything

// ESLint settings. We want console logging and some problems may exist
// with undefined objects (ConverterForm, TextToIPA) but we check for these
// beforehand
/* eslint-disable no-console, no-undef */

// Create a ConverterForm object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.
if (typeof ConverterForm !== 'object') {
	ConverterForm = {};
}

(function () {

	'use strict';

	// Error messages
	// Store error messages in the ConverterForm Object for accessing later without
	// polluting the global namespace.
	
	// Error message if a word entered is not defined within the dictionary
	if (typeof ConverterForm._undefMsg !== 'string') {
		ConverterForm._undefMsg = 'Some words you have entered cannot be found in the IPA dictionary.';
	}

	// Error message if a word has multiple pronunciations and therefore multipe IPA translations
	if (typeof ConverterForm._multiMsg !== 'string') {
		ConverterForm._multiMsg = 'Some words you have entered have multiple pronunciations in english. These differences are seperated with "OR"';
	}

	// Functions

	// Update a specific div by placing a paragraph inside it
	if (typeof ConverterForm._updateParagraph !== 'function') {
		ConverterForm._updateParagraph = function (inID, text) {
			document.getElementById(inID).innerHTML = '<p>' + text + '</p>';
		};
	}

	// Update a text area by replacing its contents
	if (typeof ConverterForm._updateTextArea !== 'function') {
		ConverterForm._updateTextArea = function (inID, text) {
			document.getElementById(inID).value = text;
		};
	}

	if (typeof ConverterForm.convert !== 'function') {
		ConverterForm.convert = function (inID, outID, errID) {
			// inID must point to a possibly valid ID
			if (typeof inID !== 'string') {
				console.log('TextToIPA Error: "inID" called in "ConverterForm.convert()" is not a valid ID"');
			// We want TextToIPA to exist, or we can't lookup words
			} else if (typeof TextToIPA !== 'object') {
				console.log('TextToIPA Error: "TextToIPA" object not found. Is "text-to-ipa.js" included before ConverterForm.convert() is ran?');
			} else {
				// Reset the error messages
				var currentErrorMessage = '';
				var currentMultiMessage = '';

				// Resulting array of IPA text words
				var IPAText = [];
				// Get the input from the inID as an array of strings that are each individual word
				var englishTextArray = document.getElementById(inID).value.split(/\s+/g);
				// Begin converting
				for (var i in englishTextArray) {
					//console.log(englishTextArray[i]);
					var currentEl = replaceSigns(englishTextArray[i]);
					if (currentEl == ''){ //if the input is split by " " sometimes there is leftover elements which would be converted to zero, which we dont want
						console.log("upsi");  
					} else if (currentEl.split(".").length == 3 && !isNaN(currentEl.split(".")[0]) && currentEl.split(".")[0] > 0 && currentEl.split(".")[0] < 32 && ((!isNaN(currentEl.split(".")[1]) && currentEl.split(".")[1] < 13 && currentEl.split(".")[1] > 0 && currentEl.split(".")[1].length < 3) || ['january','jan','february','feb','march','mar','april','apr','may','june','jun','july','jul','august','aug','september','sep','october','oct','november','nov','december','dec'].includes(currentEl.split(".")[1].toLowerCase())) && currentEl.split(".")[2].length < 5){
						// Date if exactly 3 elements when split by ".": first a number between 1 and 31, then either a number with either 1 or 2 digits or a word with max 9 characters (september is the longest month with 9 characters), and then a number with < 4 digits 
						console.log("date");
						var date = currentEl.split("."); //ordinal number, string (string abreviation) or number -> string, number
						//day
						date[0] = ordinalInWord(date[0]);
						//month
						date[1] = convertMonth(date[1]);
						//year
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
						//console.log(date);
						textToIpa(date, IPAText, currentErrorMessage)
					} else if (currentEl.split(":").length == 2 && !isNaN(currentEl.split(":")[0]) && !isNaN(currentEl.split(":")[1]) && currentEl.split(":")[0] >= 0 && currentEl.split(":")[0] < 25 && currentEl.split(":")[1] >= 0 && currentEl.split(":")[1] < 61){ // If input is two numbers divided by a ":" with first number in range 0 to 24 and the second number in range 0 to 60 then we suppose it is indicating a time
						//split input by ":" gives an array of e.g. [11,09]
						console.log("time");
						var time = currentEl.split(":");
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
						//console.log(timeArr);
						textToIpa(timeArr, IPAText, currentErrorMessage)
					} else if (currentEl.split(".").length == 2 && currentEl.split(".")[1] == '' && isNumber(currentEl.split(".")[0])) { // ordinal numbers
						console.log("ordinal number");
						var number = currentEl.split(".")[0];
						//console.log(intToOrdinaryNr(number));
						var ordNrArr = ordinalInWord(number).split(" ");
						//console.log(ordNrArr);
						textToIpa(ordNrArr, IPAText, currentErrorMessage)
					}
					else if (currentEl.split(".").length == 2 && (isNumber(currentEl.split(".")[0]) || currentEl.split(".")[0] == '') && isNumber(currentEl.split(".")[1])){ //2 numbers divided by a . -> decimal numbers
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
						textToIpa(decimal, IPAText, currentErrorMessage)
					}
					// Lookup the word with TextToIPA. The first element will be the error
					// with the word, the second element will be the converted word itself.
					// We also strip punctuation and and case.
					else if (isNumber(currentEl)){
						console.log("number");
						var IPANumArr = intToWords(currentEl).toString().split(" ");
						//console.log(IPANumArr);
						textToIpa(IPANumArr, IPAText, currentErrorMessage)
					} else if (currentEl.split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g).length > 1) {
						console.log("rest");
						var arr = currentEl.split(/[ !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g);
						//console.log(arr);
						textToIpa(arr, IPAText, currentErrorMessage);
					} else {
						//console.log(currentEl);
						textToIpa(currentEl, IPAText, currentErrorMessage)
					}

				}

				// Turn the array to a sentence, and update the DOM
				IPAText = IPAText.join(' ');

				// Make sure the output ID exists before outputting IPA
				if (typeof outID === 'string') {
					ConverterForm._updateTextArea(outID, IPAText);
				} else {
					console.log('TextToIPA Warning: "outID" in "ConverterForm.convert()" is not a string, skipping IPA output.');
				}

				// Make sure the error exists before outputting errors
				if (typeof errID === 'string') {
					ConverterForm._updateParagraph(errID, currentErrorMessage + ' ' + currentMultiMessage);
				} else {
					console.log('TextToIPA Warning: "errID" in "ConverterForm.convert()" is not a string, skipping error output.');
				}
			}
		};
	}
}());

function textToIpa(str, IPAText, currentErrorMessage) {
	if(typeof str == 'string'){
		str = str.split(" ");
	}
	for (var i in str){
		var c = str[i].split(" ");
		for (var h in c){
			var IPAWord = TextToIPA.lookup(c[h].toLowerCase().replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' '));
			if (typeof IPAWord.error === 'undefined') {
				currentErrorMessage = ConverterForm._undefMsg;
				// Push plain text instead of IPA
				IPAText.push(c[h]);
				// If it does, see how many pronunciations there are (TextToIPA knows this, and sends all pronunciations regardless)
			} else if (IPAWord.error === 'multi') {
				currentErrorMessage = ConverterForm._multiMsg;
				IPAText.push(IPAWord.text);
				// Otherwise just push the converted word
			} else {
				IPAText.push(IPAWord.text);
			}
		}
	}
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

function intToOrdinaryNr(rawValue){
	if(rawValue == 0){
		return 'ˈzɪər oʊθ';
	} else {
	var aOrd=['','first ','second ','third ','fourth ', 'fifth ','sixth ','seventh ','eighth ','nineth ','tenth ','eleventh ','twelfth ','thirteenth ','fourteenth ','fifteenth ','sixteenth ','seventeenth ','eighteenth ','nineteenth ']
	var bOrd=['','','twentieth','thirtieth','fortieth','fiftieth','sixtieth','seventieth','eightieth','ninetieth']
	var cOrd=['thousandth', 'millionth','']
		
	var num=rawValue,
		a=['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '],
		b=['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'],
		c=['', 'thousand','million'],
		words='';

	num=('000000000'+num.toString()).substr(-9) // Make number into a predictiable nine character string
		.match(/.{3}/g); // Split string into chuncks of three numbers then reverse order of returned array

	var l = false;
	for(var i=0;i<c.length;i++){
		var n = num[c.length-1-i];
		var str = '';
		var d = n.substr(1); //get last 2 elements from n
		if (l == true){
			str += (d!=0)?((str!='')?'and ':'')+(a[Number(d)]||b[d[0]]+' '+a[d[1]]):'';
			str=(n[0]!=0)?(a[Number(n[0])]+'hundred ')+str:''+str;
			str+=(str!='')?' '+c[i]+' ':'';
			words = str + words;
		} else {
			if (Number(d) != 0){
				str += (d!=0)?((str!='')?'and ':'')+(aOrd[Number(d)]||b[d[0]]+' '+aOrd[d[1]]):'';
				str=(n[0]!=0)?(a[Number(n[0])]+'hundred ')+str:''+str;
			} else {
				str=(n[0]!=0)?(a[Number(n[0])]+'hundredth ')+str:''+str;
			}
			
			str+=(str!='')?' '+c[i]+' ':'';
			words = str + words;
			l = true;
		}
		
		
	}
	return words.replace(/ +/g,' ').replace(/ $/,'');
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

function convertMonth(month){
	var ret;
	if (month == '1' || month == '01' || month == 'jan'){
		ret = 'january';
	} else if (month == '2' || month == '02' || month == 'feb'){
		ret = 'february';
	} else if (month == '3' || month == '03' || month == 'mar'){
		ret = 'march';
	} else if (month == '4' || month == '04' || month == 'apr'){
		ret = 'april';
	} else if (month == '5' || month == '05' || month == 'may'){
		ret = 'may';
	} else if (month == '6' || month == '06' || month == 'jun'){
		ret = 'june';
	} else if (month == '7' || month == '07' || month == 'jul'){
		ret = 'july';
	} else if (month == '8' || month == '08' || month == 'aug'){
		ret = 'august';
	} else if (month == '9' || month == '09' || month == 'sep'){
		ret = 'september';
	} else if (month == '10' || month == '10' || month == 'oct'){
		ret = 'october';
	} else if (month == '11' || month == '11' || month == 'nov'){
		ret = 'november';
	} else if (month == '12' || month == '12' || month == 'dec'){
		ret = 'december';
	}
	return ret;
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
