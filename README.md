## DEPRECATED

Please use the official node library: https://github.com/quip/quip-api/tree/master/nodejs

# quip.js

Simple Node.js wrapper (browser included) and CLI for Quip REST API.

[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![Build Status](https://travis-ci.org/kwent/quip.js.svg?branch=master)](https://travis-ci.org/kwent/quip.js)
[![npm version](https://img.shields.io/npm/v/quip.js.svg?style=flat)](https://www.npmjs.com/package/quip.js)
[![Dependency Status](https://david-dm.org/kwent/quip.js.svg?theme=shields.io)](https://david-dm.org/kwent/quip.js)
[![devDependency Status](https://david-dm.org/kwent/quip.js/dev-status.svg?theme=shields.io)](https://david-dm.org/kwent/quip.js)

[![Quip Logo](https://github.com/kwent/quip.js/blob/master/assets/quip_logo.png?raw=1)](https://quip.com/)

See [Quip API Reference](https://quip.com/api/reference).

# Installation

Just install the module using npm.

```bash
$ npm install quip.js
```

If you want to save it as a dependency, just add the `--save` option.

```bash
$ npm install quip.js --save
```

If you want to install with the **CLI** executable, just add the `--global` option.

```bash
$ npm install quip.js --global
```

# Quip API

This is a simple presentation of the Quip API and its methods.
To get more information (parameters, response data, ...) use the [Quip API Reference](https://quip.com/api/reference)

# Javascript wrapper

```js
var Quip = require('Quip.js');
var Quip = new Quip({
    // Quip Access Token (required)
    accessToken: 'accessToken'
});
```

This is how to use an API on the `Quip` object

```js
Quip.api.method(params, callback);
```

All arguments are optional by default :
- `params` : object hash with request parameters
- `callback` : function called with 2 arguments (`error`, `data`)

The `data` arguments passed to the callback is an object hash, holding the response data. (see API documents)

Both the `params` and `callback` are optional, so you can call any method these ways :

```js
// Both params and callback
Quip.api.method(params, callback);
// Only params parameter
Quip.api.method(params);
// Only callback parameter
Quip.api.method(callback);
// No parameter
Quip.api.method();
```

**N.B** : If the `params` parameter is not passed, but the method expects **required parameters**, an `Error` will be
thrown.

## Examples

```js
// Threads API - Get recent threads
Quip.th.getRecentThreads(callback);
// Threads API - Create a new document
Quip.th.createDocument({title: 'Title', content: '<h1>Title</h1><p>First paragraph</p>'}, callback);
// Threads API - Edit a document by prepending content
Quip.th.editDocument({thread_id: 'threadId', content: '<p>New Section</p>', location: Quip.Operation.PREPEND}, callback);
// Messages API - Create a new message in a thread_id
Quip.msg.newMessage({thread_id: 'threadId', content: 'New Message'}, callback);
// Folders API - Create a new folder with a green cover
Quip.fdr.newFolder({title: 'My New Folder', color: Quip.Color.GREEN}, callback);
// Folders API - Update folder_id with a red cover
Quip.fdr.updateFolder({folder_id: 'folderId', color: Quip.Color.RED}, callback);
// Users API - Get all user's contacts
Quip.usr.getContacts(callback);

```
# CLI

```
$ quip --help
Usage: quip [options]

  Quip Rest API Command Line

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -c, --config <path>        Quip Configuration file. Default to ~/.quip-cli/config.yaml
    -t, --accessToken <token>  Quip Access Token
    -d, --debug                Enabling Debugging Output

  Commands:

    threads|th [options] <method> Quip Threads API
    messages|msg [options] <method> Quip Messages API
    folders|fdr [options] <method> Quip Folders API
    users|usr [options] <method> Quip Users API

  Examples:

    $ quip threads|th getRecentThreads
    $ quip messages|msg getMessages --payload '{"thread_id": "threadId"}' --pretty
    $ quip folders|fdr newFolder --payload '{"title": "My New Folder"}' --pretty
    $ quip users|usr getAuthenticatedUser
```
## Examples

```bash
# Threads API - Get recent threads
$ quip th getRecentThreads --pretty
# Threads API - Create a new document
$ quip th createDocument --payload '{"title": "Title", "content": "<h1>Title</h1><p>First paragraph</p>"}' --pretty
# Threads API - Edit a document by prepending content
$ quip th editDocument --payload '{"thread_id": "threadId", "content": "<p>New Section</p>", "location": 1}' --pretty
# Messages API - Create a new message in a thread_id
$ quip msg newMessage --payload '{"thread_id": "threadId", "content": "New Message"}' --pretty
# Folders API - Create a new folder with a green cover
$ quip fdr createFolder --payload '{"title": "My New Folder", "color": 3}' --pretty
# Folders API - Update folder_id with a red cover
$ quip fdr updateFolder --payload '{"folder_id": "folderId", "color": 1}' --pretty
# Users API - Get all user's contacts
$ quip usr getContacts --pretty
```


## CLI Authentication

### Without a configuration file

```bash
$ quip th getRecentThreads --accessToken accessToken --pretty
```

### With a configuration file

```yaml

# Example config file, by default it should be located at:
# ~/.quip-cli/config.yaml

auth:
  accessToken: accessToken
```

```bash
$ quip th getRecentThreads --pretty
```

### With `QUIP_ACCESS_TOKEN` environment variable

**Notes**: Override `--accessToken` and configuration file.

```bash
$ QUIP_ACCESS_TOKEN=accessToken quip th getRecentThreads --pretty
```

More usage [examples](https://github.com/kwent/quip.js/wiki/CLI) in the [wiki](https://github.com/kwent/quip.js/wiki).

# Browser

### Note

Be sure to disable [same-origin policy](http://en.wikipedia.org/wiki/Same-origin_policy) in your browser.

## Example

```html
<html>
  <head>
  <script src="quip.min.js"></script>
  <script type="text/javascript">
  var Quip = require('quip.Quip');
  var Quip = new Quip({
      // Quip Access Token (required)
      accessToken: 'accessToken'
  });

  Quip.th.getRecentThreads(function(error, data) {
    console.log(data)  
  });
  </script>
  </head>
<html>
```

## Demo

A demo is available [online](http://kwent.github.io/quip.js/) or in the `test/browser` folder.

# Authors

- [Quentin Rousseau](https://github.com/kwent)

# License

```plain
Copyright (c) 2015 Quentin Rousseau <contact@quent.in>

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```
