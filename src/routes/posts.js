import { Router } from 'express';

const router = Router();

router.get('/new', (req, res) => {
  return res.render('posts-new')
});

export default router;