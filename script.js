let questionNumber = 1;
let resultat = [];
let answer = [$('#answerA'), $('#answerB'), $('#answerC'), $('#answerD')];
let audio = $('audio');
let container = $('#container');
let checkBox = $('input');
let score = $('#score span');
let randomN = random(3)

// Button for begin game
$('#begin').click(function () {
    audio[0].play();
    audio[0].loop;
    audio.prop("volume", 0.1);

    container.fadeOut(500);

    setTimeout(function () {
        $('#home').css('display', 'none');
        $('#questionDiv').css('display', 'flex');
        container.fadeIn(500);
    },500)

    $.ajax({
        url: "question.json",
        method: "GET",
        dataType: "json"
    })

        .done(function (response) {
            let array = [];
            $.each(response, function () {
                array.push($(this));
            });

            question(array[randomN]);

            $('#check').click(function () {
                if(questionNumber < 10) {
                    if(resultat.length === questionNumber) {
                        questionNumber++;
                        nextQuestion(array[randomN]);
                    }
                }

                else {
                    endGame(array[randomN]);
                }
            });

            checkBox.click(function () {
                if($(this).is(':checked')) {
                    if(resultat.length === questionNumber) {
                        resultat.pop();
                    }

                    $.each(checkBox, function () {
                        $(this).prop('checked', false);
                    });

                    $(this).prop('checked', true);

                    if(resultat.length < questionNumber) {
                        if($(this).parent().children().get(2).innerHTML === array[randomN][0]["reponse"][0]["" + questionNumber + ""][0]["1"]) {
                            resultat.push(1);
                        }

                        else {
                            resultat.push(0);
                        }
                    }
                }

                else {
                    if(resultat.length === questionNumber) {
                        resultat.pop();
                    }
                }
            });
        });
});

/**
 * Function for creat a random number
 */
function random(number) {
    return Math.trunc(Math.random() * number);
}

/**
 * Function for actualize the quiz
 * @param item
 */
function question(item) {
    resetCheck();

    $('#questionNumber').text("Question " + questionNumber);
    $('#question').text(item[0]["question"][0]["" + questionNumber + ""]);

    for(let x = 1; x <= 4; x++) {
        answerR(item, x);
    }
}

/**
 * Function for choice the random place for answers
 * @param item
 * @param x
 */
function answerR(item, x) {
    let numberR = random(4)

    if(answer[numberR].text() === "") {
        answer[numberR].text(item[0]["reponse"][0]["" + questionNumber + ""][0]["" + x + ""]);
    }

    else {
        answerR(item, x);
    }
}

/**
 * Function for animate and go to the next question
 * @param item
 */
function nextQuestion(item) {
    container.fadeOut(500);

    setTimeout(function () {
        for(let x = 0; x < 4; x++) {
            answer[x].text("")
        }

        question(item)
        container.fadeIn(500);
    },500)
}


/**
 * Function for enabled checkbox
 */
function resetCheck() {
    $.each(checkBox, function () {
        $(this).prop('disabled', false).prop('checked', false);
    });
}

/**
 * Function for animate and go to score and correction for the questionnaire
 * @param item
 */
function endGame(item) {
    let number = 0;
    $.each($('#answerQ p'), function () {
        if(resultat[number] === 1) {
            score.text(parseFloat(score.text()) + 1)
            $(this).text("Question " + (number + 1) + ": Bravo");
            $(this).css('color', "green");
            number++;
        }

        else {
            $(this).text("Question " + (number + 1) + ": dommage, la réponse était " + item[0]["reponse"][0]["" + (number + 1) + ""][0]["1"]);
            $(this).css('color', "red");
            number++;
        }
    });

    container.fadeOut(500);

    setTimeout(function () {
        $('#questionDiv').css('display', 'none');
        $('#resultDiv').css('display', 'flex');

        container.fadeIn(500);
    },500)
}