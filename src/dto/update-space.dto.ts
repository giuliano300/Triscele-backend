import { PartialType } from '@nestjs/mapped-types';
import { CreateSpaceDto } from './create-space.dto';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
export class UpdateSpaceDto extends PartialType(CreateSpaceDto) {}
