var questions = [];
   questions[0] = new Question("What is 1/4 of 100?", "25", "24", "23");
   questions[1] = new Question("What color is blood?", "Red", "White", "Green");
   questions[2] = new Question("What color is grass?", "Green", "White", "Red");
   questions[3] = new Question("How many legs does a spider have?", "8", "6", "4");
   questions[4] = new Question("Who is the king of the Netherlands?", "Willem-Alexander", "Willem-Alexzelf", "Willem-Alexniemand");
   questions[5] = new Question("What is 2-2?", "0", "2", "4");
   var currentScore = 0;
   var randomQuestion;
   var answers = [];
   
  
   document.addEventListener("DOMContentLoaded", function(event) {
    
     btnProvideQuestion();
   });

   
   
   function Question(question,rightAnswer,wrongAnswer1,wrongAnswer2) {
       this.question = question;
       this.rightAnswer = rightAnswer;
       this.wrongAnswer1 = wrongAnswer1;
       this.wrongAnswer2 = wrongAnswer2;
   };
   
   
   function shuffle(o) {
       for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
       return o;
   };


   function btnProvideQuestion() { 
     
    var randomNumber = Math.floor(Math.random()*questions.length);
    randomQuestion = questions[randomNumber]; //getQuestion
     answers = [randomQuestion.rightAnswer, randomQuestion.wrongAnswer1, randomQuestion.wrongAnswer2];
     shuffle(answers);
     
     document.getElementById("question").innerHTML= randomQuestion.question;
     document.getElementById("answerA").value= answers[0];
     document.getElementById("answerA").innerHTML= answers[0];
     document.getElementById("answerB").value= answers[1];
     document.getElementById("answerB").innerHTML= answers[1];
     document.getElementById("answerC").value= answers[2];
     document.getElementById("answerC").innerHTML= answers[2];
   
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



document.getElementById('end').style.visibility="visible";

