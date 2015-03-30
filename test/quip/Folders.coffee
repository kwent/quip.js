Quip = require('../../dist/quip.js')

module.exports =
  
  setUp: (done) ->

      @quip = new Quip(
          accessToken: process.env['QUIP_ACCESS_TOKEN'])
      @memberId = process.env['QUIP_MEMBER_ID']
      @folderId = null
      done()
      return

  newFolder: (test) ->

      @quip.fdr.newFolder {title: 'My New Folder', color: Quip.prototype.Color.RED}, (error, data) ->
          test.ok(data and data['folder']? and data['folder']['id']?)
          @folderId = data['folder']['id']
          test.ifError error
          test.done()
      return

  getFolder: (test) ->

      @quip.fdr.getFolder {id: folderId}, (error, data) ->
          test.ifError error
          test.done()
      return

  getFolders: (test) ->

      @quip.fdr.getFolders {ids: [folderId, folderId, folderId]}, (error, data) ->
          test.ifError error
          test.done()
      return

  updateFolder: (test) ->

      @quip.fdr.updateFolder {folder_id: folderId, title: 'A Better Title'}, (error, data) ->
          test.ifError error
          test.done()
      return

  addFolderMembers: (test) ->

      @quip.fdr.addFolderMembers {folder_id: folderId, member_ids: [@memberId]}, (error, data) ->
          test.ifError error
          test.done()
      return

  removeFolderMembers: (test) ->

      @quip.fdr.removeFolderMembers {folder_id: folderId, member_ids: [@memberId]}, (error, data) ->
          test.ifError error
          test.done()
      return