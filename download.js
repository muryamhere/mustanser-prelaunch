import https from 'https';
import fs from 'fs';

const file = fs.createWriteStream("public/icon.png");
https.get("https://res.cloudinary.com/mustanser/image/upload/v1777858879/Group_1_ftoi8r.png", function(response) {
  response.pipe(file);
});
