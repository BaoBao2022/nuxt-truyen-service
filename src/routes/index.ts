import { Express } from 'express';
import ntRoutes from './nt.routes';
import proxyController from '../controllers/proxy.controller';

function route(app: Express) {
    const src_1 = 'nt';

    app.use(`/api/${src_1}`, ntRoutes);
    app.use('/api/proxy', proxyController().corsAnywhere);
}

export default route;
