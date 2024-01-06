const supabase = require('../database/supabase');
const tablename = 'vehicle';
const platePattern = /[A-Z]{3}[0-9][0-9A-Z][0-9]{2}/;

const DriverController = {
  queryManager (filters) {
    let query = supabase.from(tablename)
    .select('*');

    if (!filters.brand && !filters.color) {
      return query;
    }

    if (filters.brand) {
      query = query.ilike('brand', `%${filters.brand}%`)
    }
    if (filters.color) {
      query = query.ilike('color', `%${filters.color}%`)
    }

    return query;
  },

  /**
   * Deletes a vehicle by id
   * @param {*} req 
   * @param {*} res 
   */
  async destroy (req, res) {
    const { id } = req.body;

    if (!id) {
      return res.status(422).json({ error: "You must inform a vehicle's id." });
    }

    try {
      const { data } = await supabase.from(tablename)
        .select('*').eq('id', id);

      if (!data || !data.length) {
        return res.status(404).json({ message: 'Vehicle not found by id, unable to delete.'});
      }

      const { error } = await supabase.from(tablename)
        .delete()
        .eq('id', id);
  
      if (error) {
        throw error;
      }
      
      res.status(200).json({ message: 'Vehicle deleted successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Indexes every vehicles
   * @param {*} req 
   * @param {*} res 
   */
  async index (req, res) {
    const { brand, color } = req.query;

    try {
      const { data, error } = await this.queryManager({ brand, color });
  
      if (error) {
        throw error;
      }
      
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Finds one vehicle by id
   * @param {*} req 
   * @param {*} res 
   */
  async show (req, res) {
    const { id } = req.query;

    if (!id) {
      return res.status(422).json({ error: "You must inform a vehicle's id." });
    }

    try {
      const { data, error } = await supabase.from(tablename)
        .select('*')
        .eq('id', id);
  
      if (error) {
        throw error;
      }
      
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Stores a new vehicle to the database
   * You must inform a brand, color and plate on the request body
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async store (req, res) {
    const { brand, color, plate } = req.body;

    if (!brand) {
      return res.status(422).json({ error: "You must inform a vehicle's brand." });
    }
    if (!color) {
      return res.status(422).json({ error: "You must inform a vehicle's color." });
    }
    if (!plate) {
      return res.status(422).json({ error: "You must inform a vehicle's plate." });
    }

    if (!platePattern.test(plate)) {
      return res.status(422).json({ error: 'Plate must respect one of these formats: XXX1111 or XXX1X11.' });
    }

    try {
      if (plate) {
        const { data } = await supabase.from(tablename)
          .select('*').eq('plate', plate);

        if (data && data.length) {
          return res.status(422).json({ error: `The plate ${plate} is already registered as another vehicle.` });
        }
      }

      const { error } = await supabase.from(tablename)
        .insert([req.body]);
  
      if (error) {
        throw error;
      }
      
      res.status(201).json({ message: 'Vehicle created successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Updates a vehicle by id
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async update (req, res) {
    const { id, brand, color, plate } = req.body;

    if (!id) {
      return res.status(422).json({ error: "You must inform a vehicle's id." });
    }

    if (plate && !platePattern.test(plate)) {
      return res.status(422).json({ error: 'Plate must respect one of these formats: XXX1111 or XXX1X11.' });
    }

    try {
      const { data } = await supabase.from(tablename)
        .select('*').eq('id', id);

      if (!data || !data.length) {
        return res.status(404).json({ message: 'Vehicle not found by id, unable to update.'});
      }

      if (plate) {
        const instance = await supabase.from(tablename)
          .select('*').eq('plate', plate);

        // If the plate belongs to another vehicle system must not allow the update
        if (
          instance.data.length
          && instance.data[0].id !== id
        ) {
          return res.status(422).json({ error: `The plate ${plate} is already registered as another vehicle.` });
        }
      }

      const { error } = await supabase.from(tablename)
        .update({ brand, color, plate })
        .eq('id', id);
  
      if (error) {
        throw error;
      }
      
      res.status(200).json({ message: 'Vehicle updated successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = DriverController;