import { Module } from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService]
})
export class WishlistsModule {}
