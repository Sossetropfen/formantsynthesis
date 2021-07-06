 
  /* -------------------------Variables and arrays-------------------------*/
  var bias = 0;  // bias level of instance - Fb
  var phr_cnt = 0; // Number of phrase-controls - I
  var acc_cnt = 0; // Number of accent-controls - J
  const A_pi = []; // magnitude levels of phrase commands - A_pi
  const A_aj = []; // amplitude levels of accent commands 
  const T_0i = []; // Instants of prhase commands
  const T_1j = []; // onsets of accent commands
  const T_2j = []; // ends of accent commands
  const a_i = []; // nat. angular freq. of phrase-control to phrase commands
  const b_j = []; // nat. angular freq. of accent-control to accent commands
  const v_j = []; // ceilling level of accent component in accent commands
/*-------------------------Variables end----------------------------------*/


/*-------------------------Event Listeners--------------------------------*/
document.getElementById("btn_bias").addEventListener("click", BiasInput);
document.getElementById("btn_phrase").addEventListener("click", PhraseInput);
document.getElementById("btn_accent").addEventListener("click", AccentInput);
document.getElementById("btn_plot").addEventListener("click", PlotOutput);

/*-------------------------Event Listeners end----------------------------*/


/*-------------------------Functions--------------------------------------*/
function BiasInput(){
      bias = document.getElementById("bias_input").value;
      document.getElementById("btn_bias").innerText = "change bias level";
      //alert(bias);
};

function PhraseInput(){
      phr_cnt++;
      A_pi.push(document.getElementById("A_pi_input").value);
      T_0i.push(document.getElementById("T_0i_input").value);
      a_i.push(document.getElementById("a_i_input").value);
      document.getElementById("btn_phrase").innerText = "add phrase command";
      //alert(phr_cnt);
      //alert(A_pi);
      //alert(T_0i);
      //alert(a_i);
};

function AccentInput(){
      acc_cnt++;
      A_aj.push(document.getElementById("A_aj_input").value);
      T_1j.push(document.getElementById("T_1j_input").value);
      T_2j.push(document.getElementById("T_2j_input").value);
      b_j.push(document.getElementById("b_j_input").value);
      v_j.push(document.getElementById("v_j_input").value);
      document.getElementById("btn_accent").innerText = "add accent command";
      //alert(acc_cnt);
      //alert(A_ai);
      //alert(T_1j);
      //alert(T_2j);
      //alert(b_j);
      //alert(v_j);
};

function PlotOutput(){

      //here's some stuff to do!!!!!!!!!!!!!!!!!!!!!!

};
/*-------------------------Functions end----------------------------------*/
