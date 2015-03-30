Quip = require('../../dist/quip.js')

module.exports =
  
  setUp: (done) ->

      @quip = new Quip(
          accessToken: process.env['QUIP_ACCESS_TOKEN'])
      @userId = null
      done()
      return
      
  getAuthenticatedUser: (test) ->

      @quip.usr.getAuthenticatedUser (error, data) ->
          test.ok(data and data['id']?)
          @userId = data['id']
          test.ifError error
          test.done()
      return

  getUser: (test) ->

      @quip.usr.getUser {id: userId}, (error, data) ->
          test.ifError error
          test.done()
      return

  getUsers: (test) ->

      @quip.usr.getUsers {ids: [userId, userId, userId]}, (error, data) ->
          test.ifError error
          test.done()
      return

  getContacts: (test) ->

      @quip.usr.getContacts (error, data) ->
          test.ifError error
          test.done()
      return