const controllers = require("./controllers");

module.exports = (router) => {
  
  router.get("/pools", controllers.poolController.getAll);
  router.get("/pools/:id", controllers.poolController.getById);
  router.post("/pools", controllers.poolController.create);
  router.put("/pools/:id", controllers.poolController.update);
  router.delete("/pools/:id", controllers.poolController.delete);
  
  return router;
};