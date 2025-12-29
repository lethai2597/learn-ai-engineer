import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVectorRepository } from './vector-repository.interface';
import { ChromaVectorRepository } from './chroma-vector.repository';

export type VectorDatabaseType = 'chroma';

@Injectable()
export class VectorDatabaseFactory {
  private readonly logger = new Logger(VectorDatabaseFactory.name);
  private readonly repositories = new Map<
    VectorDatabaseType,
    IVectorRepository
  >();

  constructor(
    private readonly configService: ConfigService,
    private readonly chromaRepository: ChromaVectorRepository,
  ) {}

  createRepository(type: VectorDatabaseType = 'chroma'): IVectorRepository {
    if (this.repositories.has(type)) {
      return this.repositories.get(type)!;
    }

    let repository: IVectorRepository;

    switch (type) {
      case 'chroma':
        repository = this.chromaRepository;
        break;
      default:
        throw new Error(`Unsupported vector database type: ${String(type)}`);
    }

    this.repositories.set(type, repository);
    this.logger.log(`Created repository for type: ${String(type)}`);

    return repository;
  }

  getDefaultRepository(): IVectorRepository {
    const defaultType =
      (this.configService.get<string>('vectorDb.type') as
        | VectorDatabaseType
        | undefined) || 'chroma';
    return this.createRepository(defaultType);
  }
}
