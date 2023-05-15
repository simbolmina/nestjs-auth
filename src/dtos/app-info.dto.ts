import { ApiProperty } from '@nestjs/swagger';

class ClientDto {
  @ApiProperty()
  version: string;

  @ApiProperty()
  lastUpdate: string;
}

class MobileDto {
  @ApiProperty({ type: ClientDto })
  ios: ClientDto;

  @ApiProperty({ type: ClientDto })
  android: ClientDto;
}

export class AppInfoDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  version: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: ClientDto })
  web: ClientDto;

  @ApiProperty({ type: MobileDto })
  mobile: MobileDto;
}
