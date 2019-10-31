# Require lodash functions
{defaults} = require 'lodash'

class Threads extends API

    getRecentThreads: (params, done) ->

        @requestAPI {
            params, done
            apiInfos:
                version: 1
                method: 'GET'
                path: 'threads/recent'
        }

    getThread: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'threads/' + params['id']
        }

    getThreads: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'ids' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'threads/?' + params['ids'].join(',')
        }

    deleteThread: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'threads/delete'
        }

    createDocument: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'content' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'threads/new-document'
        }

    copyDocument: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'threads/copy-document'
        }

    editDocument: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'threads/edit-document'
        }

    addThreadMembers: (params, done) ->

        params['member_ids'] = params['member_ids'].join(',') if params['member_ids']

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id', 'member_ids' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'threads/add-members'
        }

    removeThreadMembers: (params, done) ->

        params['member_ids'] = params['member_ids'].join(',') if params['member_ids']

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id', 'member_ids' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'threads/remove-members'
        }

    getMethods: (params, done) ->

        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered
