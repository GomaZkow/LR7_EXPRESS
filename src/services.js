const db = require("./DataBase/db");

module.exports = {
  pools: {
    getAll: async () => await db.getData("pools"),
    getById: async (id) => {
      const pools = await db.getData("pools");
      return pools.find(p => p.id === Number(id));
    },
    create: async (data) => {
      const pools = await db.getData("pools");
      const newPool = {
        id: pools.length ? Math.max(...pools.map(p => p.id)) + 1 : 1,
        ...data
      };
      pools.push(newPool);
      await db.saveData("pools", pools);
      return newPool;
    },
    update: async (id, data) => {
      const pools = await db.getData("pools");
      const index = pools.findIndex(p => p.id === Number(id));
      if (index === -1) return null;
      
      pools[index] = { ...pools[index], ...data };
      await db.saveData("pools", pools);
      return pools[index];
    },
    delete: async (id) => {
      let pools = await db.getData("pools");
      const initialLength = pools.length;
      pools = pools.filter(p => p.id !== Number(id));
      if (pools.length === initialLength) return false;
      
      await db.saveData("pools", pools);
      return true;
    }
  }
};