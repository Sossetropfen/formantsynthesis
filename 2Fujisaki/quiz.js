var questions = [];
questions[0] = new Question("What propertie counts to prosody?", "intonation", "pronounciation", "grammar");
questions[1] = new Question("What aspects of prosody are set up via linear filters in the Fujisaki-Model?", " accent and speech commands", "fundamental and bias commands", "accent and speech control mechanics");
questions[2] = new Question("What does the F<sub>b</sub>-contour represent?", " the bias level", "the fundamental frequency", "the accent commands");
questions[3] = new Question("Wich of the following variables is irrelevant in the Fujisaki-Model-formular?", " end of ith phrase command T<sub>1j</sub>", "amplitude of jth accent command, A<sub>aj</sub>", "ceiling level of jth accent command, γ<sub>j</sub>");
questions[4] = new Question("Choose the right definition for the term 'prosody':", " Under the term of prosody we can differentiate between such features as stress, intonation, tempo, pausing and rythm.", "Under the term of prosody we can differentiate between features of orthographatic description of speech sound and writing.", "Under the term of prosody we can differentiate between such features as pronounciation and right grammar.");
questions[5] = new Question("Prosodic-Features can be represented by a F<sub>0</sub>?", "contour", "spectrum", "nothing");

//SHUFFLE DAS ARRAY MIT DEN FRAGEN
for(let i = questions.length-1; i>0; i--){
  const j = Math.floor(Math.random() * i)
  const temp = questions[i]
  questions[i] = questions[j]
  questions[j] = temp
}

//alert(JSON.stringify(questions));

var currentScore = 0;
var scoreProsody = 0;
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
  // Fragen könnnen auf diese Art doppelt drankommen, deswegen habe ich das Array einfach einmal zu beginn geshuffelt und dann werden die ersten 5 fragen aus dem geshuffelten array genommen
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
  scoreProsody = currentScore;
  //alert(scoreProsody);
  sessionStorage.setItem("scoreProsody", scoreProsody);
}

document.getElementById('end').style.visibility = "visible";  //Hier ist glaube ich noch falsche id drin?
