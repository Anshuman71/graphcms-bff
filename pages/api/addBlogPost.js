import client from "../../apollo-client";
import { gql } from "@apollo/client";

export default async function addBlogPost(req, res) {
  const createdBlog = await client.mutate({
    mutation: gql`
      mutation createBlogPost($slug: String) {
        createBlogPost(data: { slug: $slug }) {
          id
        }
      }
    `,
    variables: {
      slug: req.body.slug,
    },
  });
  console.log({ createdBlog: createdBlog.data.createBlogPost });
  const publishedBlog = await client.mutate({
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
  res.status(200).send({
    data: publishedBlog,
  });
}
