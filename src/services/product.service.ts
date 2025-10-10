/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from 'src/dto/product.dto';
import { Category } from 'src/schemas/category.schema';
import { Product, ProductDocument } from 'src/schemas/product.schema';
import { Supplier } from 'src/schemas/suppliers.schema';
import { ProductViewModel } from '../viewmodel/productViewModel';
import { ProductMovements, ProductMovementsDocument } from 'src/schemas/product-movement.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
     @InjectModel(ProductMovements.name) private productMovementModel: Model<ProductMovementsDocument>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const product = new this.productModel({
      ...dto,
      createdAt: new Date()
    });
    return product.save();
  }

  async findAll(
    page = 1,
    limit = 20,
    categoryId?: string,
    supplierId?: string,
    name?: string
  ): Promise<{
    data: ProductViewModel[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const filter: any = {};
    if (categoryId) filter.categoryId = categoryId;
    if (supplierId) filter.supplierId = supplierId;
    if (name) filter.name = { $regex: name, $options: 'i' };

    // Calcolo offset
    const skip = (page - 1) * limit;

    // Eseguo due query in parallelo: count e data
    const [total, products] = await Promise.all([
      this.productModel.countDocuments(filter),
      this.productModel
        .find(filter)
        .populate({ path: 'categoryId', select: 'name' })
        .populate({
          path: 'supplierId',
          select: 'name lastName supplierCode businessName'
        })
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
    ]);

    // Mappo i prodotti con dati aggiuntivi
    const data = await Promise.all(
      products.map(async product => {
        const category = product.categoryId as unknown as Category;
        const supplier = product.supplierId as unknown as Supplier;

        const productMovements = await this.productMovementModel
          .find({ productId: String(product._id) })
          .sort({ createdAt: -1, _id: -1 })
          .exec();

        return {
          id: String(product._id),
          name: product.name,
          price: product.price,
          cost: product.cost,
          theshold: product.theshold,
          enabled: product.enabled,
          stock_type: product.stock_type,
          description: product.description,
          files: product.files,
          purchasePackage: product.purchasePackage,
          supplierCode: product.supplierCode,
          categoryId: String(product.categoryId._id),
          supplierId: String(product.supplierId._id),
          category,
          supplier,
          stock: product.stock,
          productMovements,
          subProducts: product.subProducts
        };
      })
    );

    // Restituisco i dati impaginati
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
    

  async findProductsForSelect(): Promise<any[]> {
    const products = await this.productModel
      .find()      
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return await Promise.all(
      products.map(async product => {
        return {
          id: String(product._id),
          name: product.name,
          price: product.price,
        };
      })
    );
  }

  async getProductsByName(name: string): Promise<any[]> {
    const products = await this.productModel
      .find({ name: { $regex: name, $options: 'i' } })
      .populate({ path: 'supplierId', select: 'name lastName supplierCode businessName' , options: { lean: true }})
      .limit(20) 
      .lean()
      .exec();

    return products.map((p) => ({
      id: String(p._id),
      name: p.name,
      price: p.price,
      supplierCode: p.supplierCode,
      supplierName: (p.supplierId as any).businessName!,
      subProducts: p.subProducts
    }));
  }
  
  async findLowStock(): Promise<ProductViewModel[]> {
    const products = await this.productModel
      .find({
        $expr: { $gt: ['$theshold', '$stock'] } // theshold > stock
      })
      .populate({ path: 'categoryId', select: 'name' })
      .populate({ path: 'supplierId', select: 'name lastName supplierCode businessName' })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return await Promise.all(
      products.map(async product => {
        const category = product.categoryId as unknown as Category;
        const supplier = product.supplierId as unknown as Supplier;

        const productMovements = await this.productMovementModel
          .find({ productId: String(product._id) })
          .sort({ createdAt: -1 })
          .exec();

        return {
          id: String(product._id),
          name: product.name,
          price: product.price,
          cost: product.cost,
          theshold: product.theshold,
          enabled: product.enabled,
          stock_type: product.stock_type,
          description: product.description,
          files: product.files,
          purchasePackage: product.purchasePackage,
          supplierCode: product.supplierCode,
          categoryId: String(product.categoryId._id),
          supplierId: String(product.supplierId._id),
          category: category,
          supplier: supplier,
          stock: product.stock,
          productMovements: productMovements,
          subProducts: product.subProducts
        };
      })
    );
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
    const productMovements = await this.productMovementModel
      .find({ productId: String(product._id) })
      .exec();    

    return {
      id: String(product._id),
      name: product.name,
      price: product.price,
      cost: product.cost,
      theshold: product.theshold,
      enabled: product.enabled,
      stock_type: product.stock_type,
      description: product.description,
      files: product.files,
      purchasePackage: product.purchasePackage,
      supplierCode: product.supplierCode,
      categoryId: String(product.categoryId._id),
      supplierId: String(product.supplierId._id),
      category: category,
      supplier: supplier,
      stock:product.stock,
      productMovements: productMovements,
      subProducts: product.subProducts
    }
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const updated = await this.productModel.findByIdAndUpdate(id, {
      ...dto,
      updatedAt: new Date()
    }, { new: true }).exec();
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
