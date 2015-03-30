# Require lodash functions
{defaults} = require 'lodash'

class Users extends API

    getAuthenticatedUser: (params, done) ->

        @requestAPI {
            params, done
            apiInfos:
                version: 1
                method: 'GET'
                path: 'users/current'
        }

    getUser: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'id' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'users/' + params['id']
        }

    getUsers: (params, done) ->

        @requestAPI {
            params, done
            requiredParams: [ 'ids' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'users/?' + params['ids'].join(',')
        }

    getContacts: (params, done) ->

        @requestAPI {
            params, done
            apiInfos:
                version: 1
                method: 'GET'
                path: 'users/contacts'
        }

    getMethods: (params, done) ->

        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered