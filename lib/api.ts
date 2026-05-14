// Set a variable that contains all the fields needed for articles when a fetch for
// content is performed
const ARTICLE_GRAPHQL_FIELDS = `
  sys {
    id
  }
  title
  slug
  summary
  details {
    json
    links {
      assets {
        block {
          sys {
            id
          }
          url
          description
        }
      }
    }
  }
  date
  authorName
  categoryName
  articleImage {
    url
  }
`;

async function fetchGraphQL(query: string, preview = false) {
  const init: RequestInit & { next: { tags: string[] } } = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        preview
          ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
          : process.env.CONTENTFUL_ACCESS_TOKEN
      }`,
    },
    body: JSON.stringify({ query }),
    next: { tags: ['articles'] },
  };
  return fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    init
  ).then((response) => response.json());
}

export type Article = {
  sys: { id: string };
  title: string;
  slug: string;
  summary: string;
  details: { json: unknown; links: unknown };
  date: string;
  authorName: string;
  categoryName: string;
  articleImage: { url: string };
};

type GraphQLResponse = {
  data?: { knowledgeArticleCollection?: { items: Article[] } };
};

function extractArticleEntries(fetchResponse: GraphQLResponse): Article[] {
  return fetchResponse?.data?.knowledgeArticleCollection?.items ?? [];
}

export async function getAllArticles(limit = 3, isDraftMode = false): Promise<Article[]> {
  const articles = await fetchGraphQL(
    `query {
        knowledgeArticleCollection(where:{slug_exists: true}, order: date_DESC, limit: ${limit}, preview: ${
      isDraftMode ? 'true' : 'false'
    }) {
          items {
            ${ARTICLE_GRAPHQL_FIELDS}
          }
        }
      }`,
    isDraftMode
  );
  return extractArticleEntries(articles);
}

export async function getArticle(slug: string, isDraftMode = false): Promise<Article | undefined> {
  const article = await fetchGraphQL(
    `query {
        knowledgeArticleCollection(where:{slug: "${slug}"}, limit: 1, preview: ${
      isDraftMode ? 'true' : 'false'
    }) {
          items {
            ${ARTICLE_GRAPHQL_FIELDS}
          }
        }
      }`,
    isDraftMode
  );
  return extractArticleEntries(article)[0];
}
