import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateAllowedIpDto } from "src/dto/allowed-ip.dto";
import { AllowedIp } from "src/schemas/allowed-ip.schema";

@Injectable()
export class AllowedIpService {

  constructor(
    @InjectModel(AllowedIp.name)
    private readonly model: Model<AllowedIp>,
  ) {}

  create(dto: CreateAllowedIpDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().lean();
  }

  remove(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
