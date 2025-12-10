import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Illness, IllnessDocument } from 'src/schemas/illness.schema';
import { IllnessDto } from 'src/dto/illness.dto';
import { Operator, OperatorDocument } from 'src/schemas/operators.schema';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class IllnessService {
  constructor(
    private notifications: NotificationsGateway,
    @InjectModel(Illness.name) private IllnessModel: Model<IllnessDocument>,
    @InjectModel(Operator.name)
    private readonly operatorModel: Model<OperatorDocument>, // 🔹 iniezione modello operator
  ) {}

  // Crea una nuova Illness
  async create(IllnessDto: IllnessDto): Promise<Illness> {
    const createdIllness = new this.IllnessModel({
      ...IllnessDto,
      createdAt: new Date()
    }
  );

    const result = await createdIllness.save(); // 🔹 await qui

    // 🔹 recupera l'operatore
    const operator = await this.operatorModel.findById(IllnessDto.operatorId);
    if (!operator) {
      throw new NotFoundException(`Operatore con ID ${IllnessDto.operatorId} non trovato`);
    }
    const operatorName = operator.businessName;

    // 🔹 invia notifica real-time tramite Socket
    this.notifications.sendNewAbsence(operatorName);


    return result;
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
