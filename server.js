
// npm init -y
// npm install express cors

// Node.js backend (Express)
const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
const path = require('path')


// Enable CORS for React frontend
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node!' });
});

app.get('/todo', (req, res) => {

  // The new object to be appended
  const newObject = {
    id: 4,
    title: 'Review Docker Setup',
    completed: false,
    manager: 'Sarah', 
    dt : DateTimeFormattedCurrent().date, 
    tt : DateTimeFormattedCurrent().time , 
    tz : DateTimeFormattedCurrent().timezone
  };

  // const cwd = path.join(process.cwd(), 'data');
  const cwdLocal = process.cwd() + path.sep + 'data' ;

  folderCheck(cwdLocal)
  const fileName = cwdLocal + path.sep + 'new_data.json';
  //const filePath = path.join(cwd, fileName);
  const rtnmsg1 = filecheckExists(fileName)
  const rtnmsg = fileWrite(fileName, newObject)
  // Accessing environment details using Node.js's 'process' global object
  const envInfo = {
    // Current working directory
    cwd: process.cwd(),
    msg: rtnmsg,
    rtnmsg1 : rtnmsg1, 
    //  files: fs.readdirSync(cwdLocal) ,

    // Node.js version
    nodeVersion: process.version,

    // Operating System Platform (e.g., 'linux', 'win32')
    platform: process.platform,

    // Process ID
    pid: process.pid,

    // Example of a specific environment variable (use with caution)
    // pathEnv: process.env.PATH, 
  };

  // res.json({ message: 'Hello from todo!', myMsg: envInfo, files: fs.readdirSync(cwdLocal) });
  res.json({ message: 'Hello from todo!', myMsg: envInfo });
});


function folderCheck() {
  const folderName = 'data_exports';
  const targetPath = './' + folderName; // Relative path

  if (!fs.existsSync(targetPath)) {
    try {
      // The { recursive: true } option is important here too
      fs.mkdirSync(targetPath, { recursive: true });
      console.log(`Folder "${folderName}" created successfully.`);
    } catch (error) {
      console.error(`Failed to create folder: ${error.message}`);
    }
  } else {
    console.log(`Folder "${folderName}" already exists.`);
  }
}

function filecheckExists(filePath) {

  let retunMsg = { msg: "" }
  // const fileName = 'new_data.json';
  // const filePath = path.join(process.cwd(), fileName);
  const defaultContent = '{"status": "new"}';

  if (!fs.existsSync(filePath)) {
    try {

      const jsonString = JSON.stringify([], null, 2);

      // 5. Write: Overwrite the file with the new content
      //await fs.writeFile(filePath, jsonString);
      fs.writeFileSync(filePath, jsonString);
      // Write the default content to the file
      // fs.writeFileSync(filePath, defaultContent);
      

          const ermsg = `File "${filePath}" created.`
    console.error(ermsg);
    retunMsg.msg = ermsg
    return retunMsg
    } catch (error) {

      const ermsg = `Failed to write file: ${error.message}`
      console.error(ermsg);
      retunMsg.msg = ermsg
      return retunMsg
    }
  } else {

    const ermsg = `File "${filePath}" already exists.`
    console.error(ermsg);
    retunMsg.msg = ermsg
    return retunMsg
  }
}
function fileWrite(filePath, rcd) {
  let retunMsg = { msg: "" }

  try {
    // 1. Read the existing file content
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    // 2. Parse the JSON string into a JavaScript object
    const data = JSON.parse(fileContent);

    // Ensure the data has the target array property and it is an array
    // if (!data[arrayKey] || !Array.isArray(data[arrayKey])) {
    //   console.error(`Error: File does not contain a valid array under the key "${arrayKey}".`);
    //   return;
    // }

    if (!Array.isArray(data)) {

      const ermsg = `Error: File does not contain a valid array  "${data}".`
      console.error(ermsg);
      retunMsg.msg = ermsg
      return retunMsg
      return;
    }
    // 3. Modify: Append the new object
    //data[arrayKey].push(rcd);
    data.push(rcd);

    // 4. Serialize: Convert the modified object back to a formatted JSON string (2-space indent)
    const jsonString = JSON.stringify(data, null, 2);

    // 5. Write: Overwrite the file with the new content
    //await fs.writeFile(filePath, jsonString);
    fs.writeFileSync(filePath, jsonString);


    const ermsg = `Successfully appended new object to the array in ${filePath}. New object: ${JSON.stringify(rcd)}`
    console.error(ermsg);
    retunMsg.msg = ermsg
    return retunMsg

  } catch (error) {
    if (error.code === 'ENOENT') {
      const ermsg = `Error: File not found at ${filePath}. Make sure the file exists first.`
      console.error(ermsg);
      retunMsg.msg = ermsg
      return retunMsg
    } else {

      const ermsg = `Failed to append JSON object ${error.message}. .`
      console.error(ermsg);
      retunMsg.msg = ermsg
      return retunMsg
    }
  }
}

/**
 * Returns an object containing the current date in YYYYMMDD and time in HH_mm_ss formats.
 * @returns {{date: string, time: string}} 
 */
function DateTimeFormattedCurrent() {
const now = new Date();

  // Helper function to pad single digits with a leading zero
  const pad = (num) => num.toString().padStart(2, '0');
  
  // --- Date Components (YYYYMMDD) ---
  const year = now.getFullYear();
  // Months are 0-indexed, so add 1
  const month = pad(now.getMonth() + 1); 
  const day = pad(now.getDate());

  const formattedDate = `${year}${month}${day}`;

  // --- Time Components (HH_mm_ss) ---
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const formattedTime = `${hours}_${minutes}_${seconds}`;
  
  // --- Timezone Offset Component ---
  const offsetMinutes = now.getTimezoneOffset();
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = pad(Math.floor(absOffset / 60));
  const offsetMins = pad(absOffset % 60);
  
  // Determine sign (+ or -)
  const sign = offsetMinutes > 0 ? '-' : '+'; // Inverted because getTimezoneOffset returns (UTC - local)
  
  // Format timezone string (e.g., +05:00, -04:30, or Z for 0 offset)
  let timezoneString;
  if (offsetMinutes === 0) {
    timezoneString = 'Z'; // UTC/GMT
  } else {
    timezoneString = `${sign}${offsetHours}:${offsetMins}`;
  }

  return {
    date: formattedDate,
    time: formattedTime,
    timezone: timezoneString
  };
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});


