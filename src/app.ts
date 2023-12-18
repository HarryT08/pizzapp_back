import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
//Importación de rutas
import productsRoutes from './routes/productos-routes';
import mesasRoutes from './routes/mesas-routes';
import usuariosRoutes from './routes/usuarios-routes';
import personasRoutes from './routes/personas-routes';
import authRoutes from './routes/auth-routes';
import comandaRoutes from './routes/comanda-routes';
import detalleComandaRoutes from './routes/detallecomanda-routes';


export class App {
  private app: Application;

  constructor() {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set('port', process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(cookieParser());
  }

  routes() {
    this.app.use('/productos', productsRoutes);
    this.app.use('/mesas', mesasRoutes);
    this.app.use('/usuarios', usuariosRoutes);
    this.app.use('/personas', personasRoutes);
    this.app.use('/auth', authRoutes);
    this.app.use('/comanda', comandaRoutes);
    this.app.use('/detallecomanda', detalleComandaRoutes);
  }

  async listen() {
    await this.app.listen(this.app.get('port'));
    console.log('Server on port', this.app.get('port'));
  }
}
