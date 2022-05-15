import { Random } from 'mockjs'
import { resultSuccess } from '../_util'

const token = Random.string('upper', 32, 32)

const adminInfo = {
  userId: '1',
  username: 'admin',
  realName: 'Admin',
  avatar: Random.image(),
  desc: 'manager',
  password: Random.string('upper', 4, 16),
  token
}

export default [
  {
    url: '/api/api-token',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess({ token })
    }
  },
  {
    url: '/api/users/me',
    timeout: 1000,
    method: 'get',
    response: () => {
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      return resultSuccess(adminInfo)
    }
  }
]
