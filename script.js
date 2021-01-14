let questionNumber = 1;
let resultat = [];
let answer = [$('#answerA'), $('#answerB'), $('#answerC'), $('#answerD')];
let audio = $('audio');
let container = $('#container');
let checkBox = $('input');

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

            question(array[0]);


            $('#check').click(function () {
                console.log(resultat)
                if(resultat.length === questionNumber) {
                    questionNumber++;
                    nextQuestion(array[0]);
                }
            });

            checkBox.click(function () {
                if(resultat.length < questionNumber) {
                    if($(this).parent().children().get(2).innerHTML === array[0][0]["reponse"][0]["" + questionNumber + ""][0]["1"]) {
                        resultat.push(1);
                    }

                    else {
                        resultat.push(0);
                    }
                }

                if($(this).is(':checked')) {
                    $.each(checkBox, function () {
                        $(this).prop('disabled', true);
                    });

                    $(this).prop('disabled', false);
                }

                else {
                    $.each(checkBox, function () {
                        $(this).prop('disabled', false);
                    });

                    resultat.pop();
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

function answerR(item, x) {
    let numberR = random(4)
    if(answer[numberR].text() === "") {
        answer[numberR].text(item[0]["reponse"][0]["" + questionNumber + ""][0]["" + x + ""]);
    }

    else {
        answerR(item, x);
    }
}

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

function resetCheck() {
    $.each(checkBox, function () {
        $(this).prop('disabled', false).prop('checked', false);
    });
}