Quip = require('../../dist/quip.js')

module.exports =
  
  setUp: (done) ->

      @quip = new Quip(
          accessToken: process.env['QUIP_ACCESS_TOKEN'])
      @quip.th.createDocument {title: 'Title',
      content: '<h1>Title</h1><p>First paragraph</p>'}, (error, data) ->
          @threadId = data['thread']['id'] if data and data['thread']
          done()
      return

  getMessages: (test) ->

      @quip.msg.getMessages {thread_id: threadId}, (error, data) ->
          test.ifError error
          test.done()
      return
  
  newMessage: (test) ->

      @quip.msg.newMessage {thread_id: threadId, content: 'My New Message'}, (error, data) ->
          test.ifError error
          test.done()
      return