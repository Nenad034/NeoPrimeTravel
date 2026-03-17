import { Result, ok, fail } from '../../core/error/Result';

/**
 * User Entity - Srce Identity modula.
 * Ovde se nalaze biznis pravila koja su nezavisna od baze podataka.
 */
export interface UserProps {
  id?: string;
  email: string;
  username?: string;
  statusCode: 'active' | 'suspended' | 'deleted';
  isInternal: boolean;
  roles: string[];
}

export class UserEntity {
  private constructor(private props: UserProps) {}

  /**
   * Fabrička metoda za kreiranje entiteta uz validaciju.
   */
  static create(props: UserProps): Result<UserEntity, Error> {
    if (!props.email.includes('@')) {
      return fail(new Error('Neispravan format email adrese.'));
    }
    
    return ok(new UserEntity(props));
  }

  /**
   * Biznis pravilo: Da li korisnik sme da pristupi backoffice-u?
   */
  canAccessAdmin(): boolean {
    return this.props.isInternal && this.props.statusCode === 'active';
  }

  /**
   * Biznis pravilo: Suspenzija korisnika.
   */
  suspend(): void {
    this.props.statusCode = 'suspended';
  }

  get id() { return this.props.id; }
  get email() { return this.props.email; }
  get statusCode() { return this.props.statusCode; }
}
