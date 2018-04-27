import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm'
import { Category } from './entity/Category';

const cleanUp = async () => {
  const connection = await createConnection();
  await connection.dropDatabase();
  await connection.close();
};

const run = async () => {
  const connection = await createConnection();

  const categoryRepository = connection.getRepository(Category);

  const categoryParent = new Category();
  categoryParent.name = 'category parent';

  await categoryRepository.save(categoryParent);
  const categoryChild = new Category();

  categoryChild.name = 'category children';
  categoryChild.parent = categoryParent;

  await categoryRepository.save(categoryChild);

  let promises = [];

  connection.entityMetadatas.forEach(entityMetadata => {
    entityMetadata.relations.forEach(relation => {
      promises.push(connection.relationIdLoader.loadManyToManyRelationIdsAndGroup(relation, [categoryParent]));
    })
  });

  const result = await Promise.all(promises);

  const related = result.map(groups => groups.map(group => group.related));
  console.log('relationIdLoader result: ', JSON.stringify(result, null, 2), 'related: ', related);
}

cleanUp().then(run);