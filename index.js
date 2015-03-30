var path = require('path');
var q = require('q');
var fs = require('q-io/fs');
var SVN = require('q-svn-spawn');
var domain = require('./domain');


function SvnPub(options) {
  options = this.options = new domain.SvnPubOptions(options);
  var svn = this.svn = new SVN({
    cwd: options.tmpDir,
    username: options.username,
    password: options.password,
  });
};

module.exports = SvnPub;

SvnPub.prototype.commit = function(commitOptions) {
  commitOptions = new domain.CommitOptions(commitOptions);
  var svn = this.svn;

  return makeTree(this.options.tmpDir)
    .then(clone.bind(null, svn, this.options.url))
    .then(function() {
      if (commitOptions.deleteFiles) {
        return;
      }
      return clean.bind(null, this.options.tmpDir)
    }.bind(this))
    .then(copy.bind(null, svn, this.options.srcDir, this.options.tmpDir))
    .then(add.bind(null, svn))
    .then(commit.bind(null, svn, commitOptions.message));
};


function makeTree(dir) {
  return fs.makeTree(dir);
}

function clone(svn, url) {
  return svn.checkout(url);
}

function copy(svn, srcDir, tmpDir) {
  return fs.copyTree(srcDir, tmpDir);
}

function add(svn) {
  return svn.addLocal({
    status: null
  });
}

function clean(svnDir) {
  return fs.list(svnDir)
    .then(removeListSkipSvnFolder.bind(null, svnDir));
}

function removeListSkipSvnFolder(dir, files) {
  console.log('files:', files);
  var promise = q.when(null);
  files.forEach(function(file) {
    if (file !== '.svn') {
      promise = promise.then(remove.bind(null, dir, file));
    }
  });
  return promise;
}

function remove(dir, root) {
  return fs.removeTree(path.join(dir, root)); //TODO: DS!
}

function commit(svn, commitMessage) {
  return svn.commit(commitMessage);
}
