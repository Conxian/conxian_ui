const fs = require('fs');
const path = require('path');

/* eslint-disable no-undef, no-console */

const generatedDir = path.join(__dirname, '..', 'src', 'lib', 'generated');
const baseJsonPath = path.join(generatedDir, 'base.json');

const baseJsonContent = {
  basePrincipal: 'ST3PPMPR7SAY4CAKQ4ZMYC2Q9FAVBE813YWNJ4JE6',
};

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

if (!fs.existsSync(baseJsonPath)) {
  fs.writeFileSync(baseJsonPath, JSON.stringify(baseJsonContent, null, 2));
  console.log(`Created ${baseJsonPath}`);
}
