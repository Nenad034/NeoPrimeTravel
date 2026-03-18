import { supabase } from '../../api/v1/supabaseClient';

export interface Property {
  id: string;
  name: string;
  star_rating: number;
  description: string | null;
  amenity_ids: string[];
}

export class PropertyService {
  /**
   * Fetches all properties from the database.
   */
  static async fetchAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*');

      if (error) {
        console.error('Error fetching properties from Supabase:', error);
        throw error;
      }

      // Map Supabase response to Property array
      return (data || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        star_rating: row.star_rating,
        description: row.description,
        amenity_ids: row.amenity_ids || [],
      }));
    } catch (error) {
      console.error('PropertyService.fetchAllProperties failed:', error);
      return [];
    }
  }

  /**
   * Fetches amenity definitions from the database if needed for a legend.
   */
  static async fetchAmenityDefinitions() {
    try {
      const { data, error } = await supabase
        .from('def_amenities')
        .select('*');
        
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching amenity definitions:', error);
      return [];
    }
  }
}
