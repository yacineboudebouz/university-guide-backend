import { HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/typeorm/entities/Photo';
import { Rating } from 'src/typeorm/entities/Rating';
import { School } from 'src/typeorm/entities/School';
import { User } from 'src/typeorm/entities/User';
import { Repository } from 'typeorm';
import { CreateSchoolDto } from './dtos/CreateSchool.dto';
import { EditSchoolDto } from './dtos/EditSchool.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School) private schoolRepository: Repository<School>,
    @InjectRepository(Photo) private photoRepository: Repository<Photo>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Rating) private ratingRepository: Repository<Rating>,
  ) {}

  async createSchool(createSchoolDto: CreateSchoolDto) {
    const school = this.schoolRepository.create(createSchoolDto);
    return await this.schoolRepository.save(school);
  }

  async editSchool(schoolId: number, editSchoolDto: EditSchoolDto) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
    });
    if (!school) {
      throw new HttpException('School not found', 404);
    }
    this.schoolRepository.merge(school, editSchoolDto);
    return await this.schoolRepository.save(school);
  }
  // rate a school
  async rateSchool(schoolId: number, userId: number, rating: number) {
    if (!rating || rating < 1 || rating > 5) {
      throw new HttpException('Rating must be between 1 and 5', 400);
    }
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
    });
    if (!school) {
      throw new HttpException('School not found', 404);
    }
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const userRating = await this.ratingRepository.findOne({
      where: { school, user },
    });
    if (userRating) {
      throw new HttpException('You already rated this school', 400);
    }
    const newRating = this.ratingRepository.create({
      user: user,
      school: school,
      value: rating,
    });
    await this.ratingRepository.save(newRating);
    return { message: 'School rated successfully' };
  }
  async addImageToSchool(schoolId: number, images: string[]) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
    });
    if (!school) {
      throw new HttpException('School not found', 404);
    }
    const photos = images.map((image) => {
      const photo = this.photoRepository.create({ url: image, school });
      return photo;
    });
    return await this.photoRepository.save(photos);
  }
  async getSchools() {
    const schools = await this.schoolRepository.find({
      relations: {
        ratings: {},
      },
    });
    const schoolsWithAvgRating = schools.map((school) => {
      const ratings = school.ratings.map((rating) => rating.value);

      let avgRating = 0;
      if (ratings.length > 0) {
        avgRating =
          ratings.map((rating) => rating).reduce((a, b) => a + b, 0) /
          ratings.length;
      }
      return { ...school, avgRating, rates: ratings.length };
    });
    return schoolsWithAvgRating;
  }
  async getSchoolById(schoolId: number) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
      relations: {
        photos: {},
        ratings: {},
        teachers: {},
        students: {},
      },
    });
    if (!school) {
      throw new HttpException('School not found', 404);
    }
    let avgRating = 0;
    const ratings = school.ratings.map((rating) => rating.value);
    avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return { ...school, avgRating };
  }
  // async searchSchool(school: string) {
  //   // find schools by name
  //   const schools = await this.schoolRepository.find({
  //     where: { name: school },
  //   });
  // }

  async addTeacherToSchool(schoolId: number, uesrId: number) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
      relations: { teachers: true },
    });
    if (!school) {
      throw new HttpException('School not found', 404);
    }
    const teacher = await this.userRepository.findOne({
      where: { id: uesrId },
    });
    if (!teacher) {
      throw new HttpException('Teacher not found', 404);
    }
    // checke if teacher already exists
    school.teachers.forEach((t) => {
      if (t.id === teacher.id) {
        throw new HttpException('Teacher already exists', 400);
      }
    });
    school.teachers.push(teacher);
    await this.schoolRepository.save(school);
    return { message: 'Teacher added successfully' };
  }
  //
  async addStudentToSchool(schoolId: number, uesrId: number) {
    const school = await this.schoolRepository.findOne({
      where: { id: schoolId },
      relations: { students: true },
    });
    if (!school) {
      throw new HttpException('School not found', 404);
    }
    const student = await this.userRepository.findOne({
      where: { id: uesrId },
    });
    if (!student) {
      throw new HttpException('Student not found', 404);
    }

    if (school.students.includes(student)) {
      throw new HttpException('Student already exists', 400);
    }
    school.students.push(student);
    await this.schoolRepository.save(school);
    return { message: 'Student added successfully' };
  }
}
