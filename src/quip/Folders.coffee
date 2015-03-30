# Require lodash functions
{defaults} = require 'lodash'

class Folders extends API

    getFolder: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'folders/' + params['id']
        }

    getFolders: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'ids' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'folders/?' + params['ids'].join(',')
        }

    newFolder: (params, done) ->

        params['member_ids'] = params['member_ids'].join(',') if params['member_ids']

        @requestAPI {
            params, done
            requiredParams: [ 'title' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'folders/new'
        }

    updateFolder: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'folder_id' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'folders/update'
        }

    addFolderMembers: (params, done) ->

        params['member_ids'] = params['member_ids'].join(',') if params['member_ids']
        
        @requestAPI {
            params, done
            requiredParams: [ 'folder_id', 'member_ids']
            apiInfos:
                version: 1
                method: 'POST'
                path: 'folders/add-members'
        }

    removeFolderMembers: (params, done) ->

        params['member_ids'] = params['member_ids'].join(',') if params['member_ids']
        
        @requestAPI {
            params, done
            requiredParams: [ 'folder_id', 'member_ids']
            apiInfos:
                version: 1
                method: 'POST'
                path: 'folders/remove-members'
        }

    getMethods: (params, done) ->

        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered