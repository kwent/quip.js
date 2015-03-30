CONFIG_DIR = '.quip-cli'
CONFIG_FILE = 'config.yaml'
ACCESS_TOKEN_ENV = 'QUIP_ACCESS_TOKEN'

program = require 'commander'
fs = require 'fs'
url = require 'url'
nconf = require 'nconf'
path = require 'path-extra'
yaml = require 'js-yaml'
Quip = require '../dist/quip'
os = require 'os'

execute = (api, cmd, options) ->

    console.log '[DEBUG] : Method name configured : %s', cmd if program.debug
    console.log '[DEBUG] : JSON payload configured : %s', options.payload if options.payload and program.debug
    console.log '[DEBUG] : Prettify output detected' if options.pretty and program.debug

    try
        payload = JSON.parse(options.payload or '{}')
    catch exception
        console.log '[ERROR] : JSON Exception : %s', exception
        process.exit 1

    Quip[api][cmd] payload, (err, data) ->
        console.log '[ERROR] : %s', err if err
        if options.pretty
            data = JSON.stringify data, undefined, 2
        else
            data = JSON.stringify data
        console.log data if data
        process.exit 0

program
.version '1.0.0'
.description 'Quip Rest API Command Line'
.option '-c, --config <path>', "Quip Configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-t, --accessToken <token>', 'Quip Access Token'
.option '-d, --debug', 'Enabling Debugging Output'
.on '--help', ->
    console.log '  Commands:'
    console.log ''
    console.log '    threads|th [options] <method> Quip Threads API'
    console.log '    messages|msg [options] <method> Quip Messages API'
    console.log '    folders|fdr [options] <method> Quip Folders API'
    console.log '    users|usr [options] <method> Quip Users API'
    console.log ''
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ quip threads|th getRecentThreads'
    console.log '    $ quip messages|msg getMessages --payload
    \'{"thread_id": "threadId"}\' --pretty'
    console.log '    $ quip folders|fdr newFolder --payload
    \'{"title": "My New Folder"}\' --pretty'
    console.log '    $ quip users|usr getAuthenticatedUser'
    console.log ''

program.parse process.argv

if program.args.length is 0
    program.help()
else if (program.args.length > 0 and
          program.args[0] isnt 'threads' and
          program.args[0] isnt 'th' and
          program.args[0] isnt 'messages' and
          program.args[0] isnt 'msg' and
          program.args[0] isnt 'folders' and
          program.args[0] isnt 'fdr' and
          program.args[0] isnt 'users' and
          program.args[0] isnt 'usr')
    console.log ''
    console.log "  [ERROR] : #{program.args[0]} is not a valid command !"
    console.log ''
    console.log '  Examples:'
    console.log ''
    console.log '    $ quip threads|th [options] <method> Quip Threads API'
    console.log '    $ quip messages|msg [options] <method> Quip Messages API'
    console.log '    $ quip folders|fdr [options] <method> Quip Folders API'
    console.log '    $ quip users|usr [options] <method> Quip Users API'
    console.log ''
    process.exit 1

# Load cmd line args and environment vars
nconf.argv().env()

if program.accessToken
    console.log '[DEBUG] : Params Access Token detected : %s.', program.accessToken if program.debug

    nconf.overrides
        auth:
            accessToken: program.accessToken
else if program.config
    console.log '[DEBUG] : Load config file : %s', program.config if program.debug
    # load a yaml file specified in config
    if fs.existsSync(program.config)
        nconf.file
            file: program.config
            format:
                stringify: (obj, options) ->
                    yaml.safeDump obj, options
                parse: (obj, options) ->
                    yaml.safeLoad obj, options
    else
        console.log '[ERROR] : Config file : %s not found', program.config
        process.exit 1
else

    # If no directory -> create directory and save the file
    if not fs.existsSync path.homedir() + "/#{CONFIG_DIR}"
        console.log '[DEBUG] : Default configuration file doesn\'t exist : %s',
            path.homedir() + "/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
        fs.mkdir path.homedir() + "/#{CONFIG_DIR}", (err) ->
            if err
                console.log '[ERROR] : %s', err
            else
                nconf.set 'auth:accessToken', 'accessToken'
                console.log '[DEBUG] : Default configuration file created : %s',
                    path.homedir() + "/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
                nconf.save()

    # Load a yaml file using YAML formatter
    console.log "[DEBUG] : Default configuration file loaded : ~/#{CONFIG_DIR}/#{CONFIG_FILE}" if program.debug
    nconf.file
        file: path.homedir() + "/#{CONFIG_DIR}/#{CONFIG_FILE}"
        format:
            stringify: (obj, options) ->
                yaml.safeDump obj, options
            parse: (obj, options) ->
                yaml.safeLoad obj, options

