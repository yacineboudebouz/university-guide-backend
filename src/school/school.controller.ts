import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/role.guard';

import { CreateSchoolDto } from './dtos/CreateSchool.dto';
import { EditSchoolDto } from './dtos/EditSchool.dto';
import { AddPersonDto } from './dtos/AddPerson.dto';

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
  @Post('rate/:id')
  @UseGuards(JwtAuthGuard)
  async rateSchool(
    @Param('id') id: number,
    @Body('rating') rating: number,
    @Req() req: any,
  ) {
    return await this.schoolService.rateSchool(id, req.user.id, rating);
  }
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getSchool(@Param('id') id: number) {
    return await this.schoolService.getSchoolById(id);
  }
  @Post('teacher/add')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe())
  async addTeacher(@Body() addPerson: AddPersonDto) {
    return await this.schoolService.addTeacherToSchool(
      addPerson.schoolId,
      addPerson.userId,
    );
  }
  @Post('student/add')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @UsePipes(new ValidationPipe())
  async addStudent(@Body() addPerson: AddPersonDto) {
    return await this.schoolService.addStudentToSchool(
      addPerson.schoolId,
      addPerson.userId,
    );
  }
}
