import { Express } from 'express';
import ntRoutes from './nt.routes';
import wbRoutes from './weeboo';

import proxyController from '../controllers/proxy.controller';

function route(app: Express) {
    const src_1 = 'nt';
    const src_2 = 'wb';

    app.use(`/api/${src_1}`, ntRoutes);
    app.use('/api/proxy', proxyController().corsAnywhere);
    app.use(`/api/${src_2}`, wbRoutes);
}

export default route;
