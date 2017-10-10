const crytpo = require('crypto');
const fs = require('fs');
const start = new Date().getTime();
const dir = process.cwd() + '/hashes';
const child_process = require('child_process');
const max_chars = process.argv[2] || 8;

let i = 0, chars = 0;

console.log(`Working directory: ${dir}`);
console.log(`Checking strings up to ${max_chars} chars.`)

if (fs.existsSync(dir)){
  console.log(`Directory "${dir}" already exists, please delete it..`);
  process.exit(1); 
} else {
  fs.mkdirSync(dir);
}

if (fs.readdirSync(dir).length) {
}

while(chars <= max_chars) {

  // Lowercasels 
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

  // Next
  i++;
}

console.log('Done!');

function md5(str) {
  return crytpo.createHash('md5').update(str).digest('hex').toString();
}


function trySave(str, hash) {
  fs.open(`${dir}/${hash}`, 'w', (err, fd) => {
    if (err && err.code === 'EEXIST') {
      console.error(`Colission detected for string "${str}" at ${hash}`);
      process.exit(1);
    }
    else if (err && err.code === 'EMFILE') {
      console.error(`Too many open files, backing off...`);
      child_process.execSync(process.platform === 'linux' ? 'SLEEP 5' : 'PING localhost -n 4 >nul');
    } 
    else if (err) {
      console.error(`Problem saving ${hash}: ${err}`);
    } 
    else {
      const buffer = new Buffer(str);
      fs.write(fd, buffer, 0, buffer.length, null, () => fs.close(fd));
    }
  });
}
