import Router from 'express-promise-router';
import wbController from "../controllers/wbController";
const router = Router();

router.route('/homepage').get(wbController().homePage);
router.route('/comic').get(wbController().getComic);
router.route('/async-comic').get(wbController().asyncComic);

export default router