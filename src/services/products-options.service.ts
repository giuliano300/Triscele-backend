import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductsOptionsDto } from 'src/dto/create-products-options.dto';
import { UpdateProductsOptionsDto } from 'src/dto/update-products-options.dto';
import { Product } from 'src/schemas/product.schema';
import { ProductsOptions } from 'src/schemas/products-options.schema';

@Injectable()
export class ProductsOptionsService {
  constructor(
    @InjectModel(ProductsOptions.name) 
    private productsOptionsModel: Model<ProductsOptions>,

    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  // Crea una nuova Options
  async create(p: CreateProductsOptionsDto): Promise<ProductsOptions> {

    // eslint-disable-next-line no-useless-catch
    try {
      // 1. Creazione movimento
      const pm = new this.productsOptionsModel({
        ...p,
        createdAt: new Date(),
      });

      await pm.save();

      return pm;
    } 
    catch (error) 
    {
      throw error;
    }
  }

  // Recupera tutte le Options
  async findAll(): Promise<ProductsOptions[]> {
    return this.productsOptionsModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una Options per ID
  async findOne(id: string): Promise<ProductsOptions> {
    const cat = await this.productsOptionsModel.findById(id).exec();
    if (!cat) {
      throw new NotFoundException(`Option con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Options per ID
  async update(id: string, p: UpdateProductsOptionsDto): Promise<boolean> {
    const cat = await this.productsOptionsModel
      .findByIdAndUpdate(id, 
        {
          ...p,
          updatedAt: new Date()
        }, 
        { new: true })
      .exec();
    if (!cat) 
      return false;
    
    return true;
  }

  // Rimuove una Options per ID
  async remove(id: string): Promise<boolean> {
    const cat = await this.productsOptionsModel.findByIdAndDelete(id).exec();
    if (!cat) {
      //throw new NotFoundException(`Options con ID ${id} non trovato`);
      return false;
    }
    else
      return true;
  }
}
