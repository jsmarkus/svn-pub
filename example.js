var SvnPub = require('./');

var pub = new SvnPub({
  srcDir: './code',
  username: '****@gmail.com',
  password: '****',
  tmpDir: './tmp',
  url: '****',
});

pub.commit({
  message: 'Hello'
}).catch(function(error) {
  console.error(error.stack);
});
