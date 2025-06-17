const fs = require('fs').promises;
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

module.exports = {
  getData: async (key) => {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      return JSON.parse(data)[key] || [];
    } catch (error) {
      if (error.code === 'ENOENT') {
        await fs.writeFile(dbPath, JSON.stringify({ pools: [] }));
        return [];
      }
      throw error;
    }
  },

  saveData: async (key, value) => {
    let data = {};
    try {
      const fileData = await fs.readFile(dbPath, 'utf-8');
      data = JSON.parse(fileData);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    
    data[key] = value;
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
  }
};