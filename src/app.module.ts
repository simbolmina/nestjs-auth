import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ValidationModule } from './validation/validation.module';
import { ProductsModule } from './products/products.module';
// import { currentConfig } from '../db-config';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { CartModule } from './cart/cart.module';
import { AddressesModule } from './addresses/addresses.module';
import { OrdersModule } from './orders/orders.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { VariantsModule } from './variants/variants.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/common.module';
import { ProfilesModule } from './profiles/profiles.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    ValidationModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    WishlistsModule,
    CartModule,
    AddressesModule,
    OrdersModule,
    AttachmentsModule,
    VariantsModule,
    ReviewsModule,
    TerminusModule,
    HttpModule,
    AuthModule,
    NotificationsModule,
    CommonModule,
    ProfilesModule,
    EventsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
