var data = ' ';
function testSentiment(property) {

    FB.api(property, function(response) {
        logdata(response);
        if(response.paging && response.paging.next){
            testSentiment(response.paging.next);
        } else {
            watsonanalyze(data);
        }
        document.getElementById('status').innerHTML =
            'This is the second time wuhuuu !';
    });
}
function logdata(response) {
    var obj = response.data;
    for (var i = 0; i<obj.length; i++) {
        if (typeof(obj[i].message) != "undefined")
            data += obj[i].message;
        /*if (typeof(obj[i].story) != "undefined")
            data += obj[i].story;*/
    }
}

function watsonanalyze(responseStr) {
    //var AlchemyAPI = require('alchemy-api');
    //var alchemy = new AlchemyAPI('a7cb103e4ba668b5d121c3ac04910e2f14e0886f');
    /*alchemy.emotions(responseStr, {}, function(err, response) {
        if (err) throw err;

        // See http://www.alchemyapi.com/api/html-api-1 for format of returned object
        var emotions = response.docEmotions;
        console.log(emotions);
        // Do something with data
    });*/

    $.ajax({
        url: 'https://access.alchemyapi.com/calls/text/TextGetEmotion',
        dataType: 'jsonp',
        jsonp: 'jsonp',
        type: "post",
        data: { apikey: 'a7cb103e4ba668b5d121c3ac04910e2f14e0886f', text: responseStr, outputMode: 'json' },
        success: function(res){
            if (res["status"] === "OK") {
                console.log(res);
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