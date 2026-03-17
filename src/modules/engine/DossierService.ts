import { PrismaClient } from '@prisma/client';
import { FinalPackageResult } from './NeoTravelMasterEngine';

const prisma = new PrismaClient();

export interface CreateDossierRequest {
  packageResult: FinalPackageResult;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  userId?: string;     // Agent ID
  agencyId?: string;   // B2B Agency
}

/**
 * DossierService
 * 
 * Centralno mesto za upravljanje Dosijeom Rezervacije.
 * Implementira logiku iz "DOMAIN 6 — BOOKING CORE" vaše dokumentacije.
 * Pretvara ponudu u trajni transakcioni zapis.
 */
export class DossierService {

  /**
   * Kreira NOVI DOSIJE na osnovu rezultata pretrage/ponude.
   * Ovo je prelazak iz "Search" u "Booking" fazu.
   */
  public static async createFromPackage(req: CreateDossierRequest) {
    console.log(`[DossierService] Kreiram dosije za kupca: ${req.customerName}...`);

    const { packageResult } = req;
    const breakdown = packageResult.breakdown;

    // 1. Generisanje strukturiranog koda (REF - 10000-2026)
    const year = new Date().getFullYear();
    const sequence = Math.floor(10000 + Math.random() * 5000); // Simulacija sekvence
    const cisCode = `REF - ${sequence}-${year}`;

    // 2. Kreiranje Booking rekorda sa svim stavkama i finansijama (Snapshot)
    const booking = await prisma.booking.create({
      data: {
        cisCode: cisCode,
        status: 'DRAFT',
        customerType: req.agencyId ? 'AGENCY' : 'INDIVIDUAL',
        bookerName: req.customerName,
        bookerEmail: req.customerEmail,
        bookerPhone: req.customerPhone,
        
        // Finansijski Snapshot (Slojevi iz Deo 6)
        totalPrice: breakdown.finalTotal,
        totalNetPrice: breakdown.totalNet,
        totalTaxAmount: breakdown.items.reduce((sum, i) => sum + (i.taxes || 0), 0),
        totalMarkupAmount: breakdown.totalMargin,
        totalDiscountAmount: breakdown.displaySavings,
        currency: breakdown.currency,
        
        // Stavke Dosijea (Booking Items - Sekcija 6.4)
        items: {
          create: breakdown.items.map(item => {
            // Logika za Deadlines (Inspirisano OlympicHub-AI-Lab / Deo 7 Sekcija 16)
            const cancelDays = item.type === 'HOTEL' ? 14 : 7; // Mock pravilo
            const cancelDeadline = new Date();
            cancelDeadline.setDate(cancelDeadline.getDate() + 5); // Mock: za 5 dana ističe besplatan cancel

            return {
              type: item.type,
              description: item.description,
              unitPrice: item.sellPrice,
              quantity: 1,
              totalPrice: item.sellPrice,
              netPrice: item.netPrice,
              taxAmount: item.taxes || 0,
              markupAmount: item.markup,
              discountAmount: item.discount,
              currency: item.currency,
              cancelDeadline: cancelDeadline,
              supplierDeadline: cancelDeadline, // Često su isti ili bliski
              externalStatus: 'PENDING_CONFIRMATION'
            };
          })
        },

        // 3. Početna aktivnost u Timeline-u
        activities: {
          create: {
            type: 'CREATED',
            description: `Dosije kreiran iz AI Search ponude (Kanal: ${req.packageResult.breakdown.channel})`,
            userId: req.userId || 'SYSTEM_AI'
          }
        }
      },
      include: {
        items: true,
        activities: true
      }
    });

    console.log(`[DossierService] Uspešno kreiran Dosije: ${booking.cisCode} (ID: ${booking.id})`);
    return booking;
  }

  /**
   * Loguje aktivnost u proaktivni timeline (Inspirisano OlympicHub)
   */
  public static async logActivity(bookingId: string, type: string, description: string, userId: string = 'SYSTEM_AI') {
    return prisma.dossierActivity.create({
      data: { bookingId, type, description, userId }
    });
  }

  /**
   * Identifikuje kritične dosijee (Priority Score logika iz GitHub-a)
   */
  public static async getPriorityAlerts() {
    // Nalazimo sve stavke čiji cancelDeadline ističe u narednih 48 sati
    const threshold = new Date();
    threshold.setHours(threshold.getHours() + 48);

    const criticalItems = await prisma.bookingItem.findMany({
      where: {
        cancelDeadline: {
          lte: threshold,
          gt: new Date()
        }
      },
      include: {
        booking: true
      }
    });

    return criticalItems.map((item: any) => ({
      cisCode: item.booking.cisCode,
      msg: `UPOZORENJE: Stavka "${item.description}" ističe za manje od 48h!`,
      deadline: item.cancelDeadline
    }));
  }

  /**
   * Dohvata PUN DOSIJE sa svim povezanim podacima.
   */
  public static async getFullDossier(bookingId: string) {
    return prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        items: true,
        activities: true,
        passengers: true,
        payments: true,
        roomingSets: {
          include: {
            rooms: {
              include: {
                passengers: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Status Workflow Logika (Sekcija 6.3)
   */
  public static async updateStatus(bookingId: string, newStatus: string) {
    console.log(`[DossierService] Promena statusa dosijea ${bookingId} u ${newStatus}`);
    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: newStatus }
    });
  }
}
