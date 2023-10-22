import {
  DataSource,
  DataSourceOptions,
  EntityTarget,
  ObjectLiteral,
} from 'typeorm';

export class DatabaseService {
  private readonly dataSource: DataSource;
  constructor(options: DataSourceOptions) {
    this.dataSource = new DataSource(options);
  }

  getDataSource() {
    return this.dataSource;
  }

  async connect() {
    await this.dataSource.initialize();
  }

  getRepository(target: EntityTarget<ObjectLiteral>) {
    return this.dataSource.manager.getRepository(target);
  }
}
