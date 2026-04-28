import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_global/prisma.service';

@Injectable()
export class LeaveQuery {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * * the T here is a param for types or etc.
   * * it determines the shape of of the data
   * @param model
   * @param data
   * @returns prisma object
   */
  async createLeave<T>(model: string, data: any): Promise<T> {
    return this.prisma[model].create({ data: data });
  }

  /**
   * @template T
   * @param {string} model
   * @param {*} where
   * @param {*} data
   * @return {*}  {Promise<T>}
   * @memberof LeaveQuery
   */
  async updateLeave<T>(model: string, where: any, data: any): Promise<T> {
    return this.prisma[model].update({
      where: where,
      data: data,
    });
  }
}
