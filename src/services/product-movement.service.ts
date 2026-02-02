import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductMovementsDto } from 'src/dto/product-movement.dto';
import { ProductMovements } from 'src/schemas/product-movement.schema';
import { Product } from 'src/schemas/product.schema';

@Injectable()
export class ProductMovementService {
  constructor(
    @InjectModel(ProductMovements.name) 
    private productMovementModel: Model<ProductMovements>,

    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  // Crea una nuova Movement
  async create(p: ProductMovementsDto): Promise<ProductMovements> {

    // eslint-disable-next-line no-useless-catch
    try {
      // 1. Creazione movimento
      const pm = new this.productMovementModel({
        ...p,
        createdAt: new Date(),
      });

      await pm.save();

      // 2. Aggiorno lo stock del prodotto
      const product = await this.productModel.findById(p.productId);
      if (!product) throw new NotFoundException(`Prodotto ${p.productId} non trovato`);

      if (p.movementType === 1) {
        product.stock += p.stock; // entrata
      } 
      else if (p.movementType === 2) 
      {
        product.stock -= p.stock; // uscita
        if (product.stock < 0) {
          throw new BadRequestException('Stock insufficiente per questa uscita');
        }
      }

      product.updatedAt = new Date();
      await product.save();

      return pm;
    } 
    catch (error) 
    {
      throw error;
    }
  }

  // Recupera tutte le Movement
  async findAll(): Promise<ProductMovements[]> {
    return this.productMovementModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una Movement per ID
  async findOne(id: string): Promise<ProductMovements> {
    const cat = await this.productMovementModel.findById(id).exec();
    if (!cat) {
      throw new NotFoundException(`Movement con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Movement per ID
  async update(id: string, p: ProductMovementsDto): Promise<ProductMovements> {
    const cat = await this.productMovementModel
      .findByIdAndUpdate(id, 
        {
          p
        }, 
        { new: true })
      .exec();
    if (!cat) {
      throw new NotFoundException(`Movement con ID ${id} non trovato`);
    }
    return cat;
  }

  // Rimuove una Movement per ID
  async remove(id: string): Promise<boolean> {
    const cat = await this.productMovementModel.findByIdAndDelete(id).exec();
    if (!cat) {
      //throw new NotFoundException(`Movement con ID ${id} non trovato`);
      return false;
    }
    return true;
  }
}
