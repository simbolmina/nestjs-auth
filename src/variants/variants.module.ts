import { Module } from '@nestjs/common';
import { VariantsService } from './variants.service';
import { VariantsController } from './variants.controller';

@Module({
  controllers: [VariantsController],
  providers: [VariantsService]
})
export class VariantsModule {}
