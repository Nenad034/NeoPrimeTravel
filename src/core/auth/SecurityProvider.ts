/**
 * Security Provider - Osnova sigurnosti.
 * Upravlja JWT validacijom, RBAC proverama i audit logovanjem.
 */

export interface UserContext {
  id: string;
  roles: string[];
  permissions: string[];
  agencyId?: string;
}

export class SecurityProvider {
  /**
   * Proverava da li korisnik ima određenu dozvolu.
   * Koristi se kao "Guard" na nivou domena.
   */
  static hasPermission(user: UserContext, requiredPermission: string): boolean {
    // Admin uvek ima pristup svemu
    if (user.roles.includes('ADMIN')) return true;
    
    return user.permissions.includes(requiredPermission);
  }

  /**
   * Maskiranje senzitivnih podataka za logove.
   */
  static maskSensitiveData(data: any): any {
    const masked = { ...data };
    const sensitiveFields = ['password', 'token', 'cvv', 'passportNumber'];
    
    for (const field of sensitiveFields) {
      if (masked[field]) masked[field] = '***MASKED***';
    }
    
    return masked;
  }
}
