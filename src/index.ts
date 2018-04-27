import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm'
import { Author } from './entity/Author';
import { Post } from './entity/Post';
import { Category } from './entity/Category';

const cleanUp = async () => {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'test',
  });

  await connection.dropDatabase();
  await connection.close();
};

const runNormal = async () => {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'test',
    entities: [Author, Post],
    synchronize: true,
    logging: true
  });

  const author = new Author();
  author.name = 'Ken';

  await connection.getRepository(Author).save(author);

  const post = new Post();
  post.text = 'post';
  post.author = author;

  await connection.manager.getRepository(Post).save(post);

  let promises = [];

  connection.entityMetadatas.forEach(entityMetadata => {
    entityMetadata.relations.forEach(relation => {
      promises.push(connection.relationIdLoader.loadManyToManyRelationIdsAndGroup(relation, [author]));
    })
  });

  const result = await Promise.all(promises);

  const related = result.map(groups => groups.map(group => group.related));
  console.log('normal relationIdLoader 1 to many result: ', JSON.stringify(result, null, 2));

  await connection.close();
}

const runTree = async () => {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'test',
    entities: [Category],
    synchronize: true,
    logging: true
  });

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
  console.log('abnormal relationIdLoader 1 to many result with tree: ', JSON.stringify(result, null, 2));

  await connection.close();
}

cleanUp().then(runNormal).then(cleanUp).then(runTree);
