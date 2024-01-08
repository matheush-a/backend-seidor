const supabase = require('../app/database/supabase');
const DriverController = require('../app/controllers/driver.controller');

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

describe('DriverController', () => {
  describe('validator', () => {
    test('validating with missing id should return an error', async () => {
      const req = { body: { name: 'Toretto' } };
      const res = {};

      const errors = await DriverController.validator(req, res);
      expect(errors).toContain("You must inform a valid driver's id.");
    });

    test('validating with missing name should return an error', async () => {
      const req = { body: { id: 1 } };
      const res = {};

      const errors = await DriverController.validator(req, res);
      expect(errors).toContain("You must inform a driver's name.");
    });
  });

  describe('destroy', () => {
    test('should return 422 status when no id is provided', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await DriverController.destroy(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ error: "You must inform a valid driver's id." });
    });
  });

  describe('index', () => {
    test('should return data when successfully fetching from supabase without filters', async () => {
      const req = { query: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockData = [{ id: 1, name: 'Toretto' }];
      supabase.from().select.mockResolvedValueOnce({ data: mockData });

      await DriverController.index(req, res);

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

      await DriverController.show(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ error: "You must inform a valid driver's id." });
    });
  });

  describe('store', () => {
    test('should return 422 status when no name is provided', async () => {
      const req = { body: {} };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await DriverController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.json).toHaveBeenCalledWith({ error: "You must inform a driver's name." });
    });

    test('should return 201 status when successfully creating a new driver', async () => {
      const req = { body: { name: 'Toretto' } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockData = [{ id: 1, name: 'Toretto' }];
      supabase.from().insert.mockResolvedValueOnce({ error: null });

      await DriverController.store(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: 'Driver created successfully!' });
    });
  });
});
