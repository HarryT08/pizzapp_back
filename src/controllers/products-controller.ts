import { Request, Response } from 'express';
import { Preparacion } from '../entities/Preparacion';
import { Producto } from '../entities/Producto';
import { cleanProductName } from '../libs/cleanFunctions';
import { CostoProductoTamanio } from '~/entities/CostoProductoTamanio';

/*
Metodo para obtener un producto por su id, usando el ORM de typeorm
*/
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await Producto.findOne({
    where: {  id: parseInt(id), deleted: false },
    relations: ['costoProductoTamanio']
  });
  return res.json(product);
};

/*
Metodo para buscar todos los productos, usando el ORM de typeorm
*/
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Producto.find({ 
      where: { deleted: false },
      relations: ['costoProductoTamanio']
    });

    return res.json(products);
  } catch (error) {
    return res.json({
      message: error
    });
  }
};
/*
Metodo para crear un producto, usando el ORM de typeorm
*/
export const createProduct = async (req: Request, res: Response) => {
  let { nombre, costos } = req.body;
  const nameClean = cleanProductName(nombre);
  const product = await searchProduct(nameClean);

  if (product) {
    return res.status(400).json({
      message: 'El producto ya existe'
    });
  }  

  try {
    const newProduct = new Producto();
    newProduct.init(nameClean, costos);

    newProduct.costoProductoTamanio = initializePriceBySize(0, costos);
    Producto.save(newProduct);

    return res.status(201).json({
      message: 'Producto creado con exito'
    });

  } catch (error) {
    console.error(error);

    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

const uploadPreparationsAndPriceBySize = async (product : Producto, costos : {}, preparaciones : {}) => {
  //Borramos los costos anteriores
  try{
    await CostoProductoTamanio.delete({idProducto : product.id});
  }catch(error){
    console.error(error);
  }
}

/**
 *
 * Mapeo de costo de producto por tamanio
 * @param provisional ID provisional para poder ejecutar el init de costoProducto
 * @param costos objeto con los costos por tamaño del producto
 * @returns array con cada uno de los 'costoProducto' inicializado
 */
const initializePriceBySize = (provisional : number, costos : {}) => {
  let costosProductos : CostoProductoTamanio[] = [];
  Object.entries(costos).forEach(([tamanio, costo]) => {
    const costoProducto = new CostoProductoTamanio();
    costoProducto.init(provisional, tamanio, Number(costo));
    costosProductos.push(costoProducto);
  });
  return costosProductos;
}


const searchProduct = async (nombre: string) => {
  const producto = await Producto.findOne({
    where: {
      nombre: nombre,
      deleted: false
    },
    relations: ['costoProductoTamanio']
  });
  return producto;
};

/*
Metodo para eliminar un producto, usando el ORM de typeorm
*/
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number.parseInt(req.params['id']);
    console.log('Encontrado', id, typeof id);

    const product = await Producto.findOneBy({ id: id });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    product.deleted = true;
    await product.save();
    await Preparacion.delete({ id_producto: id });

    return res.status(200).json({
      message: 'Producto eliminado'
    });
  } catch (error) {
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};

/*
Metodo para actualizar un producto, usando el ORM de typeorm
*/
export const updateProduct = async (req: Request, res: Response) => {
  const id = Number.parseInt(req.params['id']);
  let { nombre, costos, preparaciones } = req.body;
  const producto = await Producto.findOne({ 
    where: {
      id: id, 
      deleted: false 
    },
    relations: ['costoProductoTamanio']
  });
  if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
  
  try {
    producto.nombre = nombre;
    uploadPreparationsAndPriceBySize(producto, costos, preparaciones);
    await producto.save();
    res.status(204).json({ message: 'Producto actualizado' });
  } catch (error) {
    console.error(error);
    if (error instanceof Error)
      return res.status(500).json({ message: error.message });
  }
};