const fs = require('fs')

const fileContents = fs.readFileSync('log').toString()
let details = []
let keyStringStart = '.  AssertionError  '
let section = fileContents.split(keyStringStart)

if (section.length > 1) {
    for (var i = 1; i < section.length; i++) {
        let string = section[i].substring( 0, section[i].indexOf( ", time differense in seconds:" ) ).replace("", "")
        details.push(string)
    }
} else {
    details = ["No issues"]
}

details = details.join('\n')
console.log(details);

fs.writeFile("details.txt", details, function (err) {

    // Checks if there is an error
    if (err) return console.log(err);
  });