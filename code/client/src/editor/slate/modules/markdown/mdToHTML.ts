import { unified } from 'unified';
import markdown from 'remark-parse';
import remark2rehype from 'remark-rehype';
import html from 'rehype-stringify';
import htmlToSlate from './htmlToSlate';

const deserialize = async (value: string) => {
  const data = await unified().use(markdown).use(remark2rehype).use(html).process(value);
  return htmlToSlate(String(data));
};

export default deserialize;
