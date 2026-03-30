/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOptionsDto } from 'src/dto/create-options.dto';
import { UpdateOptionsDto } from 'src/dto/update-options.dto';
import { Options } from 'src/schemas/options.schema';

@Injectable()
export class OptionsService {
  constructor(
    @InjectModel(Options.name) 
    private optionModel: Model<Options>,
  ) {}

  // Crea una nuova Options
  async create(p: CreateOptionsDto): Promise<Options> {

    // eslint-disable-next-line no-useless-catch
    try {
      const cleanChildren = (p.children || []).map(c =>
        this.sanitizeOption(c)
      );
    
      const pm = new this.optionModel({
        ...p,
        children: cleanChildren,
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
  async findAll(): Promise<Options[]> {
    return this.optionModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una Options per ID
  async findOne(id: string): Promise<Options> {
    const cat = await this.optionModel.findById(id).exec();
    if (!cat) {
      throw new NotFoundException(`Option con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Options per ID
  async update(id: string, p: UpdateOptionsDto): Promise<boolean> {
    const cleanChildren = (p.children || []).map(c =>
      this.sanitizeOption(c)
    );
    const cat = await this.optionModel
      .findByIdAndUpdate(id, 
        {
          ...p,
          children: cleanChildren,
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
    const cat = await this.optionModel.findByIdAndDelete(id).exec();
    if (!cat) {
      //throw new NotFoundException(`Options con ID ${id} non trovato`);
      return false;
    }
    else
      return true;
  }

  async duplicate(id: string): Promise<Options> {

    const original = await this.optionModel.findById(id).lean();

    if (!original) {
      throw new NotFoundException('Opzione non trovata');
    }

    const { _id, createdAt, updatedAt, __v, ...duplicatedData } = original;

    const newOption = new this.optionModel({
      ...duplicatedData,
      name: `${duplicatedData.name} (Copia)`
    });

    return newOption.save();
  }  


  async searchByName(name: string): Promise<Options[]> {
    return this.optionModel.find({
      name: { $regex: name, $options: 'i' }
    }).limit(10);
  }

  private sanitizeOption(option: any): any {
    return {
      _id: option._id,
      name: option.name,
      optionType: option.optionType,
      products: option.products || [],
      children: (option.children || []).map((c: any) =>
        this.sanitizeOption(c)
      )
    };
  }
}
