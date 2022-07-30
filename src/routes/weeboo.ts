import Router from 'express-promise-router';
import wbController from "../controllers/wbController";
const router = Router();

router.route('/homepage').get(wbController().homePage);
router.route('/comic').get(wbController().getComic);
router.route('/read-comic').get(wbController().readComic);
router.route('/chapters').get(wbController().getChapters);
router.route('/testController').get(wbController().testController);

export default router