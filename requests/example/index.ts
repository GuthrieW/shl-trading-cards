import request from '../request'

const example = () =>
  request({
    url: '/api/v1/example',
    method: 'GET',
  })

export default example
