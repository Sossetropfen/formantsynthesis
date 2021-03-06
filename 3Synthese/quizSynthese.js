var questions = [];
questions[0] = new Question("What does PSOLA stand for?", "Pitch Synchronous Overlap and Add", "Processing Software of Language Artificiality", "Periodic Synthesis on Length and Amplitude");
questions[1] = new Question("Which synthesis has a smaller footprint / inventory?", "Hidden Markov-based synthesis", "Unit-Selection synthesis", "They have a similar footprint");
questions[2] = new Question("What is the function of a formant filter?", " A Formant filters represent the formant resonances of the human vocal tract. They filter frequencies except those that coincide with the needed phoneme", "Formant filters set the excitation signal with a fundamental frequency", "Formant filters reduces noise and errors in the final speech signal output");
questions[3] = new Question("What type of synthesis is not based on the source-filter-model?", "Articulatory synthesis", "Formant synthesis", "LPC synthesis");
questions[4] = new Question("'Pitch modulation' is part of which model?", "Formant synthesis", "LPC synthesis", "Parametric synthesis with source-filter model");
questions[5] = new Question("Which synthesis tries to accurately simulate the vocal track?", "Articulatory synthesis", "Formant synthesis", "Parametric synthesis");

//SHUFFLE DAS ARRAY MIT DEN FRAGEN
for(let i = questions.length-1; i>0; i--){
  const j = Math.floor(Math.random() * i)
  const temp = questions[i]
  questions[i] = questions[j]
  questions[j] = temp
}

//alert(JSON.stringify(questions));


var currentScore = 0;
var scoreSignal = 0;
var randomQuestion;
var answers = [];
var counter = 0;


document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById('hid').style.visibility = "hidden";
  btnProvideQuestion();
});



function Question(question, rightAnswer, wrongAnswer1, wrongAnswer2) {
  this.question = question;
  this.rightAnswer = rightAnswer;
  this.wrongAnswer1 = wrongAnswer1;
  this.wrongAnswer2 = wrongAnswer2;
};


function shuffle(o) {
  for (var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};


function btnProvideQuestion() {


  if (counter > 4) {
    document.getElementById('quizinhalt').style.visibility = "hidden";
    document.getElementById('hid').style.visibility = "visible";
  }
  counter++;

  var randomNumber = Math.floor(Math.random() * questions.length);
  // Fragen k??nnnen auf diese Art doppelt drankommen, deswegen habe ich das Array einfach einmal zu beginn geshuffelt und dann werden die ersten 5 fragen aus dem geshuffelten array genommen
  //randomQuestion = questions[randomNumber]; //getQuestion
  randomQuestion = questions[counter-1];
  answers = [randomQuestion.rightAnswer, randomQuestion.wrongAnswer1, randomQuestion.wrongAnswer2];
  shuffle(answers);

  document.getElementById("question").innerHTML = randomQuestion.question;
  document.getElementById("answerA").value = answers[0];
  document.getElementById("answerA").innerHTML = answers[0];
  document.getElementById("answerB").value = answers[1];
  document.getElementById("answerB").innerHTML = answers[1];
  document.getElementById("answerC").value = answers[2];
  document.getElementById("answerC").innerHTML = answers[2];

}

function answerA_clicked() {
  var answerA = document.getElementById("answerA").value;
  checkAnswer(answerA);
}

function answerB_clicked() {
  var answerB = document.getElementById("answerB").value;
  checkAnswer(answerB);
}
function answerC_clicked() {
  var answerC = document.getElementById("answerC").value;
  checkAnswer(answerC);
}


function checkAnswer(answer) {

  if (answer == randomQuestion.rightAnswer) {
    currentScore++;
    btnProvideQuestion();

  } else {

    btnProvideQuestion();
  }
  document.getElementById("score").innerHTML = currentScore;
}

function uebertrageScore() {
  scoreSignal = currentScore;
  //alert(scoreSignal);
  sessionStorage.setItem("scoreSignal", scoreSignal);
}

document.getElementById('end').style.visibility = "visible";  //Hier ist glaube ich noch falsche id drin?
