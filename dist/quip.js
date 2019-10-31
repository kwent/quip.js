(function(){
    var modules = {};
    function setter(){ throw new Error('Cannot manually set module property'); }
    function setModule(name, factory){
        if(modules.hasOwnProperty(name)){
            throw new Error('Module '+name+' already exists.');
        }
        Object.defineProperty(modules, name, {
            get: function(){
                if(factory.busy) {
                    throw new Error('Cyclic dependency detected on module '+name);
                }
                factory.busy = true;
                var value = factory();
                Object.defineProperty(modules, name, {
                    value: value
                });
                factory.busy = false;
                return value;
            },
            set: setter,
            enumerable: true,
            configurable: true
        });
    }
    with(modules){
        (function() {
          var extend1 = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
            hasProp = {}.hasOwnProperty;
        
          setModule('API', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var API, defaults, extend, isEmpty, mapValues, ref;
              ref = require('lodash'), extend = ref.extend, defaults = ref.defaults, isEmpty = ref.isEmpty, mapValues = ref.mapValues;
              API = (function() {
                var noop;
        
                noop = function() {};
        
                function API(quip) {
                  this.quip = quip;
                }
        
                API.prototype.request = function(options, done) {
                  var host, method, params, path, port, protocol, qs, ref1, url, version;
                  if (options == null) {
                    options = {};
                  }
                  if (done == null) {
                    done = noop;
                  }
                  ref1 = this.quip, protocol = ref1.protocol, host = ref1.host, port = ref1.port;
                  version = options.version, path = options.path, method = options.method, params = options.params;
                  url = protocol + "://" + host + ":" + port + "/" + version + "/" + path;
                  qs = defaults(params);
                  return this.quip.request({
                    url: url,
                    qs: qs,
                    method: method
                  }, function(error, response, body) {
                    if (error) {
                      return done(error);
                    }
                    if (response.statusCode !== 200) {
                      error = new Error("HTTP status code: " + response.statusCode);
                      error.response = response;
                      return done(error);
                    }
                    return done(null, body);
                  });
                };
        
                API.prototype.requestAPI = function(args) {
                  var apiInfos, done, missing, opts, params, ref1, requiredParams;
                  apiInfos = args.apiInfos, requiredParams = args.requiredParams, params = args.params, done = args.done;
                  ref1 = Utils.optionalParamsAndDone({
                    params: params,
                    done: done
                  }), params = ref1.params, done = ref1.done;
                  params = mapValues(params, function(param) {
                    return param && param.toString();
                  });
                  missing = Utils.checkRequiredParams(params, requiredParams);
                  if (!isEmpty(missing)) {
                    return done(new Error("Missing required params: " + (missing.join(', '))));
                  }
                  opts = extend({}, apiInfos, {
                    params: params
                  });
                  return this.request(opts, done);
                };
        
                return API;
        
              })();
              return module.exports = API;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Folders', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Folders, defaults;
              defaults = require('lodash').defaults;
              Folders = (function(superClass) {
                extend1(Folders, superClass);
        
                function Folders() {
                  return Folders.__super__.constructor.apply(this, arguments);
                }
        
                Folders.prototype.getFolder = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'folders/' + params['id']
                    }
                  });
                };
        
                Folders.prototype.getFolders = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['ids'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'folders/?' + params['ids'].join(',')
                    }
                  });
                };
        
                Folders.prototype.newFolder = function(params, done) {
                  if (params['member_ids']) {
                    params['member_ids'] = params['member_ids'].join(',');
                  }
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['title'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'folders/new'
                    }
                  });
                };
        
                Folders.prototype.updateFolder = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['folder_id'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'folders/update'
                    }
                  });
                };
        
                Folders.prototype.addFolderMembers = function(params, done) {
                  if (params['member_ids']) {
                    params['member_ids'] = params['member_ids'].join(',');
                  }
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['folder_id', 'member_ids'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'folders/add-members'
                    }
                  });
                };
        
                Folders.prototype.removeFolderMembers = function(params, done) {
                  if (params['member_ids']) {
                    params['member_ids'] = params['member_ids'].join(',');
                  }
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['folder_id', 'member_ids'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'folders/remove-members'
                    }
                  });
                };
        
                Folders.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var ref, results;
                    ref = this;
                    results = [];
                    for (k in ref) {
                      v = ref[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return Folders;
        
              })(API);
              return module.exports = Folders;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Messages', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Messages, defaults;
              defaults = require('lodash').defaults;
              Messages = (function(superClass) {
                extend1(Messages, superClass);
        
                function Messages() {
                  return Messages.__super__.constructor.apply(this, arguments);
                }
        
                Messages.prototype.getMessages = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'messages/' + params['thread_id']
                    }
                  });
                };
        
                Messages.prototype.newMessage = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'messages/new'
                    }
                  });
                };
        
                Messages.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var ref, results;
                    ref = this;
                    results = [];
                    for (k in ref) {
                      v = ref[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return Messages;
        
              })(API);
              return module.exports = Messages;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('OAuth', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var OAuth, defaults;
              defaults = require('lodash').defaults;
              OAuth = (function(superClass) {
                extend1(OAuth, superClass);
        
                function OAuth() {
                  return OAuth.__super__.constructor.apply(this, arguments);
                }
        
                OAuth.prototype.getAuthorizationUrl = function(params, done) {
                  params['response_type'] = 'code';
                  params['client_id'] = this.clientId;
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['redirect_uri'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'oauth/login?'
                    }
                  });
                };
        
                OAuth.prototype.getAccessToken = function(params, done) {
                  params['authorization_code'] = 'authorization_code';
                  params['client_id'] = this.clientId;
                  params['client_secret'] = this.clientSecret;
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['redirect_uri', 'code'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'oauth/access_token?'
                    }
                  });
                };
        
                OAuth.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var ref, results;
                    ref = this;
                    results = [];
                    for (k in ref) {
                      v = ref[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return OAuth;
        
              })(API);
              return module.exports = OAuth;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Quip', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Quip, defaults, request;
              request = require('request');
              defaults = require('lodash').defaults;
              Quip = (function() {
                var defParams;
        
                Quip.prototype.Color = {
                  MANILA: 0,
                  RED: 1,
                  ORANGE: 2,
                  GREEN: 3,
                  BLUE: 4
                };
        
                Quip.prototype.Operation = {
                  APPEND: 0,
                  PREPEND: 1,
                  AFTER_SECTION: 2,
                  BEFORE_SECTION: 3,
                  REPLACE_SECTION: 4,
                  DELETE_SECTION: 5
                };
        
                defParams = {
                  protocol: 'https',
                  host: 'platform.quip.com',
                  port: 443
                };
        
                function Quip(params) {
                  defaults(this, params, defParams);
                  if (!this.accessToken && !this.clientId && !this.clientSecret) {
                    throw new Error('Did not specified `accessToken` or `clientId` + `clientSecret` (OAuth) for Quip');
                  }
                  if ((this.clientId && !this.clientSecret) || (!this.clientId && this.clientSecret)) {
                    throw new Error('Did not specified `clientId` AND `clientSecret` (OAuth) for Quip');
                  }
                  this.request = request.defaults({
                    json: true,
                    headers: {
                      'Authorization': "Bearer " + this.accessToken
                    }
                  });
                  this.oauth = new OAuth(this);
                  this.th = this.threads = new Threads(this);
                  this.msg = this.messages = new Messages(this);
                  this.fdr = this.folders = new Folders(this);
                  this.usr = this.users = new Users(this);
                }
        
                return Quip;
        
              })();
              return module.exports = Quip;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Threads', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Threads, defaults;
              defaults = require('lodash').defaults;
              Threads = (function(superClass) {
                extend1(Threads, superClass);
        
                function Threads() {
                  return Threads.__super__.constructor.apply(this, arguments);
                }
        
                Threads.prototype.getRecentThreads = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'threads/recent'
                    }
                  });
                };
        
                Threads.prototype.getThread = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'threads/' + params['id']
                    }
                  });
                };
        
                Threads.prototype.getThreads = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['ids'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'threads/?' + params['ids'].join(',')
                    }
                  });
                };
        
                Threads.prototype.deleteThread = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'threads/delete'
                    }
                  });
                };
        
                Threads.prototype.createDocument = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['content'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'threads/new-document'
                    }
                  });
                };
        
                Threads.prototype.copyDocument = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'threads/copy-document'
                    }
                  });
                };
        
                Threads.prototype.editDocument = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'threads/edit-document'
                    }
                  });
                };
        
                Threads.prototype.addThreadMembers = function(params, done) {
                  if (params['member_ids']) {
                    params['member_ids'] = params['member_ids'].join(',');
                  }
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id', 'member_ids'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'threads/add-members'
                    }
                  });
                };
        
                Threads.prototype.removeThreadMembers = function(params, done) {
                  if (params['member_ids']) {
                    params['member_ids'] = params['member_ids'].join(',');
                  }
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['thread_id', 'member_ids'],
                    apiInfos: {
                      version: 1,
                      method: 'POST',
                      path: 'threads/remove-members'
                    }
                  });
                };
        
                Threads.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var ref, results;
                    ref = this;
                    results = [];
                    for (k in ref) {
                      v = ref[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return Threads;
        
              })(API);
              return module.exports = Threads;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Users', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Users, defaults;
              defaults = require('lodash').defaults;
              Users = (function(superClass) {
                extend1(Users, superClass);
        
                function Users() {
                  return Users.__super__.constructor.apply(this, arguments);
                }
        
                Users.prototype.getAuthenticatedUser = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'users/current'
                    }
                  });
                };
        
                Users.prototype.getUser = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['id'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'users/' + params['id']
                    }
                  });
                };
        
                Users.prototype.getUsers = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    requiredParams: ['ids'],
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'users/?' + params['ids'].join(',')
                    }
                  });
                };
        
                Users.prototype.getContacts = function(params, done) {
                  return this.requestAPI({
                    params: params,
                    done: done,
                    apiInfos: {
                      version: 1,
                      method: 'GET',
                      path: 'users/contacts'
                    }
                  });
                };
        
                Users.prototype.getMethods = function(params, done) {
                  var filtered, k, keys, to_exclude, v;
                  to_exclude = ['constructor', 'request', 'requestAPI', 'getMethods'];
                  keys = (function() {
                    var ref, results;
                    ref = this;
                    results = [];
                    for (k in ref) {
                      v = ref[k];
                      if (typeof v === 'function') {
                        results.push(k);
                      }
                    }
                    return results;
                  }).call(this);
                  filtered = keys.filter(function(method_name) {
                    return to_exclude.indexOf(method_name) === -1;
                  });
                  return done(filtered);
                };
        
                return Users;
        
              })(API);
              return module.exports = Users;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
          setModule('Utils', function() {
            var exports, module;
            module = {};
            exports = module.exports = {};
            (function(modules, module, exports, setModule, setter) {
              var Utils, each, filter, isFunction, isPlainObject, ref;
              ref = require('lodash'), isFunction = ref.isFunction, isPlainObject = ref.isPlainObject, each = ref.each, filter = ref.filter;
              Utils = (function() {
                function Utils() {}
        
                Utils.optionalParamsAndDone = function(options) {
                  var done, params;
                  if (options == null) {
                    options = {};
                  }
                  params = options.params, done = options.done;
                  if (!done) {
                    options.done = isFunction(params) ? params : function() {};
                  }
                  if (!isPlainObject(params)) {
                    options.params = {};
                  }
                  return options;
                };
        
                Utils.checkRequiredParams = function(params, required) {
                  if (required == null) {
                    required = [];
                  }
                  return filter(required, function(key) {
                    return !params[key];
                  });
                };
        
                return Utils;
        
              })();
              return module.exports = Utils;
            })(modules, module, exports, void 0, void 0);
            return module.exports;
          });
        
        }).call(this);
        
    }
    if(typeof module !== 'undefined' && module.exports){
        module.exports = modules['Quip'];
    } else {
        this['Quip'] = modules['Quip'];
    }
}).call(this);