const fs = require('fs')

const fileContents = fs.readFileSync('log').toString()
let details = []
let keyStringStart = 'AssertionError:'
let section = fileContents.split(keyStringStart)
console.log(section.length);

if (section.length > 1) {
    for (var i = 1; i < section.length; i++) {
        let errorTemp = section[1].substring( 0, section[1].indexOf( "ts:" ) ).replace("      at Context.eval (https://example.cypress.io/__cypress/tests?p=", "-> ")
        let addText = "\nAssertionError:"
        let error = addText.concat(errorTemp).concat("ts\n")
        details.push(error)
    }
} else {
    details = ["No issues"]
}

details = details.join('\n')

fs.writeFile("details.txt", details, function (err) {

    // Checks if there is an error
    if (err) return console.log(err);
  })