Quip = require('../../dist/quip.js')

module.exports =

  setUp: (done) ->

      @quip = new Quip(
          accessToken: process.env['QUIP_ACCESS_TOKEN'])
      @memberId = process.env['QUIP_MEMBER_ID']
      done()
      return

  createDocument: (test) ->

      @quip.th.createDocument {title: 'Hello world',
      content: '<h1>Title</h1><p>First paragraph</p>'}, (error, data) ->
          test.ok(data and data['thread']? and data['thread']['id']?)
          @threadId = data['thread']['id']
          test.ifError error
          test.done()
      return

  editDocument: (test) ->

      @quip.th.editDocument {thread_id: threadId, content: '<p>New section</p>',
      'location': Quip.prototype.Operation.APPEND}, (error, data) ->
          test.ifError error
          test.done()
      return

  getRecentThreads: (test) ->

      @quip.th.getRecentThreads {count: 2}, (error, data) ->
          test.ifError error
          test.done()
      return

  getThread: (test) ->

      @quip.th.getThread {id: threadId}, (error, data) ->
          test.ifError error
          test.done()
      return

  getThreads: (test) ->

      @quip.th.getThreads {'ids': [threadId, threadId, threadId]}, (error, data) ->
          test.ifError error
          test.done()
      return

  addThreadMembers: (test) ->

      @quip.th.addThreadMembers {'thread_id': threadId, 'member_ids': [@memberId]}, (error, data) ->
  
          test.ifError error
          test.done()
      return

  removeThreadMembers: (test) ->
  
      @quip.th.removeThreadMembers {'thread_id': threadId, 'member_ids': [@memberId]}, (error, data) ->
          test.ifError error
          test.done()
      return