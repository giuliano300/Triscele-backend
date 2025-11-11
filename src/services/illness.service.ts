import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Illness, IllnessDocument } from 'src/schemas/illness.schema';
import { IllnessDto } from 'src/dto/illness.dto';

@Injectable()
export class IllnessService {
  constructor(
    @InjectModel(Illness.name) private IllnessModel: Model<IllnessDocument>,
  ) {}

  // Crea una nuova Illness
  async create(IllnessDto: IllnessDto): Promise<Illness> {
    const createdIllness = new this.IllnessModel({
      ...IllnessDto,
      createdAt: new Date()
    }
  );

    return createdIllness.save();
  }

  // Recupera tutte le Illness
  async findAll(operatorId?: string): Promise<Illness[]> {
    const filter = operatorId ? { operatorId } : {};
    return this.IllnessModel.find(filter)
      .populate('operatorId')
      .sort({ createdAt: -1 })
      .exec();
  }

  // Recupera una Illness per ID
  async findOne(id: string): Promise<Illness> {
    const cat = await this.IllnessModel.findById(id).populate('operatorId').exec();
    if (!cat) {
      throw new NotFoundException(`Permissions con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Illness per ID
  async update(id: string, IllnessDto: IllnessDto): Promise<Illness> {
    const cat = await this.IllnessModel
      .findByIdAndUpdate(id, 
        {
          ...IllnessDto,
          updatedAt: new Date()
        }, 
        { new: true })
      .exec();
    if (!cat) {
      throw new NotFoundException(`Illness con ID ${id} non trovato`);
    }
    return cat;
  }

  // Rimuove una Illness per ID
  async remove(id: string): Promise<boolean> {
    const cat = await this.IllnessModel.findByIdAndDelete(id).exec();
    if (!cat)
      return false;
    
    return true;
  }
}
