import { Injectable } from "@nestjs/common";

@Injectable()
export class IpAccessService {

  isAllowed(clientIp: string, allowedIps: { ip: string }[]) {
    if (!allowedIps || allowedIps.length === 0) {
      return true;
    }
    return allowedIps.some(a => a.ip === clientIp);
  }
}
