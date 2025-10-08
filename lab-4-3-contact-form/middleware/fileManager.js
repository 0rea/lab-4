const fs = require('fs').promises;
const path = require('path');
const DATA_DIR = path.join(__dirname, '../data');

const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch (error) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

const readJsonFile = async (filename) => {
  try {
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeJsonFile = async (filename, data) => {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  return true;
};

const appendToJsonFile = async (filename, newData) => {
  const existingData = await readJsonFile(filename);
  const dataWithId = {
    id: Date.now(),
    ...newData,
    createdAt: new Date().toISOString()
  };
  existingData.push(dataWithId);
  await writeJsonFile(filename, existingData);
  return dataWithId;
};

const getFileStats = async () => {
  const contacts = await readJsonFile('contacts.json');
  const feedbacks = await readJsonFile('feedback.json');
  return { contacts: contacts.length, feedbacks: feedbacks.length };
};

module.exports = { readJsonFile, writeJsonFile, appendToJsonFile, getFileStats };
