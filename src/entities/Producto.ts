import {
    Column,
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany
} from 'typeorm';
import { Preparacion } from './Preparacion';
import { CostoProductoTamanio } from './CostoProductoTamanio';

@Entity('producto')
export class Producto extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @OneToMany(() => Preparacion,(preparacion) => preparacion.producto, {cascade: true})
    preparaciones : Preparacion[];

    @Column( {default : false} )
    deleted: boolean;

    @OneToMany(() => CostoProductoTamanio,(costoProductoTamanio) => costoProductoTamanio.producto, {cascade : true})
    costoProductoTamanio : CostoProductoTamanio[];

    @Column({ default : false })
    esBebida: boolean;

    constructor(){
        super();
    }
    
    init(nombre:string, costo:[]): void {
        this.nombre = nombre;
        this.costoProductoTamanio = costo;
    }
}