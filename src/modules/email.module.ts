// email.module.ts
import { Module } from '@nestjs/common';
import { EmailService } from 'src/services/email.service';

@Module({
  providers: [EmailService],
  exports: [EmailService], // <-- importantissimo, così altri moduli lo possono usare
})
export class EmailModule {}
