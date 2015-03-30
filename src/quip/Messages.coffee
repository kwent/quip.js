# Require lodash functions
{defaults} = require 'lodash'

class Messages extends API

    getMessages: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'messages/' + params['thread_id']
        }

    newMessage: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'thread_id' ]
            apiInfos:
                version: 1
                method: 'POST'
                path: 'messages/new'
        }

    getMethods: (params, done) ->

        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered