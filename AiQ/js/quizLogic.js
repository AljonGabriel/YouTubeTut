//User Input
const nameInput = document.getElementById('inputUserName');

//Display
const nameDisplay = document.getElementById('userName'),
  chosenSubjectDisplay = document.getElementById('chosenSubject'),
  chosenGradeDisplay = document.getElementById('chosenGrade'),
  scoreDisplay = document.getElementById('score'),
  timerDisplay = document.getElementById('timer'),
  explanationDisplay = document.getElementById('explanationDisplay'),
  scopeDisplay = document.getElementById('scope'),
  initialContainer = document.getElementById('initial');

//container
const quizBodyContainer = document.getElementById('quizBodyContainer'),
  quizScopeContainer = document.getElementById('quizScopeContainer'),
  quizHeaderContainer = document.getElementById('quizHeaderContainer'),
  quizQuestionsOptionsContainer = document.getElementById(
    'quizQuestionsOptionsContainer',
  );

//buttons
const answerButton = document.querySelectorAll('#answerButton'),
  startGame = document.getElementById('quizStartButton'),
  nextQuestion = document.getElementById('nextQuestion');

//Subjects
const subjects = document.getElementById('subjects');

//Grade
const grades = document.getElementById('gradeLevel');

let chosenSubject,
  chosenGrade,
  score = 0,
  currentQuestionIndex = 0,
  timer = 900,
  quizStart = false;

function getScope() {
  const userName = nameInput.value.trim(),
    selectedSubject = subjects.value,
    selectedGrade = grades.value;

  if (userName && selectedSubject !== '' && selectedGrade) {
    nameDisplay.innerHTML = userName;
    chosenSubjectDisplay.innerHTML = selectedSubject;
    chosenGradeDisplay.innerHTML = selectedGrade;
    chosenSubject = selectedSubject;
    chosenGrade = selectedGrade;
  } else {
    alert('Please fill out all fields');
    return;
  }

  quizScopeContainer.style.display = 'block';
  initialContainer.style.display = 'none';

  //Creating Scopes

  const scopeDescription = scopes[chosenSubject][chosenGrade].scopeDescription;
  const scopeDetails = scopes[chosenSubject][chosenGrade].scopeDetails;
  const overlAllScope = scopes[chosenSubject][chosenGrade].overallScope;

  const bulletPointsHTML = scopeDetails
    .map((detail) => `<li>${detail}</li>`)
    .join('');

  const scopeHTML = `
<p>${scopeDescription}</p>
<ul>
${bulletPointsHTML}
</ul>
<p>${overlAllScope}</p>

`;

  scopeDisplay.innerHTML = scopeHTML;
}

//Starting the game

startGame.addEventListener('click', () => {
  //Reseting all data before starting the game
  score = 0;
  currentQuestionIndex = 0;
  quizQuestionsOptionsContainer.innerHTML = '';

  quizScopeContainer.style.display = 'none';
  quizHeaderContainer.style.display = 'block';
  quizBodyContainer.style.display = 'block';

  //Shuffle Questions
  const shuffledQuestions = shuffleArray(
    questions[chosenSubject][chosenGrade].map((question) => ({
      ...question,
      options: shuffleArray(question.options),
    })),
  );

  //Save the shuffled questions in a global variable to use throughout the quiz
  window.shuffledQuestions = shuffledQuestions;
  countDownTimer = setInterval(countDownTimer, 600);
  createQuestions();
});

function createQuestions() {
  // Access the shuffled questions for the chosen subject and grade
  const shuffledQuestions = window.shuffledQuestions;

  if (
    shuffledQuestions &&
    shuffledQuestions.length > 0 &&
    currentQuestionIndex < shuffledQuestions.length
  ) {
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    // Create a div to hold the question and options
    const questionDiv = document.createElement('div');
    questionDiv.classList.add('quiz-question-container');

    //display the question
    const questionElement = document.createElement('h3');
    questionElement.classList.add('my-3');
    questionElement.textContent =
      currentQuestionIndex + 1 + '.) ' + currentQuestion.question;
    questionDiv.appendChild(questionElement);

    quizQuestionsOptionsContainer.appendChild(questionDiv);

    //Creating Answers Button
    const optionsDiv = document.createElement('div');
    optionsDiv.classList.add('quiz-options-container');

    const letters = ['a', 'b', 'c', 'd'];

    for (let i = 0; i < currentQuestion.options.length; i++) {
      const option = currentQuestion.options[i];
      const optionItemElement = document.createElement('button');
      optionItemElement.setAttribute('id', 'answerButton');
      optionItemElement.classList.add(
        'btn',
        'btn-outline-primary',
        'btn-lg',
        'm-1',
        'w-50',
        'answer-button',
      );

      optionItemElement.textContent = letters[i] + ') ' + option.text;

      optionItemElement.addEventListener('click', (e) => {
        handleOptionClick(currentQuestion, e);
      });
      optionsDiv.appendChild(optionItemElement);
    }
    quizQuestionsOptionsContainer.appendChild(optionsDiv);
    console.log('Create Question', currentQuestionIndex);
  }
}

//Handles the answers button
function handleOptionClick(currentQuestion, e) {
  const answerButtons = document.querySelectorAll('.answer-button');

  if (e.target.classList.contains('answer-button')) {
    answerButtons.forEach((button) => {
      // Disable all the answer buttons to prevent changing the answer
      button.disabled = true;
      if (button === e.target) {
        const selectedOptionText = e.target.textContent.split(') ')[1];
        const selectedOption = currentQuestion.options.find(
          (option) => option.text === selectedOptionText,
        );

        if (
          selectedOption &&
          selectedOption.hasOwnProperty('isCorrect') &&
          selectedOption.isCorrect
        ) {
          score++;
          // If the selected option is correct, turn the button green
          e.target.classList.add('border-success', 'border-3');
        } else {
          explanationContainer.style.display = 'block';
          explanationDisplay.classList.add('text-danger', 'my-3');
          explanationDisplay.innerHTML =
            getCorrectAnswerExplanation(currentQuestion);
          // If the selected option is wrong, turn the button red
          e.target.classList.add('border-danger', 'border-3');
        }
      } else {
        const buttonOptionText = button.textContent.split(') ')[1];
        const buttonOption = currentQuestion.options.find(
          (option) => option.text === buttonOptionText,
        );

        if (
          buttonOption &&
          buttonOption.hasOwnProperty('isCorrect') &&
          buttonOption.isCorrect
        ) {
          // For other buttons, if the option is correct, turn it green
          button.classList.add('border-success', 'border-3');
        } else {
          button.classList.add('disabled');
        }
      }
    });

    //Create a next button for next question
    const nextQuestionButton = document.createElement('button');
    nextQuestionButton.setAttribute('id', 'nextQuestion');
    nextQuestionButton.classList.add(
      'btn',
      'btn-outline-secondary',
      'btn-lg',
      'my-3',
    );

    nextQuestionButton.innerHTML = 'Next >';

    const nextQuestionContainer = document.getElementById(
      'nextQuestionContainer',
    );

    nextQuestionContainer.appendChild(nextQuestionButton);

    nextQuestionButton.addEventListener('click', () => {
      answerButtons.forEach((button) => {
        button.disabled = false;
      });

      quizQuestionsOptionsContainer.innerHTML = '';
      currentQuestionIndex++;
      explanationDisplay.innerHTML = '';
      explanationContainer.style.display = 'none';
      createQuestions();

      //Remove next button once clicked
      nextQuestionContainer.removeChild(nextQuestionButton);
    });
  }
}

function getCorrectAnswerExplanation(currentQuestion) {
  const explanation = currentQuestion.options.find(
    (option) => option.isCorrect,
  );
  return explanation.explanation;
}

//Timer functions

function countDownTimer() {
  timer--;
  timerDisplay.innerHTML = formatTime(timer);

  if (currentQuestionIndex === shuffledQuestions.length) {
    //stops timer and clear all fields
    clearInterval(countDownTimer);
    quizQuestionsOptionsContainer.innerHTML = '';
    quizHeaderContainer.style.display = 'none';
    quizBodyContainer.style.display = 'none';
    explanationContainer.innerHTML = '';
    getResult();
  } else if (timer === 0) {
    //stops timer and clear all fields
    clearInterval(countDownTimer);
    quizQuestionsOptionsContainer.innerHTML = '';
    quizHeaderContainer.style.display = 'none';
    quizBodyContainer.style.display = 'none';
    explanationContainer.innerHTML = '';
    getResult();
  }
}

function getResult() {
  const resultDisplay = document.getElementById('score');
  const resultContainer = document.getElementById('resultContainer');
  const feedbackDisplay = document.getElementById('feedback');

  resultContainer.style.display = 'block';
  resultDisplay.textContent = score;

  score >= 10
    ? (feedbackDisplay.textContent = 'You passed!')
    : (feedbackDisplay.textContent = 'You Failed!');
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsRemaining = seconds % 60;
  const formattedTime = `${minutes
    .toString()
    .padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;

  return formattedTime;
}

//SuffleArrayQuestion function
function shuffleArray(array) {
  const shuffleArray = array.slice();
  for (let i = shuffleArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]];
  }

  return shuffleArray;
}
