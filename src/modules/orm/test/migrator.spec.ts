import { MigrationGenerator } from '../migrator';

describe('MigrationGenerator', () => {
  let generator: MigrationGenerator;

  beforeEach(() => {
    generator = new MigrationGenerator({} as any, {} as any, {} as any);
  });

  describe('generateMigrationFile', () => {
    it('filters out foreign keys', () => {
      const diff = {
        up: [
          'create table orders (id int primary key)',
          'create table books (id int primary key)',
        ],
        down: ['drop table orders', 'drop table books'],
      };

      const result = generator.generateMigrationFile('TestMigration', diff);

      expect(result).toContain(
        '// this file was auto-generated using migration generator\n\n',
      );
      expect(result).toContain(
        'create table if not exists orders (id int primary key)',
      );
      expect(result).toContain(
        'create table if not exists books (id int primary key)',
      );
      expect(result).not.toContain('foreign key');
    });
  });

  describe('createStatement', () => {
    const spaces = 4;

    it('should convert SQL to idempotent', () => {
      const sql = 'create table orders(id int primary key)';
      const result = generator.createStatement(sql, spaces);

      expect(result).toBe(
        ' '.repeat(spaces) +
          'this.addSql(`create table if not exists orders(id int primary key)`);\n',
      );
    });

    it('should convert SQL to idempotent', () => {
      const result = generator.createStatement('', spaces);
      expect(result).toBe('\n');
    });
  });
});
