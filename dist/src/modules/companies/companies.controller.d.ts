import { CompaniesService } from './companies.service';
import { UpdateCompanyDto, CompanyResponseDto } from './dto/company.dto';
export declare class CompaniesController {
    private companiesService;
    constructor(companiesService: CompaniesService);
    findOne(companyId: string): Promise<CompanyResponseDto>;
    update(companyId: string, updateDto: UpdateCompanyDto, user: any): Promise<CompanyResponseDto>;
}
