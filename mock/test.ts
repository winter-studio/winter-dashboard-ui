import { MockMethod, Recordable } from 'vite-plugin-mock'
export default [
  {
    url: '/api/getRoleById',
    method: 'get',
    response: ({ query }: { query: Recordable }) => {
      console.log('id>>>>>>>>', query.id)
      return {
        code: 0,
        message: 'ok',
        data: {
          roleName: 'admin',
          roleValue: 'admin',
        },
      }
    },
  },
] as MockMethod[]
