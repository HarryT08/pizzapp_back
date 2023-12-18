import { Request, Response } from 'express';
import { MoreThanOrEqual, QueryRunner } from 'typeorm';
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

const calculateTotal = (data: any) => {
  let total = 0;
  for (const product of data) {
    const { cantidad, costo } = product;
    total += cantidad * costo;
  }
  return total;
};

export const crearComanda = async (req: Request, res: Response) => {
  
};

const crearDetalles = async (
  comanda: Comanda,
  productos: any,
  queryRunner: QueryRunner
) => {
  for (const product of productos) {
    const subtotal = product.costo * product.cantidad;
    const detalleComanda = new DetalleComanda();

    detalleComanda.init(
      comanda.id,
      subtotal,
      product.cantidad,
      product.id,
      product.tamanio
    );

    await queryRunner.manager.save(detalleComanda);
  }
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
