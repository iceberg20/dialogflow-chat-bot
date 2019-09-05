//var accessToken = "3698561f1dae4563a203193d65dbff8d";
var accessToken = "439ce00732d147ac85977f7e516a306e";
var baseUrl = "https://api.api.ai/v1/";

$(document).ready(function () {
    $("#input-chat").keypress(function (e) {
        console.log(e)
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) {
            e.preventDefault();
            send();
        }
    });
    $("#rec").click(function (event) {
        switchRecognition();
    });
});

var recognition;

function startRecognition() {
    recognition = new webkitSpeechRecognition();
    recognition.onstart = function (event) {
        updateRec();
    };
    recognition.onresult = function (event) {
        var text = "";
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
        }
        setInput(text);
        stopRecognition();
    };
    recognition.onend = function () {
        stopRecognition();
    };
    recognition.lang = "en-US";
    recognition.start();
}

function stopRecognition() {
    if (recognition) {
        recognition.stop();
        recognition = null;
    }
    updateRec();
}

function switchRecognition() {
    if (recognition) {
        stopRecognition();
    } else {
        startRecognition();
    }
}

function setInput(text) {
    $("#input-chat").val(text);
    send();
}

function updateRec() {
    $("#rec").text(recognition ? "Stop" : "Speak");
}

function send() {
    function estaDemorando() {
        setBotResponse("Vejo que você ainda não resolver seu problema. Você pode entrar em contato com o suporte pelo número 5555-5555");
    }
    setTimeout(estaDemorando, 1000 * 60 * 8);
    var text = $("#input-chat").val();
    $("#input-chat").val("");
    setUserResponse(text);
    $.ajax({
        type: "POST",
        url: baseUrl + "query?v=20150910",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + accessToken
        },
        data: JSON.stringify({ query: text, lang: "en", sessionId: "somerandomthing" }),

        success: function (data) {
            console.log(data);
            var res = data.result.fulfillment.messages;
            let qtd_msg = data.result.fulfillment.messages.length;
            console.log(`qtd_msg = ${qtd_msg}`);
            for (index = 0; index < qtd_msg; ++index) {
                let imageUrl = res[index].imageUrl;
                console.log(res[index].type);
                if (res[index].type == 2) {
                    console.log("Type 2");
                } else if (res[index].type == 3 && imageUrl != undefined) {
                    if (imageUrl == "https://i.ibb.co/4J5qZBf/help2.jpg") {
                        setBotIconImageResponse(imageUrl);
                    } else {
                        setBotImageResponse(imageUrl);
                    }
                } else {
                    setBotResponse(res[index].speech);
                }
            }
            console.log(res);
        },
        error: function () {
            setBotResponse("Internal Server Error");
        }
    });
}

// function setBotIconImageResponse(url) {
//     let res = `<div> <img id="chat-bot-icon-image" src="${url}" alt="img" face" height="70" width="70" onclick="chatBotOpenModal()"> </div>`;
//     $("#response").append(res);
// }

// function setBotImageResponse(url) {
//     let res = `<div> <img id="chat-bot-image" src="${url}" alt="img" face" height="200" width="200" onclick="chatBotOpenModal()"> </div>`;
//     $("#response").append(res);
//     let res_link = `<div> <a href="${url}"> Imagem Amplianda </a> </div>`;
//     $("#response").append(res_link);
// }

function setUserResponse(res) {
    res = "<article class='message message-user'><p>" + res + "</p> </article>";
    $("#response").append(res);
}

function setBotResponse(res) {
    res = "<article class='message message-bot'><p>" + res + "</p> </article>";
    $("#response").append(res);
    scrollDiv();
}
// Auto Scroll Div Chat bot
function scrollDiv() {
    var el;
    if ((el = document.getElementById('response')) && ('undefined' != typeof el.scrollTop)) {
        el.scrollTop = 0;
        el.scrollTop = 5000;
    }
}