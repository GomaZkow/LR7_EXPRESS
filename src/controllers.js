const db = require('./DataBase/db');

module.exports = {
  poolController: {
    getAll: async (req, res) => {
      try {
        const pools = await db.getData('pools');
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(pools));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Database error' }));
      }
    },

    getById: async (req, res) => {
      try {
        const pools = await db.getData('pools');
        res.setHeader("Content-Type", "application/json");
        const pool = pools.find(p => p.id == req.params.id);
        
        if (!pool) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Pool not found' }));
        }
        
        res.end(JSON.stringify(pool));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Database error' }));
      }
    },

    create: async (req, res) => {
      try {
        const pools = await db.getData('pools');
        const newPool = {
          id: pools.length ? Math.max(...pools.map(p => p.id)) + 1 : 1,
          ...req.body,
          createdAt: new Date().toISOString()
        };
        
        pools.push(newPool);
        await db.saveData('pools', pools);
        
        res.statusCode = 201;
        res.end(JSON.stringify(newPool));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    },

    update: async (req, res) => {
      try {
        const pools = await db.getData('pools');
        const index = pools.findIndex(p => p.id == req.params.id);
        
        if (index === -1) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Pool not found' }));
        }
        
        pools[index] = {
          ...pools[index],
          ...req.body,
          updatedAt: new Date().toISOString()
        };
        
        await db.saveData('pools', pools);
        res.end(JSON.stringify(pools[index]));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: 'Bad request' }));
      }
    },

    delete: async (req, res) => {
      try {
        let pools = await db.getData('pools');
        const initialLength = pools.length;
        
        pools = pools.filter(p => p.id != req.params.id);
        
        if (pools.length === initialLength) {
          res.statusCode = 404;
          return res.end(JSON.stringify({ error: 'Pool not found' }));
        }
        
        await db.saveData('pools', pools);
        res.end(JSON.stringify({ message: 'Pool deleted' }));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: 'Server error' }));
      }
    }
  }
};