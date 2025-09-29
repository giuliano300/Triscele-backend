import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { Category } from 'src/schemas/category.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { Supplier } from 'src/schemas/suppliers.schema';
import { ProductViewModel } from '../viewmodel/productViewModel';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(dto);
    return product.save();
  }

async findAll(
  categoryId?: string,
  supplierId?: string): Promise<ProductViewModel[]> {
    // Creo il filtro dinamico
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (supplierId) filter.supplierId = supplierId;
    
    const products = await this.productModel
      .find(filter)      
      .populate({ path: 'categoryId', select: 'name' })
      .populate({ path: 'supplierId', select: 'name supplierCode' })
      .lean()
      .exec();

    return products.map(product => {
        const category = product.categoryId as unknown as Category;
        const supplier = product.supplierId as unknown as Supplier;

        return {
          id: String(product._id),
          name: product.name,
          internalCode: product.internalCode,
          price: product.price,
          cost: product.cost,
          theshold: product.theshold,
          enabled: product.enabled,
          stock_type: product.stock_type,
          description: product.description,
          files: product.files,
          amazonCode: product.amazonCode,
          ebayCode: product.ebayCode,
          wcCode: product.wcCode,
          manomanoCode: product.manomanoCode,
          supplierCode: product.supplierCode,
          categoryId: String(product.categoryId._id),
          supplierId: String(product.supplierId._id),
          category: category,
          supplier: supplier
        };
      });
  }

  async findOne(id: string): Promise<ProductViewModel> {
    const product = await this.productModel
      .findById(id)
      .populate({ path: 'categoryId', select: 'name' })
      .populate({ path: 'supplierId', select: 'name supplierCode' })
      .exec();
    if (!product) throw new NotFoundException(`Product ${id} non trovato`);
    
    const category = product.categoryId as unknown as Category;
    const supplier = product.supplierId as unknown as Supplier;
    return {
      id: String(product._id),
      name: product.name,
      internalCode: product.internalCode,
      price: product.price,
      cost: product.cost,
      theshold: product.theshold,
      enabled: product.enabled,
      stock_type: product.stock_type,
      description: product.description,
      files: product.files,
      amazonCode: product.amazonCode,
      ebayCode: product.ebayCode,
      wcCode: product.wcCode,
      manomanoCode: product.manomanoCode,
      supplierCode: product.supplierCode,
      categoryId: String(product.categoryId._id),
      supplierId: String(product.supplierId._id),
      category: category,
      supplier: supplier
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!updated) throw new NotFoundException(`Product ${id} non trovato`);
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) 
      return false;

    return true;
  }
}
