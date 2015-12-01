#!/usr/bin/env node

var ACCESS_TOKEN_ENV, CONFIG_DIR, CONFIG_FILE, Quip, accessToken, execute, fs, nconf, os, path, program, url, yaml;

CONFIG_DIR = '.quip-cli';

CONFIG_FILE = 'config.yaml';

ACCESS_TOKEN_ENV = 'QUIP_ACCESS_TOKEN';

program = require('commander');

fs = require('fs');

url = require('url');

nconf = require('nconf');

path = require('path-extra');

yaml = require('js-yaml');

Quip = require('../dist/quip');

os = require('os');

execute = function(api, cmd, options) {
  var exception, payload;
  if (program.debug) {
    console.log('[DEBUG] : Method name configured : %s', cmd);
  }
  if (options.payload && program.debug) {
    console.log('[DEBUG] : JSON payload configured : %s', options.payload);
  }
  if (options.pretty && program.debug) {
    console.log('[DEBUG] : Prettify output detected');
  }
  try {
    payload = JSON.parse(options.payload || '{}');
  } catch (_error) {
    exception = _error;
    console.log('[ERROR] : JSON Exception : %s', exception);
    process.exit(1);
  }
  return Quip[api][cmd](payload, function(err, data) {
    if (err) {
      console.log('[ERROR] : %s', err);
    }
    if (options.pretty) {
      data = JSON.stringify(data, void 0, 2);
    } else {
      data = JSON.stringify(data);
    }
    if (data) {
      console.log(data);
    }
    return process.exit(0);
  });
};

program.version('1.0.3').description('Quip Rest API Command Line').option('-c, --config <path>', "Quip Configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-t, --accessToken <token>', 'Quip Access Token').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Commands:');
  console.log('');
  console.log('    threads|th [options] <method> Quip Threads API');
  console.log('    messages|msg [options] <method> Quip Messages API');
  console.log('    folders|fdr [options] <method> Quip Folders API');
  console.log('    users|usr [options] <method> Quip Users API');
  return console.log('');
}).on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ quip threads|th getRecentThreads');
  console.log('    $ quip messages|msg getMessages --payload \'{"thread_id": "threadId"}\' --pretty');
  console.log('    $ quip folders|fdr newFolder --payload \'{"title": "My New Folder"}\' --pretty');
  console.log('    $ quip users|usr getAuthenticatedUser');
  return console.log('');
});

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
} else if (program.args.length > 0 && program.args[0] !== 'threads' && program.args[0] !== 'th' && program.args[0] !== 'messages' && program.args[0] !== 'msg' && program.args[0] !== 'folders' && program.args[0] !== 'fdr' && program.args[0] !== 'users' && program.args[0] !== 'usr') {
  console.log('');
  console.log("  [ERROR] : " + program.args[0] + " is not a valid command !");
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ quip threads|th [options] <method> Quip Threads API');
  console.log('    $ quip messages|msg [options] <method> Quip Messages API');
  console.log('    $ quip folders|fdr [options] <method> Quip Folders API');
  console.log('    $ quip users|usr [options] <method> Quip Users API');
  console.log('');
  process.exit(1);
}

nconf.argv().env();

if (program.accessToken) {
  if (program.debug) {
    console.log('[DEBUG] : Params Access Token detected : %s.', program.accessToken);
  }
  nconf.overrides({
    auth: {
      accessToken: program.accessToken
    }
  });
} else if (program.config) {
  if (program.debug) {
    console.log('[DEBUG] : Load config file : %s', program.config);
  }
  if (fs.existsSync(program.config)) {
    nconf.file({
      file: program.config,
      format: {
        stringify: function(obj, options) {
          return yaml.safeDump(obj, options);
        },
        parse: function(obj, options) {
          return yaml.safeLoad(obj, options);
        }
      }
    });
  } else {
    console.log('[ERROR] : Config file : %s not found', program.config);
    process.exit(1);
  }
} else {
  if (!fs.existsSync(path.homedir() + ("/" + CONFIG_DIR))) {
    console.log('[DEBUG] : Default configuration file doesn\'t exist : %s', program.debug ? path.homedir() + ("/" + CONFIG_DIR + "/" + CONFIG_FILE) : void 0);
    fs.mkdir(path.homedir() + ("/" + CONFIG_DIR), function(err) {
      if (err) {
        return console.log('[ERROR] : %s', err);
      } else {
        nconf.set('auth:accessToken', 'accessToken');
        console.log('[DEBUG] : Default configuration file created : %s', program.debug ? path.homedir() + ("/" + CONFIG_DIR + "/" + CONFIG_FILE) : void 0);
        return nconf.save();
      }
    });
  }
  if (program.debug) {
    console.log("[DEBUG] : Default configuration file loaded : ~/" + CONFIG_DIR + "/" + CONFIG_FILE);
  }
  nconf.file({
    file: path.homedir() + ("/" + CONFIG_DIR + "/" + CONFIG_FILE),
    format: {
      stringify: function(obj, options) {
        return yaml.safeDump(obj, options);
      },
      parse: function(obj, options) {
        return yaml.safeLoad(obj, options);
      }
    }
  });
}

