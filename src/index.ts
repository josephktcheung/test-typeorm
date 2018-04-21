import 'reflect-metadata';
import { createConnection } from 'typeorm'
import { Post } from "./entity/Post";

createConnection().then(async connection => {
  const post = new Post();
  post.text = 'hello world';

  const postRepository = connection.getRepository(Post);
  await postRepository.save(post);

  const posts = await connection.createQueryBuilder()
    .from('post', 'Post')
    .addSelect('Post.id', 'id_1')
    .addSelect('Post.id', 'id_2')
    .getRawMany();

  console.log('posts?', posts);
});
