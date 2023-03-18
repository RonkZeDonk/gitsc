# GitSC

GitSC (git switch config) is a simple git config switcher written in Node.js.
The entire project sits around 150 lines of code and has no
dependencies other than the Node.js file system library.

## Installation

First make sure you have Node.js installed. You can install it from your package
manager, using [fnm](https://github.com/Schniz/fnm), or similar tools such as
[n](https://github.com/tj/n), [nvm](https://github.com/nvm-sh/nvm), etc.

Next clone the GitSC repository and add a symlink to the 'start' file in a
folder that is in PATH.

Once `gitsc` is in PATH, you can run `gitsc setup` to setup GitSC. A symlink
will be created from `~/.config/git/config` to a file managed by GitSC.

> Your old git config file will be moved to `~/.config/git/config.old` and
> copied to GitSC. The config will be named default.

Here is the easiest way to install GitSC:
```shell
# Download GitSC
$ cd ~/.local/bin
$ git clone https://github.com/RonkZeDonk/gitsc
# Add gitsc to path
$ sudo ln -s $PWD/gitsc/start /usr/local/bin/gitsc
# Setup GitSC (make symlinks to new config)
$ gitsc setup
```

## Usage

To use GitSC, place your named git configs in the `$INSTALL_DIR/configs`
folder.

- To list all available configs use `gitsc list`.
- To use a config use `gitsc use <CONFIG NAME>`