
/* -------------------------Variables and arrays-------------------------*/
var bias = 0;  // bias level of instance - Fb
var phr_cmd = 0; // Number of phrase-commands - I
var acc_cmd = 0; // Number of accent-commands - J
var A_pi = []; // magnitude levels of phrase commands - A_pi
var A_aj = []; // amplitude levels of accent commands 
var T_0i = []; // Instants of prhase commands
var T_1j = []; // onsets of accent commands
var T_2j = []; // ends of accent commands
var a_i = []; // nat. angular freq. of phrase-control to phrase commands
var b_j = []; // nat. angular freq. of accent-control to accent commands
var v_j = []; // ceilling level of accent component in accent commands

/*-------------------------Variables end----------------------------------*/


/*-------------------------Functions--------------------------------------*/
function BiasInput(){
      bias = document.getElementById("bias_input").value;
      document.getElementById("btn_bias").innerText = "change bias level";
}

function getBias(){
    return bias;
}

function changeBias(n){
    bias = n;
}

function PhraseInput(){
      phr_cmd++;
      A_pi.push(document.getElementById("A_pi_input").value);
      T_0i.push(document.getElementById("T_0i_input").value);
      a_i.push(document.getElementById("a_i_input").value);
      document.getElementById("btn_phrase").innerText = "add phrase command";
}

function getPhrases(){
    return [phr_cmd, A_pi, T_0i, a_i];
}

function AccentInput(){
      acc_cmd++;
      A_aj.push(document.getElementById("A_aj_input").value);
      T_1j.push(document.getElementById("T_1j_input").value);
      T_2j.push(document.getElementById("T_2j_input").value);
      b_j.push(document.getElementById("b_j_input").value);
      v_j.push(document.getElementById("v_j_input").value);
      document.getElementById("btn_accent").innerText = "add accent command";
}

function getAccents(){
    return [acc_cmd, A_aj, T_1j, T_2j, b_j, v_j];
}

function setAccPhr(a, b, c, d, e, f, g, h){
    phr_cmd = a.length;
    A_pi = a;
    T_0i = b;
    a_i = c;
    acc_cmd = d.length;
    A_aj = d;
    T_1j = e;
    T_2j = f;
    b_j = g; 
    v_j = h;
}

function loadSampleValues(){
    phr_cmd = 3;
    acc_cmd = 5;
    A_pi = [0.4, 0.5, 0.4];
    T_0i = [0, 1.8, 3.8];
    bias = 1;
    A_aj = [0.2,0.3,0.4,0.5,0.3];
    T_1j = [0.25,1.25,2.25,3,4.6];
    T_2j = [0.75,1.75,2.6,3.2,4.85];
    v_j = [100,100,100,100,100];

    a_i = [3,3,3];
    b_j = [10,10,10,10,10];
}

function reset(){
    bias = 0;
    phr_cmd = 0;
    acc_cmd = 0;
    A_pi = [];
    A_aj = [];
    T_0i = [];
    T_1j = [];
    T_2j = [];
    a_i = [];
    b_j = [];
    v_j = [];
    document.getElementById("btn_phrase").innerText = "submit phrase command";
    document.getElementById("btn_accent").innerText = "submit accent command";
    document.getElementById("btn_bias").innerText = "enter bias level";
}

function fct(t){
    if (bias <= 0){
        return accentCmds(t)+phraseCmds(t);
    }
    return Math.log(bias)+accentCmds(t)+phraseCmds(t);
}

function accentCmds(t){
    var accentCommands = 0;
	for (var j = 0; j < acc_cmd; j++){
        var h = G_a_j(j,t - T_1j[j]) - G_a_j(j,t - T_2j[j]);
        accentCommands += A_aj[j]*h;			
    }
    return accentCommands;
}

function phraseCmds(t){
	var phraseCommands = 0;
    for (var i = 0; i < phr_cmd; i++){
		var h = t - T_0i[i];
		phraseCommands += A_pi[i]*G_p_i(i,h);
	}
	return phraseCommands;
}

function G_p_i(i,t){
    if (t <= 0){
        return 0;
    } else {
		return Math.pow(a_i[i],2)*t*Math.exp(-a_i[i]*t);
	}
}

function G_a_j(j,t){
    if (t<0){
        return 0;
    }
	return Math.min(v_j[j], 1 - (1 + b_j[j]*t) * Math.exp(- b_j[j] * t));
}
  
function accentCmdsDraw(t){
    var val = 0; 
	for(var j = 0; j < acc_cmd; j++){
		val += rechteck(T_1j[j],T_2j[j],t,A_aj[j]);
	}
	return val;
}
  
function phraseCmdsDraw(t){
	var val = 0;
	for(var i = 0; i < phr_cmd; i++){
		val += dirac(T_0i[i],A_pi[i],t);
	}
	return val;
}

// wert für dirac impuls an der stelle p mit amplitude a zum zeitpunkt t
function dirac(p,a,t){
    if (Math.round(t * 100) / 100 == p){
		return a;
	}
    return 0
}
  
//start s, ende e, zeitpunkt t, amplitude a
function rechteck(s, e, t, a){
	if (t == s || t == e){
		return a/2;
	} else if (t < s || t > e){
		return 0; 
	} else {
		return a;
	}
}

/*-------------------------Functions end----------------------------------*/
