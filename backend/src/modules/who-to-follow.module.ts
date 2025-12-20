import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WhoToFollowController } from '../controllers/who-to-follow.controller';
import { WhoToFollowService } from '../services/who-to-follow.service';
import { User } from '../users/entities/user.entity';
import { Scholar } from '../scholars/entities/scholar.entity';
import { UserFollowModule } from './user-follow.module';
import { UserScholarFollowModule } from './user-scholar-follow.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Scholar]),
    UserFollowModule,
    UserScholarFollowModule,
  ],
  controllers: [WhoToFollowController],
  providers: [WhoToFollowService],
  exports: [WhoToFollowService],
})
export class WhoToFollowModule {}
