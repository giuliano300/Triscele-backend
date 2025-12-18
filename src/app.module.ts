import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './controllers/auth/auth.module';
import { UsersModule } from './controllers/users/users.module';
import { AppService } from './app.service';
import { CustomersModule } from './controllers/Customers/customers.module';
import { SupplierModule } from './controllers/Suppliers/suppliers.module';
import { OperatorsModule } from './controllers/Operator/operators.module';
import { PermissionsModule } from './controllers/Permissions/permissions.module';
import { CategoriesModule } from './controllers/Categories/categories.module';
import { ProductModule } from './controllers/Products/product.module';
import { OrderModule } from './controllers/Orders/order.module';
import { ProductMovementModule } from './controllers/ProductMovements/productMovement.module';
import { StatsModule } from './controllers/Stats/stats.module';
import { SectorModule } from './controllers/Sectors/sectors.module';
import { AgentModule } from './controllers/Agents/agents.module';
import { OrderStateModule } from './controllers/OrderState/order-state.module';
import { EmailModule } from './modules/email.module';
import { OptionsModule } from './controllers/Options/Options.module';
import { IllnessModule } from './controllers/Illness/illness.module';
import { PermissionHolidayModule } from './controllers/PermissionHolidays/permission-holiday.module';
import { AttendanceModule } from './controllers/Attendances/attendance.module';
import { NotificationsModule } from './controllers/Notifications/Notifications.module';
import { AllowedIpModule } from './controllers/Allowed-ip/allowed-ip.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/triscele'),
    CustomersModule,
    AuthModule,
    UsersModule,
    SupplierModule,
    OperatorsModule,
    PermissionsModule,
    CategoriesModule,
    ProductModule,
    OrderModule,
    ProductMovementModule,
    StatsModule,
    SectorModule,
    AgentModule,
    OrderStateModule,
    EmailModule,
    OptionsModule,
    IllnessModule,
    PermissionHolidayModule,
    AttendanceModule,
    NotificationsModule,
    AllowedIpModule
  ],
  controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
