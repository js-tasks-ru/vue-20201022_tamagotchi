const { getSolutionPath } = require('taskbook-test-utils');
const { LINK } = require(getSolutionPath('index'));

describe('project/project-auth', () => {
  test('Файл index.js должен содержать ссылку на репозиторий с проектом', () => {
    expect(LINK).toBeTruthy();
  });
});
