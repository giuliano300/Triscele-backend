import { Body, Controller, Post, Delete, Get, Param } from "@nestjs/common";
import { CreateAllowedIpDto } from "src/dto/allowed-ip.dto";
import { AllowedIpService } from "src/services/allowed-ip.service";

@Controller('allowed-ips')
export class AllowedIpController {

  constructor(
    private readonly service: AllowedIpService,
  ) {}

  @Post()
  create(@Body() dto: CreateAllowedIpDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
