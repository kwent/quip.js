Quip = require('../../dist/quip.js')

module.exports =
      
  createQuipWithoutCredentials_ShouldThrow: (test) ->

      test.throws( (-> new Quip() ), Error)
      test.done()
      return

  createQuipWithAccessTokenShould_ShouldNotThrow: (test) ->

      test.doesNotThrow( (-> new Quip( accessToken: 'accessToken' ) ), Error)
      test.done()
      return

  createQuipWithOAuth_ShouldNotThrow: (test) ->

      test.doesNotThrow( (-> new Quip( clientId: 'clientId', clientSecret: 'clientSecret' ) ), Error)
      test.done()
      return

  createQuipWithOAuthOnlyClientId_ShouldThrow: (test) ->

      test.throws( (-> new Quip( clientId: 'clientId' ) ), Error)
      test.done()
      return

  createQuipWithOAuthOnlyclientSecret_ShouldThrow: (test) ->

      test.throws( (-> new Quip( clientSecret: 'clientSecret' ) ), Error)
      test.done()
      return