nconf.defaults({
  auth: {
    accessToken: 'accessToken'
  }
});

accessToken = nconf.get(ACCESS_TOKEN_ENV) ? nconf.get(ACCESS_TOKEN_ENV) : nconf.get('auth:accessToken');

if (program.debug) {
  console.log('[DEBUG] : Access Token configured%s : %s', (nconf.get(ACCESS_TOKEN_ENV) ? ' (from env)' : ''), accessToken);
}

Quip = new Quip({
  accessToken: accessToken
});

program.command('threads <method>').alias('th').description('Quip Threads API').option('-c, --config <path>', "Quip configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-t, --accessToken <token>', 'Quip Access Token').option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ quip threads|th getRecentThreads');
  console.log('    $ quip threads|th createDocument --payload \'{"title": "Title", "content": "<h1>Title</h1><p>First Paragraph</p>"}\' --pretty');
  console.log('    $ quip threads|th editDocument --payload \'{"content": "<h1>Prepend content</h1>", "location": 1}\' --pretty');
  console.log('    $ quip threads|th addThreadMembers --payload \'{"thread_id": "threadId", "members_ids": ["userId1", "userId2"] }\' --pretty');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : Quip Threads API command selected');
  }
  return execute('th', cmd, options);
});

program.command('messages <method>').alias('msg').description('Quip Messages API').option('-c, --config <path>', "Quip configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-t, --accessToken <token>', 'Quip Access Token').option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ quip messages|msg getMessages --payload \'{"thread_id": "threadId"}\' --pretty');
  console.log('    $ quip messages|msg newMessage --payload \'{"thread_id": "threadId", "content": "My New Message"}\' --pretty');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : Quip Messages API command selected');
  }
  return execute('msg', cmd, options);
});

program.command('folders <method>').alias('fdr').description('Quip Folders API').option('-c, --config <path>', "Quip configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-t, --accessToken <token>', 'Quip Access Token').option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ quip folders|fdr newFolder --payload \'{"title": "My New Folder"}\' --pretty');
  console.log('    $ quip folders|fdr getFolder --payload \'{"folder_id": "folderId"}\' --pretty');
  console.log('    $ quip folders|fdr updateFolder --payload \'{"folder_id": "folderId", "color": 1}\' --pretty');
  console.log('    $ quip folders|fdr addFolderMembers --payload \'{"folder_id": "threadId", "members_ids": ["userId1", "userId2"] }\' --pretty');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : Quip Folders API command selected');
  }
  return execute('fdr', cmd, options);
});

program.command('users <method>').alias('usr').description('Quip Users API').option('-c, --config <path>', "Quip configuration file. Default to ~/" + CONFIG_DIR + "/" + CONFIG_FILE).option('-t, --accessToken <token>', 'Quip Access Token').option('-p, --payload <payload>', 'JSON Payload').option('-P, --pretty', 'Prettyprint JSON Output').option('-d, --debug', 'Enabling Debugging Output').on('--help', function() {
  console.log('  Examples:');
  console.log('');
  console.log('    $ quip users|usr getAuthenticatedUser');
  console.log('    $ quip users|usr getUser --payload \'{"id": "userId"}\' --pretty');
  console.log('    $ quip users|usr getContacts --pretty');
  return console.log('');
}).action(function(cmd, options) {
  if (program.debug) {
    console.log('[DEBUG] : Quip Users API command selected');
  }
  return execute('usr', cmd, options);
});

program.parse(process.argv);
