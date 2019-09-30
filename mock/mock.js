const Mock = require('mockjs');

Mock.mock('/user/userInfo', 'get', function() {
  return {
    data: ['a', 'b']
  };
});

export default Mock;
