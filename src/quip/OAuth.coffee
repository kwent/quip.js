# Require lodash functions
{defaults} = require 'lodash'

class OAuth extends API

    getAuthorizationUrl: (params, done) ->
        
        params['response_type'] = 'code'
        params['client_id'] = @clientId
        
        @requestAPI {
            params, done
            requiredParams: [ 'redirect_uri' ]
            apiInfos:
                version: 1
                method: 'GET'
                path: 'oauth/login?'
        }
          
    getAccessToken: (params, done) ->

        params['authorization_code'] = 'authorization_code'
        params['client_id'] = @clientId
        params['client_secret'] = @clientSecret
        
        @requestAPI {
            params, done
            requiredParams: [ 'redirect_uri', 'code']
            apiInfos:
                version: 1
                method: 'POST'
                path: 'oauth/access_token?'
        }

    getMethods: (params, done) ->
      
        to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods']
        keys = (k for k, v of this when typeof v is 'function')
        filtered = keys.filter (method_name) -> to_exclude.indexOf(method_name) is -1
        done filtered