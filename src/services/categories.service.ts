import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoryDto } from 'src/dto/category.dto';
import { Category, CategoryDocument } from 'src/schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoriesModel: Model<CategoryDocument>,
  ) {}

  // Crea una nuova Category
  async create(categoryDto: CategoryDto): Promise<Category> {
    const createdCategory = new this.categoriesModel({
      ...categoryDto,
      createdAt: new Date()
    }
  );

    return createdCategory.save();
  }

  // Recupera tutte le Category
  async findAll(): Promise<Category[]> {
    return this.categoriesModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una Category per ID
  async findOne(id: string): Promise<Category> {
    const cat = await this.categoriesModel.findById(id).exec();
    if (!cat) {
      throw new NotFoundException(`Permissions con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Category per ID
  async update(id: string, categoryDto: CategoryDto): Promise<Category> {
    const cat = await this.categoriesModel
      .findByIdAndUpdate(id, 
        {
          ...categoryDto,
          updatedAt: new Date()
        }, 
        { new: true })
      .exec();
    if (!cat) {
      throw new NotFoundException(`Category con ID ${id} non trovato`);
    }
    return cat;
  }

  // Rimuove una Category per ID
  async remove(id: string): Promise<Category> {
    const cat = await this.categoriesModel.findByIdAndDelete(id).exec();
    if (!cat) {
      throw new NotFoundException(`Category con ID ${id} non trovato`);
    }
    return cat;
  }
}
