import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SectorDto } from 'src/dto/sector.dto';
import { Sector, SectorDocument } from 'src/schemas/sector.schema';

@Injectable()
export class SectorsService {
  constructor(
    @InjectModel(Sector.name) private SectorsModel: Model<SectorDocument>,
  ) {}

  // Crea un nuovo Sectors
  async create(createSectorsDto: SectorDto): Promise<Sector> {
    const createdSectors = new this.SectorsModel({
      ...createSectorsDto,
      createdAt: new Date()
    });
    return createdSectors.save();
  }

  // Recupera tutti i Sectors
  async findAll(): Promise<Sector[]> {
    return this.SectorsModel.find()
          .sort({ createdAt: -1 })
          .exec();
  }

  // Recupera un Sectors per ID
  async findOne(id: string): Promise<Sector> {
    const Sectors = await this.SectorsModel.findById(id).exec();
    if (!Sectors) {
      throw new NotFoundException(`Sectors con ID ${id} non trovato`);
    }
    return Sectors;
  }

  // Aggiorna un Sectors per ID
  async update(id: string, updateSectorsDto: SectorDto): Promise<Sector> {
    const updatedSectors = await this.SectorsModel
      .findByIdAndUpdate(id, {
        ...updateSectorsDto,
        updatedAt: new Date()
      }, { new: true })
      .exec();
    if (!updatedSectors) {
      throw new NotFoundException(`Sectors con ID ${id} non trovato`);
    }
    return updatedSectors;
  }

  // Rimuove un Sectors per ID
  async remove(id: string): Promise<Sector> {
    const deletedSectors = await this.SectorsModel.findByIdAndDelete(id).exec();
    if (!deletedSectors) {
      throw new NotFoundException(`Sectors con ID ${id} non trovato`);
    }
    return deletedSectors;
  }
}
