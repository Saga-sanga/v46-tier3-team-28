import { isValidUrl } from '@/lib/utils';
import { NextRequest } from 'next/server';
import { parse } from 'node-html-parser';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');

  // Check if url is valid
  if (!url || !isValidUrl(url)) {
    return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
  }

  const metaTags = await getMetaTags(url);
  return new Response(JSON.stringify(metaTags), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

async function getMetaTags(url: string) {
  const html = await getHtml(url);

  if (!html) {
    return {
      title: url,
      description: 'No description',
      image: null,
    };
  }

  const { metaTags, linkTags, titleTag } = getHeadChildNodes(html);

  let object: Record<string, string> = {};

  for (let k in metaTags) {
    let { property, content } = metaTags[k];

    property && (object[property] = content);
  }

  for (let m in linkTags) {
    let { rel, href } = linkTags[m];

    rel && (object[rel] = href);
  }

  const title = object['og:title'] || object['twitter:title'] || titleTag;
  const description = object['description'] || object['og:description'] || object['twitter:description'];
  const image =
    object['og:image'] || object['twitter:image'] || object['image_src'] || object['icon'] || object['shortcut icon'];

  return {
    title: title || url,
    description: description || 'No description',
    image: getRelativeUrl(url, image),
  };
}

function getHeadChildNodes(html: string) {
  const ast = parse(html); // Parse html into AST format using node-html-parser
  const metaTags = ast.querySelectorAll('meta').map(({ attributes }) => {
    const property = attributes.property || attributes.name || attributes.href;
    return {
      property,
      content: attributes.content,
    };
  });
  const titleTag = ast.querySelector('title')?.innerText;
  const linkTags = ast.querySelectorAll('link').map(({ attributes }) => {
    const { rel, href } = attributes;
    return {
      rel,
      href,
    };
  });

  return { metaTags, titleTag, linkTags };
}

async function getHtml(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'sanga-bot/1.0',
      },
    });
    clearTimeout(timeoutId);
    return await response.text();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // Handle fetch request abort (e.g., due to timeout)
      console.error('Fetch request aborted due to timeout.');
    } else {
      // Handle other fetch errors
      console.error('Fetch request failed:', error);
    }
    return null;
  }
}

const getRelativeUrl = (url: string, imageUrl: string) => {
  if (!imageUrl) {
    return null;
  }
  if (isValidUrl(imageUrl)) {
    return imageUrl;
  }
  const { protocol, host } = new URL(url);
  const baseURL = `${protocol}//${host}`;
  return new URL(imageUrl, baseURL).toString();
};
