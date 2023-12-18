import { DataSource } from "typeorm";
import { Comanda } from "./entities/Comanda";
import { DetalleComanda } from "./entities/DetalleComanda";
import { Domicilio } from "./entities/Domicilio";
import { Mesa } from "./entities/Mesa";
import { Persona } from "./entities/Persona";
import { Preparacion } from "./entities/Preparacion";
import { Producto } from "./entities/Producto";
import { Rol } from "./entities/Rol";
import { User } from "./entities/User";
import { CostoProductoTamanio } from "./entities/CostoProductoTamanio";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [
    Comanda,
    DetalleComanda,
    Domicilio,
    Mesa,
    Persona,
    Preparacion,
    Producto,
    Rol,
    User,
    CostoProductoTamanio
  ],
});
