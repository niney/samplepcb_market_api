import { Test, TestingModule } from '@nestjs/testing';
import { FreelancersResolver } from './freelancers.resolver';

describe('FreelancersResolver', () => {
  let resolver: FreelancersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FreelancersResolver],
    }).compile();

    resolver = module.get<FreelancersResolver>(FreelancersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
