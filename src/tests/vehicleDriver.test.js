const supabase = require('../app/database/supabase');
const VehicleDriverController = require('../app/controllers/vehicleDriver.controller');

jest.mock('../app/database/supabase', () => {
  const mockSelect = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdate = jest.fn();

  return {
    from: jest.fn(() => ({
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
    })),
  };
});

describe('VehicleDriverController', () => {
  describe('validator', () => {
    test('validating post method with missing driver_id should return an error', async () => {
      const req = { body: { vehicle_id: 1, start_date: '2022-01-01', reason: 'Test Reason' } };
      const res = {};

      const errors = await VehicleDriverController.validator(req, res, 'post');
      expect(errors).toContain('You must inform a valid driver_id.');
    });
  });

  describe('index', () => {
    test('should return data when successfully fetching from supabase', async () => {
      const req = {};
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockData = [{ id: 1, driver_id: 1, vehicle_id: 2 }];
      supabase.from().select.mockResolvedValueOnce({ data: mockData });

      await VehicleDriverController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  });

  describe('store', () => {
    test('should return 403 status when the vehicle is already in use by a driver', async () => {
      const req = { body: { driver_id: 1, vehicle_id: 2, start_date: '2022-01-01', reason: 'Test Reason' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockData = [{ driver_id: 1, vehicle_id: 2 }];
      supabase.from().select.mockResolvedValueOnce({ data: mockData });

      await VehicleDriverController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "This vehicle is already on use by a driver!" });
    });
  });
});
