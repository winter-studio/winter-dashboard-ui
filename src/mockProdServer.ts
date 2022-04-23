import { createProdMockServer } from 'vite-plugin-mock/es/createProdMockServer'
import testMock from '../mock/test'

export const mockModules = [...testMock]

export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
