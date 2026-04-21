import { UserRole } from '@my-monorepo/types';
import { PrismaService } from '../../prisma.service';
import { UsersService } from './users.repository';

describe('UsersService (integration)', () => {
  let service: UsersService;
  let prisma: PrismaService;
  const userIdsToClean: string[] = [];

  const requireId = (id: string | undefined, context: string): string => {
    if (!id) {
      throw new Error(`Expected user id in ${context}`);
    }
    return id;
  };

  const buildCreateInput = (suffix: string, role: UserRole = UserRole.USER) => ({
    email: `users-${suffix}@example.com`,
    firstName: `First${suffix}`,
    lastName: `Last${suffix}`,
    password: `Password-${suffix}`,
    confirmPassword: `Password-${suffix}`,
    role,
  });

  beforeAll(async () => {
    prisma = new PrismaService();
    await prisma.onModuleInit();
    service = new UsersService(prisma);
  });

  afterAll(async () => {
    if (userIdsToClean.length > 0) {
      await prisma.profile.deleteMany({ where: { userId: { in: userIdsToClean } } });
      await prisma.user.deleteMany({ where: { id: { in: userIdsToClean } } });
    }
    await prisma.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('adds a user with explicit values', async () => {
      const suffix = `${Date.now()}-create`;
      const input = buildCreateInput(suffix, UserRole.USER);

      const created = await service.create(input);
      const createdId = requireId(created.id, 'create test');
      userIdsToClean.push(createdId);

      expect(created.email).toBe(input.email);
      expect(created.firstName).toBe(input.firstName);
      expect(created.lastName).toBe(input.lastName);
      expect(created.role).toBe(input.role);
      expect(created.password).toBe(input.password);
    });
  });

  describe('find operations', () => {
    it('findByEmail returns the created user', async () => {
      const suffix = `${Date.now()}-find-email`;
      const input = buildCreateInput(suffix, UserRole.ADMIN);
      const created = await service.create(input);
      const createdId = requireId(created.id, 'findByEmail test');
      userIdsToClean.push(createdId);

      const found = await service.findByEmail(input.email);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(createdId);
      expect(found?.email).toBe(input.email);
      expect(found?.role).toBe(UserRole.ADMIN);
    });

    it('findById returns the created user', async () => {
      const suffix = `${Date.now()}-find-id`;
      const input = buildCreateInput(suffix, UserRole.GUEST);
      const created = await service.create(input);
      const createdId = requireId(created.id, 'findById test');
      userIdsToClean.push(createdId);

      const found = await service.findById(createdId);

      expect(found).not.toBeNull();
      expect(found?.email).toBe(input.email);
      expect(found?.firstName).toBe(input.firstName);
      expect(found?.role).toBe(UserRole.GUEST);
    });

    it('findAll contains newly created users', async () => {
      const first = await service.create(buildCreateInput(`${Date.now()}-all-a`));
      const second = await service.create(buildCreateInput(`${Date.now()}-all-b`));
      const firstId = requireId(first.id, 'findAll first user');
      const secondId = requireId(second.id, 'findAll second user');
      userIdsToClean.push(firstId, secondId);

      const all = await service.findAll();
      const ids = all.map((user) => user.id);

      expect(ids).toContain(firstId);
      expect(ids).toContain(secondId);
    });
  });

  describe('edit operations', () => {
    it('persists edits and service reads updated values', async () => {
      const suffix = `${Date.now()}-edit`;
      const created = await service.create(buildCreateInput(suffix, UserRole.USER));
      const createdId = requireId(created.id, 'edit test');
      userIdsToClean.push(createdId);

      const updated = await prisma.user.update({
        where: { id: createdId },
        data: {
          firstName: 'EditedFirst',
          lastName: 'EditedLast',
          role: UserRole.ADMIN,
        },
      });

      const reloaded = await service.findById(createdId);

      expect(updated.firstName).toBe('EditedFirst');
      expect(updated.lastName).toBe('EditedLast');
      expect(updated.role).toBe(UserRole.ADMIN);
      expect(reloaded).not.toBeNull();
      expect(reloaded?.firstName).toBe('EditedFirst');
      expect(reloaded?.lastName).toBe('EditedLast');
      expect(reloaded?.role).toBe(UserRole.ADMIN);
    });
  });
});
