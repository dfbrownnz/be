// lib/fileUtils.ts

import * as fs from 'fs/promises';
import * as path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'data_list.json');

/**
 * Reads the data file, appends a new object to the 'todos' array, and writes the file back.
 * Creates the file with an empty structure if it doesn't exist.
 * @param {object} objectToAppend - The JSON object to add to the array.
 */
export async function appendTodo(objectToAppend) {
  const arrayKey = 'todos';
  let data = { [arrayKey]: [] };

  try {
    // 1. Read existing content
    const fileContent = await fs.readFile(DATA_FILE_PATH, { encoding: 'utf-8' });
    data = JSON.parse(fileContent);

  } catch (error) {
    if ((error ).code === 'ENOENT') {
      console.log('Data file not found. Creating a new one with an empty array.');
      // If the file doesn't exist, 'data' is already initialized to { todos: [] }
    } else {
      throw new Error(`Failed to read or parse data file: ${(error).message}`);
    }
  }

  // 2. Modify: Append the new object
  if (Array.isArray(data[arrayKey])) {
    data[arrayKey].push(objectToAppend);
  } else {
    // Handle case where file exists but 'todos' isn't an array
    data[arrayKey] = [objectToAppend];
  }
  
  // 3. Serialize and Write
  const jsonString = JSON.stringify(data, null, 2);
  await fs.writeFile(DATA_FILE_PATH, jsonString);
}