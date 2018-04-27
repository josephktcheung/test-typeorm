import 'reflect-metadata';
import { createConnection } from 'typeorm'
import { Category } from './entity/Category';

createConnection().then(async connection => {
  let categoryRepository = connection.getRepository(Category);

  const category1 = new Category();
  category1.name = 'category #1';
  const mainCategory = new Category();

  mainCategory.name = 'main category';
  mainCategory.parent = category1;

  await categoryRepository.save(mainCategory);

  const categories = categoryRepository.find();
  let promises = [];
  connection.entityMetadatas.forEach(entityMetadata => {
    entityMetadata.relations.forEach(relation => {
      promises.push(connection.relationIdLoader.loadManyToManyRelationIdsAndGroup(relation, categories));
    })
  });
  const result = await Promise.all(promises);
  console.log(JSON.stringify(result, null, 2));

  await connection.dropDatabase();
});
