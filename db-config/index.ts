// index.ts

import { DataSource } from 'typeorm';
import { developmentConfig, testConfig, productionConfig } from './data-source';

const env = process.env.NODE_ENV || 'development';

const configMap = {
  development: developmentConfig,
  test: testConfig,
  production: productionConfig,
};

export const currentConfig = configMap[env];

// console.log('Current config:', currentConfig);

const dataSource = new DataSource(currentConfig);

export const initializeDatabase = async () => {
  try {
    await dataSource.initialize();
    console.log(
      `Data Source has been initialized in --${env.toUpperCase()}-- environment!`,
    );
  } catch (err) {
    console.error('Error during Data Source initialization', err);
  }
};

export const closeDatabase = async () => {
  try {
    await dataSource.destroy();
  } catch (err) {
    console.error('Error during Data Source closing', err);
  }
};

export default dataSource;

// import { DataSource } from 'typeorm';
// import { developmentConfig, testConfig, productionConfig } from './data-source';

// const env = process.env.NODE_ENV || 'development';

// const configMap = {
//   development: developmentConfig,
//   test: testConfig,
//   production: productionConfig,
// };

// export const currentConfig = configMap[env];

// // console.log('Current config:', currentConfig);

// const dataSource = new DataSource(currentConfig);

// dataSource
//   .initialize()
//   .then(() => {
//     console.log(
//       `Data Source has been initialized in --${env.toUpperCase()}-- environment!`,
//     );
//   })
//   .catch((err) => {
//     console.error('Error during Data Source initialization', err);
//   });

// export default dataSource;
