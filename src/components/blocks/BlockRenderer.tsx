import React from 'react';
import { ContentBlock } from '@/types';
import HeroBlock from './HeroBlock';
import TextImageBlock from './TextImageBlock';
import StatsBlock from './StatsBlock';
import CtaBannerBlock from './CtaBannerBlock';
import RichTextBlock from './RichTextBlock';

interface Props {
  blocks: ContentBlock[];
}

export default function BlockRenderer({ blocks }: Props) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;

  return (
    <>
      {blocks.map((block, index) => {
        const key = `block-${block.type}-${index}`;
        
        switch (block.type) {
          case 'hero':
            return (
              <section key={key} className="w-full">
                <HeroBlock data={block.data as any} />
              </section>
            );
          case 'text_image':
            return (
              <section key={key} className="w-full">
                <TextImageBlock data={block.data as any} />
              </section>
            );
          case 'stats':
            return (
              <section key={key} className="w-full">
                <StatsBlock data={block.data as any} />
              </section>
            );
          case 'cta_banner':
            return (
              <section key={key} className="w-full">
                <CtaBannerBlock data={block.data as any} />
              </section>
            );
          case 'rich_text':
            return (
              <section key={key} className="w-full">
                <RichTextBlock data={block.data as any} />
              </section>
            );
          default:
            console.warn(`Unknown block type: ${(block as any).type}`);
            return null;
        }
      })}
    </>
  );
}
