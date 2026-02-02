import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AgentDto } from 'src/dto/agent.dto';
import { Agent, AgentDocument } from 'src/schemas/agent.schema';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agent.name) private AgentsModel: Model<AgentDocument>,
  ) {}

  // Crea una nuova Agent
  async create(AgentDto: AgentDto): Promise<Agent> {
    const createdAgent = new this.AgentsModel({
      ...AgentDto,
      createdAt: new Date()
    }
  );

    return createdAgent.save();
  }

  // Recupera tutte le Agent
  async findAll(): Promise<Agent[]> {
    return this.AgentsModel.find().sort({ createdAt: -1 }).exec();
  }

  // Recupera una Agent per ID
  async findOne(id: string): Promise<Agent> {
    const cat = await this.AgentsModel.findById(id).exec();
    if (!cat) {
      throw new NotFoundException(`Permissions con ID ${id} non trovato`);
    }
    return cat;
  }

  // Aggiorna una Agent per ID
  async update(id: string, AgentDto: AgentDto): Promise<Agent> {
    const cat = await this.AgentsModel
      .findByIdAndUpdate(id, 
        {
          ...AgentDto,
          updatedAt: new Date()
        }, 
        { new: true })
      .exec();
    if (!cat) {
      throw new NotFoundException(`Agent con ID ${id} non trovato`);
    }
    return cat;
  }

  // Rimuove una Agent per ID
  async remove(id: string): Promise<boolean> {
    const cat = await this.AgentsModel.findByIdAndDelete(id).exec();
    if (!cat)
      return false;
    
    return true;
  }
}
