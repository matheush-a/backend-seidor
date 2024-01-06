const supabase = require('../database/supabase');
const tablename = 'vehicle_driver';

const VehicleDriverController = {
  /**
   * Indexes every vehicle_driver history
   * @param {*} req 
   * @param {*} res 
   */
  async index (req, res) {
    try {
      const { data, error } = await supabase.from(tablename)
        .select(`
          *,
          driver(
            name
          ),
          vehicle(
            *
          )
        `);
  
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
   * Stores a new vehicle_driver register to the database
   * You must inform a driver_id, vehicle_id, start_date and a reason on the request body
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async store (req, res) {
    const { driver_id, vehicle_id, start_date, reason } = req.body;

    if (!driver_id) {
      return res.status(422).json({ error: "You must inform a valid driver_id." });
    }
    if (!vehicle_id) {
      return res.status(422).json({ error: "You must inform a valid vehicle_id." });
    }
    if (!start_date || !Date.parse(start_date)) {
      return res.status(422).json({ error: "You must inform a valid start_date." });
    }
    if (!reason) {
      return res.status(422).json({ error: "You must inform a reason" });
    }

    try {
      let { data } = await supabase.from(tablename)
        .select('*');

      data = data.filter((item) => { 
        return (
          (item.driver_id === parseInt(driver_id) || item.vehicle_id === parseInt(vehicle_id))
            && !item.due_date
        )
      });

      if (data.length) {
        return res.status(403).json({ error: "This vehicle is already on use by a driver!" });
      }

      const { error } = await supabase.from(tablename)
        .insert([req.body]);
  
      if (error) {
        throw error;
      }
      
      res.status(201).json({ message: 'Vehicle used by driver history created successfully!'});
    } catch (error) {
      console.error(error);
      
      if (error.message.includes('vehicle_driver_driver_id_fkey')) {
        return res.status(500).json({ error: `Foreign key constraint violation, driver with id ${driver_id} does not exist.` });
      }

      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  /**
   * Updates a vehicle_driver by id
   * Must receive a due_date on the request body
   * @param {*} req 
   * @param {*} res 
   * @returns 
   */
  async update (req, res) {
    const { id, due_date } = req.body;

    if (!id) {
      return res.status(422).json({ error: "You must inform a vehicle's id." });
    }

    if (!due_date || !Date.parse(due_date)) {
      return res.status(422).json({ error: 'You must inform a valid due_date.' });
    }

    try {
      const { data } = await supabase.from(tablename)
        .select('*').eq('id', id);

      if (!data || !data.length) {
        return res.status(404).json({ message: 'Register not found by id, unable to update.'});
      }

      if (Date.parse(due_date) > Date.now()) {
        return res.status(422).json({ error: 'Caution: due_date must be shorter or equal than current date.' });
      }

      if (Date.parse(data[0].start_date) > Date.parse(due_date)) {
        return res.status(422).json({ 
          error: 'Caution: due_date must be greater or equal than start_date.',
          start_date: new Date(data[0].start_date).toLocaleString(),
          due_date: new Date(due_date).toLocaleString(),
        });
      }

      const { error } = await supabase.from(tablename)
        .update({ due_date })
        .eq('id', id);
  
      if (error) {
        throw error;
      }
      
      res.status(200).json({ message: 'Register updated successfully!'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = VehicleDriverController;