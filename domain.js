var t = require('tcomb');

var SvnPubOptions = t.struct({
  url: t.Str,
  srcDir: t.Str,
  tmpDir: t.Str,
  username: t.Str,
  password: t.Str,
});

var CommitOptions = t.struct({
  message: t.Str,
  deleteFiles: t.maybe(t.Bool),
});


exports.SvnPubOptions = SvnPubOptions;
exports.CommitOptions = CommitOptions;
