const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('C:\\Users\\welde\\.gemini\\antigravity-cli\\brain\\f69f08fe-1d8f-49c6-b44e-66ede7a66a14\\.system_generated\\steps\\38\\output.txt', 'utf8');
const data = JSON.parse(content);

console.log("Screens in Dashboard Central project:");
data.screens.forEach(s => {
  console.log(`- Title: "${s.title}" (ID: ${s.name})`);
});
