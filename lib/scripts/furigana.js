// Description
//   A Hubot script that show furigana
//
// Configuration:
//   None
//
// Commands:
//   hubot furigana <message> - show furigana
//
// Author:
//   bouzuya <m@bouzuya.net>
//
module.exports = function(robot) {
  var APP_ID, parseString, qs;
  qs = require('qs');
  parseString = require('xml2js').parseString;
  APP_ID = process.env.HUBOT_FURIGANA_APP_ID;
  return robot.respond(/furigana (.+)$/i, function(res) {
    var queryString, sentence, url;
    sentence = res.match[1];
    url = 'http://jlp.yahooapis.jp/FuriganaService/V1/furigana';
    queryString = qs.stringify({
      appid: APP_ID,
      sentence: sentence
    });
    return res.http(url + '?' + queryString).get()(function(err, _, body) {
      if (err != null) {
        return res.send(err);
      }
      return parseString(body, function(err, result) {
        var message;
        if (err != null) {
          return res.send(err);
        }
        message = result.ResultSet.Result[0].WordList[0].Word.map(function(word) {
          return word.Furigana[0];
        }).join('');
        return res.send(message);
      });
    });
  });
};
