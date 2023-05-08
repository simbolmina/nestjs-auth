// import { Injectable, NestMiddleware } from "@nestjs/common";
// import { Request, Response, NextFunction } from "express";
// import { UsersService } from "../users.service";

// @Injectable()
// export class CurrentUserMiddleware implements NestMiddleware {
//   constructor(private usersService: UsersService) {}
//   async use(req: Request, res: Response, next: NextFunction) {
//     const { id } = req.user || {};
//     if (id) {
//       const user = await this.usersService.findOne(id);
//       req.user = user;
//     }
//     next();
//   }
// }
