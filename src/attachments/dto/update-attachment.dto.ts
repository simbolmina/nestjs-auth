import { PartialType } from '@nestjs/swagger';
import { CreateAttachmentDto } from './create-attachment.dto';

export class UpdateAttachmentDto extends PartialType(CreateAttachmentDto) {}
