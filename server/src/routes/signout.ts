import express from 'express';

const router = express.Router();

router.post('/api/signout', async (req, res) => {
  req.session = null;

  res.status(200).send({});
});

export { router as signoutRoute };
