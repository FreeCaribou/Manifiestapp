import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { departments, provinces } from '../shared/data/departments.list';
import { Department } from './department.entity';
import { Observable } from 'rxjs';

@Injectable()
export class DepartmentsService {

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) { }

  findAll(lang: string = 'nl'): Promise<Department[]> {
    return new Promise((resolve) => {
      const data = departments.map(d => {
        return {
          ...d,
          label: lang === 'fr' ? d.labelFr : d.labelNl
        }
      }).sort((a, b) => {
        if (a.label < b.label) {
          return -1;
        } else {
          return 1;
        }
      });
      data.unshift(data.splice(data.findIndex(item => item.code === 'GVHV'), 1)[0]);
      data.push(data.splice(data.findIndex(item => item.code === 'Other'), 1)[0]);
      resolve(data);
    });
  }

  getAllProvince(): Promise<any[]> {
    return new Promise((resolve) => {
      resolve(provinces)
    });
  }

  async stupidTest(label: string, code: string) {
    const d = await this.departmentRepository.save(this.departmentRepository.create({
      label, code
    }));
    return d;
  }

}
