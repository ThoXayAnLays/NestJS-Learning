import { Module } from '@nestjs/common';
import { ProductsModule } from './modules/products/product.modules';

@Module({
  imports: [ProductsModule],
})
export class AppModule {}