nconf.defaults
    auth:
        accessToken: 'accessToken'

accessToken = if nconf.get ACCESS_TOKEN_ENV then nconf.get ACCESS_TOKEN_ENV else nconf.get 'auth:accessToken'

if program.debug
    console.log '[DEBUG] : Access Token configured%s : %s',
    (if nconf.get ACCESS_TOKEN_ENV then ' (from env)' else ''), accessToken

Quip = new Quip
    accessToken: accessToken

program
.command 'threads <method>'
.alias 'th'
.description 'Quip Threads API'
.option '-c, --config <path>', "Quip configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-t, --accessToken <token>', 'Quip Access Token'
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ quip threads|th getRecentThreads'
    console.log '    $ quip threads|th createDocument --payload
    \'{"title": "Title", "content": "<h1>Title</h1><p>First Paragraph</p>"}\' --pretty'
    console.log '    $ quip threads|th editDocument --payload
    \'{"content": "<h1>Prepend content</h1>", "location": 1}\' --pretty'
    console.log '    $ quip threads|th addThreadMembers --payload
    \'{"thread_id": "threadId", "members_ids": ["userId1", "userId2"] }\' --pretty'
    console.log ''
.action (cmd, options) ->
    console.log '[DEBUG] : Quip Threads API command selected' if program.debug
    execute 'th', cmd, options

program
.command 'messages <method>'
.alias 'msg'
.description 'Quip Messages API'
.option '-c, --config <path>', "Quip configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-t, --accessToken <token>', 'Quip Access Token'
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ quip messages|msg getMessages --payload
    \'{"thread_id": "threadId"}\' --pretty'
    console.log '    $ quip messages|msg newMessage --payload
    \'{"thread_id": "threadId", "content": "My New Message"}\' --pretty'
    console.log ''
.action (cmd, options) ->
    console.log '[DEBUG] : Quip Messages API command selected' if program.debug
    execute 'msg', cmd, options
    
program
.command 'folders <method>'
.alias 'fdr'
.description 'Quip Folders API'
.option '-c, --config <path>', "Quip configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-t, --accessToken <token>', 'Quip Access Token'
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ quip folders|fdr newFolder --payload
    \'{"title": "My New Folder"}\' --pretty'
    console.log '    $ quip folders|fdr getFolder --payload
    \'{"folder_id": "folderId"}\' --pretty'
    console.log '    $ quip folders|fdr updateFolder --payload
    \'{"folder_id": "folderId", "color": 1}\' --pretty'
    console.log '    $ quip folders|fdr addFolderMembers --payload
    \'{"folder_id": "threadId", "members_ids": ["userId1", "userId2"] }\' --pretty'
    console.log ''
.action (cmd, options) ->
    console.log '[DEBUG] : Quip Folders API command selected' if program.debug
    execute 'fdr', cmd, options

program
.command 'users <method>'
.alias 'usr'
.description 'Quip Users API'
.option '-c, --config <path>', "Quip configuration file. Default to ~/#{CONFIG_DIR}/#{CONFIG_FILE}"
.option '-t, --accessToken <token>', 'Quip Access Token'
.option '-p, --payload <payload>', 'JSON Payload'
.option '-P, --pretty', 'Prettyprint JSON Output'
.option '-d, --debug', 'Enabling Debugging Output'
.on '--help', ->
    console.log '  Examples:'
    console.log ''
    console.log '    $ quip users|usr getAuthenticatedUser'
    console.log '    $ quip users|usr getUser --payload \'{"id": "userId"}\' --pretty'
    console.log '    $ quip users|usr getContacts --pretty'
    console.log ''
.action (cmd, options) ->
    console.log '[DEBUG] : Quip Users API command selected' if program.debug
    execute 'usr', cmd, options

program.parse process.argv