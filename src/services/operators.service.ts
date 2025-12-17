/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOperatorDto } from 'src/dto/create-operator.dto';
import { UpdateOperatorDto } from 'src/dto/update-operator.dto';
import { Operator, OperatorDocument } from 'src/schemas/operators.schema';

@Injectable()
export class OperatorService {
  constructor(
    @InjectModel(Operator.name) private OperatorModel: Model<OperatorDocument>,
  ) {}

  // Crea un nuovo Operator
  async create(createOperatorDto: CreateOperatorDto): Promise<Operator> {
    const createdOperator = new this.OperatorModel({
      ...createOperatorDto,
      createdAt: new Date(),
      businessName: createOperatorDto.name + " " + createOperatorDto.lastName
    });
    return createdOperator.save();
  }

  // Recupera tutti i Operator
  async findAll(
    @Query('sectorId') sectorId?: string,
    
  ): Promise<Operator[]> {

    const filter: any = {};

    if (sectorId) filter.sectorId = sectorId;

    return this.OperatorModel.find(filter)
         .populate({ path: 'sectorId', select: 'name' })
         .sort({ createdAt: -1 })
          .exec();
  }

  async findByEmailPwd(email: string, pwd: string): Promise<any | null> {
    const operator = await this.OperatorModel.findOne({ email, pwd }).exec();
    if (!operator) return null;

    return {
      id: operator._id,
      businessName: operator.businessName,
      name: operator.name,
      email: operator.email,
      permissions: operator.permissions,
      sectorId: operator.sectorId
    };  
  }

  // Recupera un Operator per ID
  async find(id: string): Promise<OperatorDocument> {
    const Operator = await this.OperatorModel.findById(id).exec();
    if (!Operator) {
      throw new NotFoundException(`Operator con ID ${id} non trovato`);
    }
    return Operator;
  }

  // Recupera un Operator per ID
  async findOne(id: string): Promise<Operator> {
    const Operator = await this.OperatorModel.findById(id).exec();
    if (!Operator) {
      throw new NotFoundException(`Operator con ID ${id} non trovato`);
    }
    return Operator;
  }

  // Aggiorna un Operator per ID
  async update(id: string, updateOperatorDto: UpdateOperatorDto): Promise<Operator> {
    const updatedOperator = await this.OperatorModel
      .findByIdAndUpdate(id, {
        ...updateOperatorDto,
        updatedAt: new Date(),
        businessName: updateOperatorDto.name + " " + updateOperatorDto.lastName
      }, { new: true })
      .exec();
    if (!updatedOperator) {
      throw new NotFoundException(`Operator con ID ${id} non trovato`);
    }
    return updatedOperator;
  }

  // Rimuove un Operator per ID
  async remove(id: string): Promise<Operator> {
    const deletedOperator = await this.OperatorModel.findByIdAndDelete(id).exec();
    if (!deletedOperator) {
      throw new NotFoundException(`Operator con ID ${id} non trovato`);
    }
    return deletedOperator;
  }

  async deductHolidays(operatorId: string, days: number) {
    await this.OperatorModel.findByIdAndUpdate(
      operatorId,
      { $inc: { remainingNumberOfHolidays: -days } },
      { new: true }
    );
  }

  async deductPermissions(operatorId: string, hours: number) {
    await this.OperatorModel.findByIdAndUpdate(
      operatorId,
      { $inc: { remainingNumberOfPermissions: -hours } },
      { new: true }
    );
  }
}
