import client from "../../apollo-client";
import { gql } from "@apollo/client";

async function createAndPublishBlog(slug) {
  const createdBlog = await client.mutate({
    mutation: gql`
      mutation createBlogPost($slug: String) {
        createBlogPost(data: { slug: $slug }) {
          id
        }
      }
    `,
    variables: {
      slug,
    },
  });
  return await client.mutate({
    mutation: gql`
      mutation publishBlogPost($id: ID) {
        publishBlogPost(to: PUBLISHED, where: { id: $id }) {
          stage
          slug
          id
        }
      }
    `,
    variables: {
      id: createdBlog.data.createBlogPost.id,
    },
  });
}

export default async function addBlogPost(req, res) {
  const publishedBlog = createAndPublishBlog(req.body.slug);
  res.status(200).send({
    data: publishedBlog,
  });
}
