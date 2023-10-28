oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g helpy
$ helpy COMMAND
running command...
$ helpy (--version)
helpy/0.0.0 linux-x64 node-v18.18.2
$ helpy --help [COMMAND]
USAGE
  $ helpy COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`helpy hello PERSON`](#helpy-hello-person)
* [`helpy hello world`](#helpy-hello-world)
* [`helpy help [COMMANDS]`](#helpy-help-commands)
* [`helpy plugins`](#helpy-plugins)
* [`helpy plugins:install PLUGIN...`](#helpy-pluginsinstall-plugin)
* [`helpy plugins:inspect PLUGIN...`](#helpy-pluginsinspect-plugin)
* [`helpy plugins:install PLUGIN...`](#helpy-pluginsinstall-plugin-1)
* [`helpy plugins:link PLUGIN`](#helpy-pluginslink-plugin)
* [`helpy plugins:uninstall PLUGIN...`](#helpy-pluginsuninstall-plugin)
* [`helpy plugins:uninstall PLUGIN...`](#helpy-pluginsuninstall-plugin-1)
* [`helpy plugins:uninstall PLUGIN...`](#helpy-pluginsuninstall-plugin-2)
* [`helpy plugins update`](#helpy-plugins-update)

## `helpy hello PERSON`

Say hello

```
USAGE
  $ helpy hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/richdougherty/helpy/blob/v0.0.0/dist/commands/hello/index.ts)_

## `helpy hello world`

Say hello world

```
USAGE
  $ helpy hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ helpy hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/richdougherty/helpy/blob/v0.0.0/dist/commands/hello/world.ts)_

## `helpy help [COMMANDS]`

Display help for helpy.

```
USAGE
  $ helpy help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for helpy.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.19/src/commands/help.ts)_

## `helpy plugins`

List installed plugins.

```
USAGE
  $ helpy plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ helpy plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/index.ts)_

## `helpy plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ helpy plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ helpy plugins add

EXAMPLES
  $ helpy plugins:install myplugin 

  $ helpy plugins:install https://github.com/someuser/someplugin

  $ helpy plugins:install someuser/someplugin
```

## `helpy plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ helpy plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ helpy plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/inspect.ts)_

## `helpy plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ helpy plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ helpy plugins add

EXAMPLES
  $ helpy plugins:install myplugin 

  $ helpy plugins:install https://github.com/someuser/someplugin

  $ helpy plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/install.ts)_

## `helpy plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ helpy plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ helpy plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/link.ts)_

## `helpy plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ helpy plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ helpy plugins unlink
  $ helpy plugins remove
```

## `helpy plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ helpy plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ helpy plugins unlink
  $ helpy plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/uninstall.ts)_

## `helpy plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ helpy plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ helpy plugins unlink
  $ helpy plugins remove
```

## `helpy plugins update`

Update installed plugins.

```
USAGE
  $ helpy plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.7.0/src/commands/plugins/update.ts)_
<!-- commandsstop -->
