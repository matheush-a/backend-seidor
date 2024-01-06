const supabase = require('../database/supabase');
const tablename = 'driver';

const DriverController = {
  async validator(req, res) {
    const { id, name } = req.body;
    const errors = [];

    if (!id || isNaN(id)) {
      errors.push("You must inform a valid driver's id.");
    }
    if (!name) {
      errors.push("You must inform a driver's name.");
    }

    return errors;
  },

  queryManager (filters) {
    if (!filters.name) {
      return supabase.from(tablename)
        .select('*');
    }

    return supabase.from(tablename)
      .select('*').ilike('name', `%${filters.name}%`);
  },

  /**
   * Deletes a driver by id
   * @param {*} req 
   * @param {*} res 
   */
  async destroy (req, res) {
    const { id } = req.body;

    if (!id || isNaN(id)) {
      return res.status(422).json({ error: "You must inform a valid driver's id." });
    }

    try {
      const { data } = await supabase.from(tablename)
        .select('*').eq('id', id);

      if (!data || !data.length) {
        return res.status(404).json({ message: 'Driver not found by id, unable to delete.'});
      }

      const { error } = await supabase.from(tablename)
        .delete()
        .eq('id', id);
  
      if (error) {
        throw error;
      }
      
      res.status(200).json({ message: 'Driver deleted successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Indexes every drivers
   * @param {*} req 
   * @param {*} res 
   */
  async index (req, res) {
    const { name } = req.query;

    try {
      const { data, error } = await this.queryManager({ name });
  
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
   * Finds one driver by id
   * @param {*} req 
   * @param {*} res 
   */
  async show (req, res) {
    const { id } = req.query;

    if (!id || isNaN(id)) {
      return res.status(422).json({ error: "You must inform a valid driver's id." });
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
   * Stores a new driver to the database
   * You must inform a name on the request body
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async store (req, res) {
    const { name } = req.body;

    if (!name) {
      return res.status(422).json({ error: "You must inform a driver's name." });
    }

    try {
      const { error } = await supabase.from(tablename)
        .insert([req.body]);
  
      if (error) {
        throw error;
      }
      
      res.status(201).json({ message: 'Driver created successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Updates a driver by id
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async update (req, res) {
    const errors = await this.validator(req, res);

    if (errors.length) {
      return res.status(422).json({ errors });
    }

    const { id, name } = req.body;

    try {
      const { data } = await supabase.from(tablename)
        .select('*').eq('id', id);

      if (!data || !data.length) {
        return res.status(404).json({ message: 'Driver not found by id, unable to update.'});
      }

      const { error } = await supabase.from(tablename)
        .update({ name })
        .eq('id', id);
  
      if (error) {
        throw error;
      }
      
      res.status(200).json({ message: 'Driver updated successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = DriverController;