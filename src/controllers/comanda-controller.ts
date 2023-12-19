import { Request, Response } from 'express';
import { Comanda } from '../entities/Comanda';
import { DetalleComanda } from '../entities/DetalleComanda';
import { setState } from './mesas-controller';

/*
Metodo para buscar las comandas de una mesa, usando el ORM de typeorm
*/
export const getComandaByMesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.query;
    const comanda = await Comanda.findOne({
      where: { idMesa: parseInt(id), estado: String(estado) },
      relations: [
        'detalleComanda',
        'mesa',
        'detalleComanda.producto'
      ]
    });
    res.json(comanda);
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/*
Metodo para actualizar el estado de la comanda, usando el ORM de typeorm
*/
export const updateStateComanda = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const comanda = await Comanda.findOne({ where: { idMesa: parseInt(id), estado: "Abierta" } });
    if (comanda) {
      comanda.estado = estado;
      await comanda.save();
      res.json({ message: 'Comanda actualizada' });
    } else {
      res.status(404).json({ message: 'Comanda no encontrada' });
    }
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/*
Metodo para obtener las comandas, usando el ORM de typeorm
*/
export const getComandas = async (req: Request, res: Response) => {
  try {
    const comandas = await Comanda.find({ order: { id: 'DESC' } });
    res.json(comandas);
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/*
    TODO: Metodo para crear una comanda
    TODO: Crear el detalle comanda
    TODO: terminar pedido cambia el estado de la mesa a 'OCUPADO'
    TODO: cancelar pedido cambia el estado de la mesa a 'DISPONIBLE'
*/

export const crearComanda = async (req: Request, res: Response) => {
  const { carrito, observaciones, mesa, total } = req.body;
  try {
    const comanda = new Comanda();
    comanda.init(total, mesa, new Date(), observaciones, 'Abierta');
    comanda.detalleComanda = crearDetalles(carrito, comanda);
    Comanda.save(comanda);
    setState(mesa, 'Ocupado');
    return res.json({ message: 'Comanda creada' });
  } catch (error) {

    console.error(error);
    setState(mesa, 'Disponible');
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

const crearDetalles = (productos: any, comanda: Comanda) => {
  let detalles: any = [];
  for (const product of productos) {
    for(const costoProducto of product.costoProductoTamanio){
      const detalleComanda = new DetalleComanda();
      detalleComanda.init(
        0,
        costoProducto.total, 
        costoProducto.cantidad, 
        costoProducto.idProducto,
        costoProducto.tamanio
        )
      detalles.push(detalleComanda);
    }
  }
  return detalles;
};

/*
Metodo para obtener las ultimas cinco comandas, usando el ORM de typeorm
*/
export const getLastComandas = async (req: Request, res: Response) => {
  try {
    const comandas = await Comanda.find({ order: { id: 'DESC' }, take: 5 });
    res.json(comandas);
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};
