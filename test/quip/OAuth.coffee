Quip = require('../../dist/quip.js')

module.exports =
  
  setUp: (done) ->

      @quip = new Quip(
          clientId: process.env['QUIP_CLIENT_ID']
          clientSecret: process.env['QUIP_CLIENT_SECRET'])
      done()
      return

  getAuthorizationUrl: (test) ->

      @quip.oauth.getAuthorizationUrl {redirect_uri: 'https://www.my_domain.com'}, (error, data) ->
          test.ifError error
          test.done()
      return

  # Quip Business and Quip Enterprise only
  # getAccessToken: (test) ->
  #
  #     @quip.oauth.getAccessToken {'redirect_uri': 'https://www.my_domain.com', 'code': 'code'}, (error, data) ->
  #         test.ifError error
  #         test.done()
  #     return