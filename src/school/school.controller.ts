import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/role.guard';
import { create } from 'domain';
import { CreateSchoolDto } from './dtos/CreateSchool.dto';
import { EditSchoolDto } from './dtos/EditSchool.dto';

@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllSchools() {
    return await this.schoolService.getSchools();
  }
  @Post('create')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async createSchool(@Body() createSchoolDto: CreateSchoolDto) {
    return await this.schoolService.createSchool(createSchoolDto);
  }
  @Patch('edit/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async editSchool(
    @Body() editSchoolDto: EditSchoolDto,
    @Param('id') id: number,
  ) {
    return await this.schoolService.editSchool(id, editSchoolDto);
  }
}
