# Require node modules
request = require 'request'
{defaults} = require 'lodash'

class Quip

    # Folder Colors
    @prototype.Color =
      MANILA: 0
      RED: 1
      ORANGE: 2
      GREEN: 3
      BLUE: 4

    # Edit Operations
    @prototype.Operation =
      APPEND: 0
      PREPEND: 1
      AFTER_SECTION: 2
      BEFORE_SECTION: 3
      REPLACE_SECTION: 4
      DELETE_SECTION: 5
      
    # Default Quip parameters
    defParams =
        # Default protocol is HTTPS (`https`)
        protocol: 'https'
        # Default host is `platform.quip.com`
        host: 'platform.quip.com'
        # Default port is `443`
        port: 443

    # Constructor for the Quip class
    # `params`          [Object]
    # `params.accessToken`  [String] Personal token for the Quip instance. * Required *
    # `params.clientId`  [String] Personal client id (OAuth) for the Quip instance. * Required secretId *
    # `params.clientSecret`  [String] Personal client secret (OAuth) for the Quip instance. * Required secretId *
    constructor: (params) ->

        # Use defaults options
        defaults this, params, defParams

        # Throw errors if required params are not passed
        if not @accessToken and not @clientId and not @clientSecret
            throw new Error 'Did not specified `accessToken` or `clientId` +
            `clientSecret` (OAuth) for Quip'
        if (@clientId and not @clientSecret) or (not @clientId and @clientSecret)
            throw new Error 'Did not specified `clientId` AND
            `clientSecret` (OAuth) for Quip'

        # Create request with jar
        @request = request.defaults json: true, headers: {'Authorization': "Bearer #{@accessToken}"}

        # Add OAuth API
        @oauth = new OAuth this
                
        # Add Threads API
        @th = @threads = new Threads this

        # Add Messages API
        @msg = @messages = new Messages this

        # Add Folders API
        @fdr = @folders = new Folders this

        # Add Users API
        @usr = @users = new Users this
