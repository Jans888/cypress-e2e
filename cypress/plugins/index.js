/// <reference types="cypress" />
/// <reference types="@shelex/cypress-allure-plugin" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const allureWriter = require('@shelex/cypress-allure-plugin/writer')
const debug = require("debug")
const path = require("path")
const gmail = require("node_modules/gmail-tester")
const gmail_tester = require("node_modules/gmail-tester")

const fs = require('fs')
const pdf = require('pdf-parse');
const repoRoot = 'cypress/objects/agreements/' // assumes pdf at project root

const parsePdf = async (pdfName) => {
  let options = {
    version: 'v2.0.550'
};
const pdfPathname = 'cypress/downloads/' + pdfName + ''
  let dataBuffer = fs.readFileSync(pdfPathname);
  return await pdf(dataBuffer, options)  // use async/await since pdf returns a promise 
}

const downloadDirectory = path.join(__dirname, '..', 'downloads'); 
const findPDF = (PDFfilename) => {
  const PDFFileName = `${downloadDirectory}\\${PDFfilename}`;
  const contents = fs.existsSync(PDFFileName);
  return contents;
}
    
const hasPDF = (PDFfilename, ms) => {
  const delay = 10
  return new Promise((resolve, reject) => {
    if (ms < 0) {
      return reject(
        new Error(`Could not find PDF ${downloadDirectory}\\${PDFfilename}`)
      )
    }
    const found = findPDF(PDFfilename);
    if (found) {
      return resolve(true);
    }
    setTimeout(() => {
      hasPDF(PDFfilename, ms - delay).then(resolve, reject);
    }, 10)
  })
}

module.exports = (on, config) => {
    on("before:browser:launch", (browser = {}, launchOptions) => {
      // `args` is an array of all the arguments that will
      // be passed to browsers when it launches
      console.log(launchOptions.args); // print all current args
      if (browser.family === "chromium" && browser.name !== "electron") {
        // auto open devtools
        launchOptions.args.push();
        // allow remote debugging
        // launchOptions.args.push("--remote-debugging-port=9221");
        // whatever you return here becomes the launchOptions
      } else if (browser.family === "firefox") {
        // auto open devtools
        launchOptions.args.push();
      }
      return launchOptions;
    });
    on("task", {
      "gmail:get-messages": async args => {
        const messages = await gmail_tester.get_messages(
          path.resolve("C:\\gmail\\credentials.json"),
          path.resolve("C:\\gmail\\token.json"),
          args.options
        );
        return messages;
      },
      "gmail:check-inbox": async args => {
        const messages = await gmail_tester.check_inbox(
          path.resolve("C:\\gmail\\credentials.json"),
          path.resolve("C:\\gmail\\token.json"),
          args.options
        );
        return messages;
      },
      isExistPDF(PDFfilename, ms = 4000) {
        console.log(
          `looking for PDF file in ${downloadDirectory}`,
          PDFfilename,
          ms
        )
        return hasPDF(PDFfilename, ms)
      },
      getPdfContent (pdfName) {   
        return (parsePdf(pdfName))
      }

    });
    allureWriter(on, config);
    return config;
  }