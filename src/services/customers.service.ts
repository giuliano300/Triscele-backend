/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from '../schemas/customers.schema';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) {}

  // Crea un nuovo customer
  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const createdCustomer = new this.customerModel(
      {
        ...createCustomerDto,
        createdAt: new Date()
      }
    );
    return createdCustomer.save();
  }

  // Recupera tutti i customer
  async findAll(
    name?: string,
    province?: string,

  ): Promise<Customer[]> {

    const filter: any = {};
    
if (name) {
    const regex = new RegExp(name, 'i'); // 'i' = case insensitive
    filter.$or = [
      { name: regex },
      { lastName: regex },
      { businessName: regex },
    ];
  }    
  if (province) filter.province = province;

    return this.customerModel.find(filter)      
          .sort({ createdAt: -1 })
          .exec();
  }

  // Recupera un customer per ID
  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) {
      throw new NotFoundException(`Customer con ID ${id} non trovato`);
    }
    return customer;
  }

  // Aggiorna un customer per ID
  async update(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer> {
    const updatedCustomer = await this.customerModel
      .findByIdAndUpdate(id, {
        ...updateCustomerDto,
        updatedAt: new Date()
      }, { new: true })
      .exec();
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer con ID ${id} non trovato`);
    }
    return updatedCustomer;
  }

  // Rimuove un customer per ID
  async remove(id: string): Promise<Customer> {
    const deletedCustomer = await this.customerModel.findByIdAndDelete(id).exec();
    if (!deletedCustomer) {
      throw new NotFoundException(`Customer con ID ${id} non trovato`);
    }
    return deletedCustomer;
  }
}
