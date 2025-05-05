import createBaseService from './baseService';

const baseService = createBaseService('/regulations');

export default {
  ...baseService,
  
  getRegulations(params = {}) {
    return baseService.getList(params);
  },
  
  getRegulationById(id) {
    return baseService.getById(id);
  },
  
  getImportantRegulations(limit = 5) {
    return baseService.getList({ isImportant: true, limit });
  },
  
  createRegulation(regulationData) {
    return baseService.create(regulationData);
  },
  
  updateRegulation(id, regulationData) {
    return baseService.update(id, regulationData);
  },
  
  deleteRegulation(id) {
    return baseService.delete(id);
  }
};