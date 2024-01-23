const router = require('express').Router();

router.get('/', async (req, res, next) => {
  res.send({ message: 'Alert Patrol api is ready 🚀' });
});

module.exports = router;
