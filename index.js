const crytpo = require('crypto');
const fs = require('graceful-fs');
const start = new Date().getTime();
const dir = process.cwd() + '/files';

let chars = 0;

console.log(`Working directory: ${dir}`);

if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
}

if (fs.readdirSync(dir).length) {
  console.log(`Too many files in directory "${dir}", please delete it..`);
}

for(var i = 1; i < 1000000; i++) {

  // Lowercase
  const str = i.toString(36);
  trySave(str, md5(str));

  // Uppercase if it contains letters
  if (str.match(/[a-zA-Z]/)) {
    const STR = str.toUpperCase();
    trySave(STR, md5(STR));
  }

  // Check char length
  if (str.length !== chars) {
    chars = str.length;
    let now = new Date().getTime();
    console.log(`Chars: ${chars}, ${Math.round(i / ((now - start) / 1000))} items/second`);
  }
}

function md5(str) {
  return crytpo.createHash('md5').update(str).digest('hex').toString();
}


function trySave(str, hash) {
  fs.open(`${dir}/${hash}`, 'wx', (err, fd) => {
    if (err && err.code === 'EEXIST') {
      console.error(`Colission detected for string "${str}" at ${hash}`);
      process.exit(1);
    } else if (err) {
      console.error(`Problem saving ${hash}: ${err}`);
    } else {
      const buffer = new Buffer(str);
      fs.write(fd, buffer, 0, buffer.length, null, () => fs.close(fd));
    }
  });
}