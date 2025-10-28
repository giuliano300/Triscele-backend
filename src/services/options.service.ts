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
    private productsOptionsModel: Model<Options>,
  ) {}

  // Crea una nuova Options
  async create(p: CreateOptionsDto): Promise<Options> {

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
  async findAll(): Promise<Options[]> {
    return this.productsOptionsModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una Options per ID
  async findOne(id: string): Promise<Options> {
    const cat = await this.productsOptionsModel.findById(id).exec();
    if (!cat) {
      throw new NotFoundException(`Option con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Options per ID
  async update(id: string, p: UpdateOptionsDto): Promise<boolean> {
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
