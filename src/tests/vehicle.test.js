const supabase = require('../app/database/supabase');
const VehicleController = require('../app/controllers/vehicle.controller');

jest.mock('../app/database/supabase', () => {
  const mockSelect = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();
  const mockInsert = jest.fn();

  return {
    from: jest.fn(() => ({
      select: mockSelect,
      update: mockUpdate,
      delete: mockDelete,
      insert: mockInsert,
      eq: jest.fn(),
      ilike: jest.fn(),
    })),
  };
});

describe('VehicleController', () => {
  describe('validator', () => {
    test('validating post method with missing brand should return an error', async () => {
      const req = { body: { color: 'Red', plate: 'ABC1234' } };
      const res = {};

      const errors = await VehicleController.validator(req, res, 'post');
      expect(errors).toContain("You must inform a vehicle's brand.");
    });

    test('validating post method with missing color should return an error', async () => {
      const req = { body: { brand: 'Toyota', plate: 'ABC1234' } };
      const res = {};

      const errors = await VehicleController.validator(req, res, 'post');
      expect(errors).toContain("You must inform a vehicle's color.");
    });

    test('validating post method with missing plate should return an error', async () => {
      const req = { body: { brand: 'Toyota', color: 'Red' } };
      const res = {};

      const errors = await VehicleController.validator(req, res, 'post');
      expect(errors).toContain("You must inform a vehicle's plate.");
    });
  });

  describe('destroy', () => {
    test('should return 422 status when no id is provided', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await VehicleController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ error: "You must inform a vehicle's id." });
    });
  });

  describe('index', () => {
    test('should return data when successfully fetching from supabase without filters', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockData = [{ id: 1, brand: 'Toyota', color: 'Blue', plate: 'XYZ1234' }];
      supabase.from().select.mockResolvedValueOnce({ data: mockData });

      await VehicleController.index(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
    });
  });

  describe('show', () => {
    test('should return 422 status when no id is provided', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await VehicleController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ error: "You must inform a vehicle's id." });
    });
  });
});
