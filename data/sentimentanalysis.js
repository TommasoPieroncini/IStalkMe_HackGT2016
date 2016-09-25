var data = ' ';
var datachunks = [''];
var langSupport = false;
var dataByYear = {};

var sentimentByYear = {};
var angerByYear = {};
var disgustByYear = {};
var fearByYear = {};
var joyByYear = {};
var sadnessByYear = {};

function testSentiment(property) {
    FB.api(property, function(response) {
        logdata(response);
        if(response.paging && response.paging.next){
            testSentiment(response.paging.next);
        } else {
            for (var key in dataByYear) {
                datachunks = chunkString(dataByYear[key], 2000);
                for (var j=0;j<datachunks.length;j++) {
                    //console.log(datachunks[j]);
                    analyzeSentiment(key, datachunks[j]);
                }
            }
        }

    });
}

function logdata(response) {
    var obj = response.data;
    for (var i = 0; i<obj.length; i++) {
        var date = new Date(obj[i].created_time);
        var year = 1900 + date.getYear();
        if (typeof(obj[i].message) != "undefined") {
            if (dataByYear[year]) {
                dataByYear[year] += obj[i].message;
            } else {
                dataByYear[year] = obj[i].message;
            }
        }
    }
}

function analyzeSentiment(year, str) {
    $.ajax({
        url: 'https://access.alchemyapi.com/calls/text/TextGetTextSentiment',
        dataType: 'jsonp',
        jsonp: 'jsonp',
        type: "post",
        data: { apikey: '901b949a211dff13752dca0a6c902853e9deca35', text: str, outputMode: 'json' },
        success: function(res){
            if (res["status"] === "OK") {
                if (sentimentByYear[year] != null) {
                    var calc = (sentimentByYear[year] + res.docSentiment.score)/2;
                    if (!isNaN(calc)) {
                        sentimentByYear[year] = calc;
                    }
                } else {
                    sentimentByYear[year] = res.docSentiment.score;
                }
            }
            else if (res["status"] === "ERROR") {
                //Do something bad
            }
            //console.log(res["language"]);
            if (res["language"] === "english") {
                langSupport = true;
                analyzeEmotion(year, str);

            }
        },
        error: function(jqxhr) {
            //console.log(jqxhr);
        }
    });
}

function analyzeEmotion(year, str) {
    $.ajax({
        url: 'https://access.alchemyapi.com/calls/text/TextGetEmotion',
        dataType: 'jsonp',
        jsonp: 'jsonp',
        type: "post",
        data: { apikey: '901b949a211dff13752dca0a6c902853e9deca35', text: str, outputMode: 'json' },
        success: function(res){
            if (res["status"] === "OK") {
                console.log(res);

                if (angerByYear[year] != null) {
                    var calc = (angerByYear[year] + res.docEmotions.anger)/2;
                    if (!isNaN(calc)) {
                        angerByYear[year] = calc;
                    }
                } else {
                    angerByYear[year] = res.docEmotions.anger;
                }
                if (disgustByYear[year] != null) {
                    var calc = (disgustByYear[year] + res.docEmotions.disgust)/2;
                    if (!isNaN(calc)) {
                        disgustByYear[year] = calc;
                    }
                } else {
                    disgustByYear[year] = res.docEmotions.disgust;
                }
                if (fearByYear[year] != null) {
                    var calc = (fearByYear[year] + res.docEmotions.fear)/2;
                    if (!isNaN(calc)) {
                        fearByYear[year] = calc;
                    }
                } else {
                    fearByYear[year] = res.docEmotions.fear;
                }
                if (joyByYear[year] != null) {
                    var calc = (joyByYear[year] + res.docEmotions.joy)/2;
                    if (!isNaN(calc)) {
                        joyByYear[year] = calc;
                    }
                } else {
                    joyByYear[year] = res.docEmotions.joy;
                }
                if (sadnessByYear[year] != null) {
                    var calc = (sadnessByYear[year] + res.docEmotions.sadness)/2;
                    if (!isNaN(calc)) {
                        sadnessByYear[year] = calc;
                    }
                } else {
                    sadnessByYear[year] = res.docEmotions.sadness;
                }
                done();
            }
            else if (res["status"] === "ERROR") {
                //Do something bad
            }
        },
        error: function(jqxhr) {
            //console.log(jqxhr);
        }
    });
}

function chunkString(str, length) {
    return str.match(new RegExp('.{1,' + length + '}', 'g'));
}

/*function calculateNewScore(oldScore, year, newScore) {
    /*if (oldScore && oldScore[year] && oldScore[year] != null) {
        oldScore[year] = (oldScore[year] + newScore)/2;
    } else {*/
        //oldScore[year] = newScore;
    //}
    //console.log("Old:" + oldScore[year] + " - " + newScore);
//}*/

var counter = 0;
function done() {
    counter++;
    if(counter == 2) {
        console.log("Sentiment:");
        for (var key in sentimentByYear) {
            console.log(key + " - " + Math.round(sentimentByYear[key]*100));
        }
        console.log("Anger:");
        for (var key in angerByYear) {
            console.log(key + " - " + Math.round(angerByYear[key]*100));
        }
        console.log("Disgust:");
        for (var key in disgustByYear) {
            console.log(key + " - " + Math.round(disgustByYear[key]*100));
        }
        console.log("Fear:");
        for (var key in fearByYear) {
            console.log(key + " - " + Math.round(fearByYear[key]*100));
        }
        console.log("Sadness:");
        for (var key in sadnessByYear) {
            console.log(key + " - " + Math.round(sadnessByYear[key]*100));
        }
        console.log("Joy:");
        for (var key in joyByYear) {
            console.log(key + " - " + Math.round(joyByYear[key]*100));
        }
        displayJoyData();
        displaySadData();
        displayAngerData();
        displayDisgustData();
        displayFearData();
    }
}
