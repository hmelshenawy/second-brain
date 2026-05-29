import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super();
    return this.$extends(withAccelerate()) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }
}