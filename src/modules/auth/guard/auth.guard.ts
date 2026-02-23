import { CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type{ TokenExtractionType } from "../types/extract-token.types";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly jwt: JwtService){

    }

    private extractToken(req: Request): TokenExtractionType{
        const [type, token] = req.headers.authorization?.split(' ') ?? []; //if undefined token empty array fallback
        return type === "bearer" ? token: undefined
    }

    //method of the parent
    canActivate(context: ExecutionContext): Promise<boolean> {
         const getReq = context.switchToHttp().getRequest();
         const token =  this.
    }
}