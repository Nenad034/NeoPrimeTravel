import { Result, ok, fail } from '../../core/error/Result';
import { UserEntity, UserProps } from './UserEntity';
import { IEventBus } from '../../core/bus/EventBus';
import { SecurityProvider, UserContext } from '../../core/auth/SecurityProvider';

/**
 * IdentityService - Koordinira radom korisnika i sigurnosti.
 */
export class IdentityService {
  constructor(private eventBus: IEventBus) {}

  /**
   * Kreira novog korisnika u sistemu uz proveru pravila i permisija.
   */
  async registerUser(executor: UserContext, userData: UserProps): Promise<Result<UserEntity, Error>> {
    // 1. Provera permisija (Samo Admin može da kreira interne korisnike)
    if (userData.isInternal && !SecurityProvider.hasPermission(executor, 'iam.create_internal_user')) {
      return fail(new Error('Nemate dozvolu da kreirate interne korisnike.'));
    }

    // 2. Kreiranje domenskog entiteta (Validacija biznis pravila)
    const userResult = UserEntity.create(userData);
    if (userResult.isFailure()) return userResult;

    const user = userResult.value;

    try {
      // 3. Simulacija čuvanja u bazu (Prisma bi išla ovde)
      console.log(`[IdentityService] Korisnik ${user.email} uspešno registrovan.`);

      // 4. Emitovanje događaja za ostale module (npr. CRM da napravi profile)
      await this.eventBus.publish({
        eventName: 'iam.user.registered',
        occurredAt: new Date(),
        payload: { userId: user.id, email: user.email },
        correlationId: `reg-${Date.now()}`
      });

      return ok(user);
    } catch (err) {
      return fail(err instanceof Error ? err : new Error('Fatalna greška pri registraciji.'));
    }
  }
}
