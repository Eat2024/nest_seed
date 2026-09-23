import { assertTestDbName } from './ensure-test-db';

describe('assertTestDbName', () => {
  const original = process.env.DB_MYSQL_DB;

  afterEach(() => {
    if (original === undefined) {
      delete process.env.DB_MYSQL_DB;
    } else {
      process.env.DB_MYSQL_DB = original;
    }
  });

  it.each(['nest_seed_test', 'nest_seed_test_worker'])(
    '允許測試資料庫 %s',
    (database) => {
      process.env.DB_MYSQL_DB = database;

      expect(assertTestDbName()).toBe(database);
    },
  );

  it.each(['', 'nest_seed', 'production'])(
    '拒絕非測試資料庫 %s',
    (database) => {
      process.env.DB_MYSQL_DB = database;

      expect(() => assertTestDbName()).toThrow('DB_MYSQL_DB');
    },
  );
});
