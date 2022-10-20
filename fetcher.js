// Import all required libraries
const request = require('request');
const fs = require('fs');
const readline = require('readline');

// Read user input
const input = process.argv.splice(2);
const content = input[0];
const filePath = input[1];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Fetch the content from the webpage
request(content, (error, response, body) => {

  // If webpage isn't found, throw an error and stop the program
  if (error && error.code === 'ENOTFOUND') {
    console.log(`Error! Check your URL!`);
    rl.close();
    return;
  }

  fs.readFile(filePath, 'utf-8', (err, data) => {

    // Checks if the file does not already exist
    if (err && err.code === 'ENOENT') {
      console.log('The file does not already exist, attempting to download...');
    }

    // If the filepath is wrong, sends an error
    if (err) {
      console.log(`Error: no such file path!`);
      rl.close();
      return;
    }

    // Checks if the file does not exist OR is empty and downloads the file
    if (!data) {
      fs.writeFile(filePath, body, err => {
        if (err) {
          console.log(err);
        }
        console.log(`The file has been downloaded, ${body.length} bytes were downloaded to ${filePath}.`);
        rl.close();
      });

      // If the file is already made and not empty
    } else if (data.length > 0) {
      // Checks if you want to overwrite the file
      rl.question("The file already exists, would you like to overwrite it? (press y to continue)", (answer) => {
        if (answer === 'y') {
          
          // Overwrites the file
          fs.writeFile(filePath, body, err => {
            if (err) {
              console.log(err);
            }
          });
          console.log(`The file has been overwritten, ${body.length} bytes were downloaded to ${filePath}.`);
        }
        rl.close();
      });
    }
  }
  );
});