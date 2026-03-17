/**
 * Event Bus Interface - Osnova nadogradivosti.
 * Omogućava modulima da komuniciraju bez direktne zavisnosti (Decoupling).
 */

export interface IntegrationEvent {
  eventName: string;
  occurredAt: Date;
  payload: any;
  correlationId: string;
}

export interface IEventBus {
  publish(event: IntegrationEvent): Promise<void>;
  subscribe(eventName: string, handler: (event: IntegrationEvent) => Promise<void>): void;
}

/**
 * In-memory implementacija za lokalno testiranje.
 * U produkciji se menja sa RabbitMQ ili Kafka sistemom.
 */
export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, Array<(event: IntegrationEvent) => Promise<void>>> = new Map();

  async publish(event: IntegrationEvent): Promise<void> {
    const eventHandlers = this.handlers.get(event.eventName) || [];
    console.log(`[EventBus] Publishing: ${event.eventName}`);
    
    // Asinhrono izvršavanje svih handlera
    eventHandlers.forEach(handler => handler(event).catch(err => {
      console.error(`[EventBus] Error in handler for ${event.eventName}:`, err);
    }));
  }

  subscribe(eventName: string, handler: (event: IntegrationEvent) => Promise<void>): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)?.push(handler);
  }
}
