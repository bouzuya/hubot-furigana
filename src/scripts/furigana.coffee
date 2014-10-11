# Description
#   A Hubot script that show furigana
#
# Configuration:
#   None
#
# Commands:
#   hubot furigana <message> - show furigana
#
# Author:
#   bouzuya <m@bouzuya.net>
#
module.exports = (robot) ->
  qs = require 'qs'
  {parseString} = require 'xml2js'
  APP_ID = process.env.HUBOT_FURIGANA_APP_ID

  robot.respond /furigana (.+)$/i, (res) ->
    sentence = res.match[1]
    url = 'http://jlp.yahooapis.jp/FuriganaService/V1/furigana'
    queryString = qs.stringify
      appid: APP_ID
      sentence: sentence
    res.http(url + '?' + queryString).get() (err, _, body) ->
      return res.send(err) if err?
      parseString body, (err, result) ->
        return res.send(err) if err?
        message = result.ResultSet.Result[0].WordList[0].Word
          .map (word) ->
            word.Furigana[0]
          .join ''
        res.send message
