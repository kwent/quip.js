# Require lodash functions
{extend, defaults, isEmpty, mapValues} = require 'lodash'

class API

    # Privat noop class
    noop = ->

    # Constructor for the API class
    # `quip` [Quip] The quip instance linked to the API instance
    constructor: (@quip) ->

    # Request to the Quip and process generic response
    # `options`         [Object]
    # `options.version` [String] API version
    # `options.path`    [String] API path
    # `options.method`  [String] API method
    # `options.params`  [Object] API parameters
    request: (options = {}, done = noop) ->

        # Get protocol, host and port variables from Quip instance
        {protocol, host, port} = @quip
        # Get version, path, params variables from options
        {version, path, method, params} = options

        # Create url from protocol, host, port and path
        url = "#{protocol}://#{host}:#{port}/#{version}/#{path}"
        
        # Create querystring
        qs = defaults params
        
        # Launch Quip request with url and querystring
        @quip.request {url, qs, method}, (error, response, body) ->
            
            # Call done callback with error if there is an error
            if error then return done error
            # Call done callback with statusCode error if there is an error with the response
            if response.statusCode isnt 200
                error = new Error "HTTP status code: #{response.statusCode}"
                error.response = response
                return done error
            # Call done callback with no error and the data property of the response
            done null, body

    # Request API using `args` parameter
    # `args.params`             [Object] Request Parameters
    # `args.done`               [Function] Done callback
    # `args.apiInfos`           [Object]
    # `args.apiInfos.version`   [String] API version
    # `args.apiInfos.path`      [String] API path
    # `args.apiInfos.method`    [String] API method
    # `args.requiredParams`     [String[]] List of required parameters for the API
    requestAPI: (args) ->

        {apiInfos, requiredParams, params, done} = args

        # Process optional parameters and done callback
        {params, done} = Utils.optionalParamsAndDone {params, done}
        # Force params to be string if they can be converted to strings (boolean, numbers...)
        params = mapValues params, (param) -> param and param.toString()
        # Check that required parmeters are passed
        missing = Utils.checkRequiredParams params, requiredParams
        # If the missing params array is not empty, stop everything
        if not isEmpty missing then return done new Error "Missing required params: #{missing.join(', ')}"
        # Create request options based on parameters and api infos
        opts = extend {}, apiInfos, {params}
        # Call request with options and done callback
        @request opts, done