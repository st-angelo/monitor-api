import fse from 'fs-extra';
import path from 'path';

const basePath = process.cwd();
const resourcesDistPath = path.join(basePath, 'dist/resources');
const resourcesSrcPath = path.join(basePath, 'resources');

if (!fse.existsSync(resourcesDistPath)) {
  fse.mkdirSync(resourcesDistPath, { recursive: true });
}

fse.copy(resourcesSrcPath, resourcesDistPath, error => {
  if (error) throw error;
});
