import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
// import { NotificationSettingsService } from 'src/notifications/notification-settings.service';

import { ProfilesService } from 'src/profiles/profiles.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
    // private readonly notificationSettingsService: NotificationSettingsService,
    // private readonly favoritesService: FavoritesService,
    // private readonly jobPostsService: JobPostsService,
    // private readonly availabilityPostsService: AvailabilityPostsService,
  ) {
    this.initListeners();
  }

  initListeners() {
    this.usersService.onUserCreated.on('user.created', async (userId) => {
      await this.profilesService.createProfile(userId);
      //   await this.notificationSettingsService.create(userId);
      //   await this.favoritesService.create(userId);
    });

    // this.usersService.onUserDeleted.on('user.deleted', async (userId) => {
    //   await this.profilesService.deleteProfileByUserId(userId);
    // //   await this.favoritesService.deleteFavoritesByUserId(userId);
    // //   await this.notificationSettingsService.deleteNotificationsByUserId(
    // //     userId,
    // //   );
    // //   await this.jobPostsService.softDeleteJobConversationsPostByUserId(userId);
    // //   await this.availabilityPostsService.softDeleteAvailabilityPostConversationsByUserId(
    // //     userId,
    // //   );
    // });

    // this.usersService.onUserSoftDeleted.on(
    //   'user.softDeleted',
    //   async (userId) => {
    //     await this.jobPostsService.softDeleteJobPosts(userId);
    //     await this.availabilityPostsService.softDeleteAvailabilityPosts(userId);
    //     await this.profilesService.softDeleteProfileByUserId(userId);
    //     await this.favoritesService.softDeleteFavoritesByUserId(userId);
    //     await this.notificationSettingsService.softDeleteNotificationsByUserId(
    //       userId,
    //     );
    //     await this.jobPostsService.softDeleteJobConversationsPostByUserId(
    //       userId,
    //     );
    //     await this.availabilityPostsService.softDeleteAvailabilityPostConversationsByUserId(
    //       userId,
    //     );
    //   },
    // );
  }
}
