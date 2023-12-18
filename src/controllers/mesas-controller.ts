import { Request, Response } from 'express';
import { Mesa } from '../entities/Mesa';

/*
Metodo para buscar todas las mesas, usando el ORM de typeorm
*/
export const getMesas = async (req: Request, res: Response) => {
  const mesas = await Mesa.find();
  return res.json(mesas);
};

/*
Metodo para buscar las mesas por su estado, usando el ORM de typeorm
*/
export const getMesasByEstado = async (req: Request, res: Response) => {
  try {
    const { estado } = req.params;
    const mesas = await Mesa.findBy({ estado: estado });
    return res.json(mesas);
  } catch (error) {
    console.log(error);

    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/*
Metodo para crear una mesa, usando el ORM de typeorm
*/
export const createMesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    var mesa = await Mesa.findOneBy({ id: id });
    if (mesa) {
      return res
        .status(404)
        .json({ message: 'El número de mesa ' + id + ' ya existe' });
    }
    mesa = new Mesa();
    mesa.init(id, 'Disponible');
    await mesa.save();
    res.status(202).json({ message: 'Mesa creada' });
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/* 
Método para eliminar una mesa, usando el ORM de typeorm
*/
export const deleteMesa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Mesa.delete({ id: parseInt(id) });
    if (result.affected === 0)
      return res.status(404).json({ message: 'Mesa no encontrada' });

    return res.status(202).json({ message: 'Mesa eliminada' });
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/*
Metodo para actualizar el estado de una mesa, usando el ORM de typeorm
*/
export const updateStateMesa = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { estado } = req.body;
  let response = await setState(parseInt(id), estado);
  return res.status(response.status).json({
    message: response.message
  });
};

export const setState = async (id: number, estado: string) => {
  let response = {
    message: 'Mesa no encontrada',
    status: 404
  };

  try {
    const mesa = await Mesa.findOneBy({ id: id });
    if (mesa) {
      mesa.estado = estado;
      await mesa.save();
      response.message = 'Mesa actualizada';
      response.status = 202;
    }
  } catch (error) {
    if (error instanceof Error) {
      response.message = error.message;
      response.status = 500;
    }
  }
  return response;
};
