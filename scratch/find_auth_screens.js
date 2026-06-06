const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('C:\\Users\\welde\\.gemini\\antigravity-cli\\brain\\f69f08fe-1d8f-49c6-b44e-66ede7a66a14\\.system_generated\\steps\\24\\output.txt', 'utf8');
const data = JSON.parse(content);

console.log("Searching projects for screens related to authentication/login...");

data.projects.forEach(p => {
  // Let's print project title and scan its designMd, screenInstances, etc.
  const title = p.title || "Untitled";
  let found = false;
  const matches = [];

  if (p.screenInstances) {
    p.screenInstances.forEach(si => {
      const screenName = si.sourceScreen || "";
      if (screenName.toLowerCase().includes("auth") || 
          screenName.toLowerCase().includes("login") || 
          screenName.toLowerCase().includes("signin") ||
          screenName.toLowerCase().includes("entrar") ||
          screenName.toLowerCase().includes("cadastro")) {
        matches.push(`Instance: ${si.id}, Source: ${si.sourceScreen}`);
        found = true;
      }
    });
  }

  // Also scan screen list if we can
  if (found) {
    console.log(`\nProject: ${title} (${p.name})`);
    matches.forEach(m => console.log(`  - ${m}`));
  }
});
