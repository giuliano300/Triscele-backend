import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSupplierDto } from 'src/dto/create-supplier.dto';
import { UpdateSupplierDto } from 'src/dto/update-supplier.dto';
import { Supplier, SupplierDocument } from 'src/schemas/suppliers.schema';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private SupplierModel: Model<SupplierDocument>,
  ) {}

  // Crea un nuovo Supplier
  async create(createSupplierDto: CreateSupplierDto): Promise<Supplier> {
    const createdSupplier = new this.SupplierModel(createSupplierDto);
    return createdSupplier.save();
  }

  // Recupera tutti i Supplier
  async findAll(): Promise<Supplier[]> {
    return this.SupplierModel.find().exec();
  }

  // Recupera un Supplier per ID
  async findOne(id: string): Promise<Supplier> {
    const Supplier = await this.SupplierModel.findById(id).exec();
    if (!Supplier) {
      throw new NotFoundException(`Supplier con ID ${id} non trovato`);
    }
    return Supplier;
  }

  // Aggiorna un Supplier per ID
  async update(id: string, updateSupplierDto: UpdateSupplierDto): Promise<Supplier> {
    const updatedSupplier = await this.SupplierModel
      .findByIdAndUpdate(id, updateSupplierDto, { new: true })
      .exec();
    if (!updatedSupplier) {
      throw new NotFoundException(`Supplier con ID ${id} non trovato`);
    }
    return updatedSupplier;
  }

  // Rimuove un Supplier per ID
  async remove(id: string): Promise<Supplier> {
    const deletedSupplier = await this.SupplierModel.findByIdAndDelete(id).exec();
    if (!deletedSupplier) {
      throw new NotFoundException(`Supplier con ID ${id} non trovato`);
    }
    return deletedSupplier;
  }
}
