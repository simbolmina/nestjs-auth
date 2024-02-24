import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule, ProfilesModule],
  providers: [EventsService],
})
export class EventsModule {}
