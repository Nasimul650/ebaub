'use client';

import React, { useState } from 'react';
import { 
  BlockType, 
  BlockData,
  ContentBlock, 
  HeroBlockData, 
  TextImageBlockData, 
  StatsBlockData, 
  CtaBannerBlockData, 
  RichTextBlockData 
} from '@/types';
import { updatePageBlocks } from '@/app/actions/cms';
import { 
  Plus, 
  Save, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layout, 
  Image, 
  BarChart, 
  Megaphone, 
  FileText,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

import HeroBlockEditor from './blocks/HeroBlockEditor';
import TextImageBlockEditor from './blocks/TextImageBlockEditor';
import StatsBlockEditor from './blocks/StatsBlockEditor';
import CtaBannerBlockEditor from './blocks/CtaBannerBlockEditor';
import RichTextBlockEditor from './blocks/RichTextBlockEditor';

interface Props {
  initialBlocks: ContentBlock[];
  slug: string;
}

const BLOCK_TYPES: { type: BlockType; label: string; icon: React.ElementType }[] = [
  { type: 'hero', label: 'Hero', icon: Layout },
  { type: 'text_image', label: 'Text/Image', icon: Image },
  { type: 'stats', label: 'Stats', icon: BarChart },
  { type: 'cta_banner', label: 'CTA Banner', icon: Megaphone },
  { type: 'rich_text', label: 'Rich Text', icon: FileText },
];

export default function PageBlockBuilder({ initialBlocks, slug }: Props) {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks || []);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getDefaultData = (type: BlockType): BlockData => {
    switch (type) {
      case 'hero':
        return { badge: '', headline: '', subheadline: '' } as HeroBlockData;
      case 'text_image':
        return { title: '', paragraph: '', image_url: '', image_alignment: 'left' } as TextImageBlockData;
      case 'stats':
        return { headline: '', stats: [{ value: '', label: '' }] } as StatsBlockData;
      case 'cta_banner':
        return { headline: '', description: '', button_text: '', button_link: '' } as CtaBannerBlockData;
      case 'rich_text':
        return { title: '', content: '' } as RichTextBlockData;
      default:
        return { badge: '', headline: '', subheadline: '' } as HeroBlockData;
    }
  };

  const handleAddBlock = (type: BlockType) => {
    setBlocks([...blocks, { type, data: getDefaultData(type) }]);
  };

  const handleUpdateBlock = (index: number, data: any) => {
    const newBlocks = [...blocks];
    newBlocks[index].data = data;
    setBlocks(newBlocks);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setBlocks(newBlocks);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
    setBlocks(newBlocks);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      const newBlocks = blocks.filter((_, i) => i !== index);
      setBlocks(newBlocks);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await updatePageBlocks(slug, blocks);
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        setMessage({ type: 'success', text: 'Page blocks saved successfully!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const renderBlockEditor = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case 'hero':
        return <HeroBlockEditor data={block.data as HeroBlockData} onChange={(d) => handleUpdateBlock(index, d)} />;
      case 'text_image':
        return <TextImageBlockEditor data={block.data as TextImageBlockData} onChange={(d) => handleUpdateBlock(index, d)} />;
      case 'stats':
        return <StatsBlockEditor data={block.data as StatsBlockData} onChange={(d) => handleUpdateBlock(index, d)} />;
      case 'cta_banner':
        return <CtaBannerBlockEditor data={block.data as CtaBannerBlockData} onChange={(d) => handleUpdateBlock(index, d)} />;
      case 'rich_text':
        return <RichTextBlockEditor data={block.data as RichTextBlockData} onChange={(d) => handleUpdateBlock(index, d)} />;
      default:
        return <div className="p-4 text-red-500">Unknown block type</div>;
    }
  };

  const getBlockMeta = (type: BlockType) => BLOCK_TYPES.find(b => b.type === type) || BLOCK_TYPES[0];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => handleAddBlock(type)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-campus-50 text-slate-700 hover:text-campus-900 text-sm font-bold border border-slate-200 hover:border-campus-300 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-campus-900 hover:bg-campus-800 text-white font-bold px-5 py-2 rounded-lg transition-colors disabled:opacity-70 whitespace-nowrap"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Page'}
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 text-sm font-bold ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      {/* Blocks List */}
      <div className="space-y-4">
        {blocks.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500">
            <Layout className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700 mb-1">No blocks yet</h3>
            <p className="text-sm">Click the buttons above to add content blocks to your page.</p>
          </div>
        ) : (
          blocks.map((block, index) => {
            const meta = getBlockMeta(block.type);
            const Icon = meta.icon;
            
            return (
              <div key={index} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-campus-50 border-b border-campus-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-campus-900 text-sm">
                    <span className="bg-campus-100 text-campus-700 px-2 py-0.5 rounded text-xs">#{index + 1}</span>
                    <Icon className="w-4 h-4" />
                    {meta.label}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-campus-700 hover:bg-campus-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === blocks.length - 1}
                      className="p-1.5 text-slate-500 hover:text-campus-700 hover:bg-campus-100 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1" />
                    <button
                      onClick={() => handleDelete(index)}
                      className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Block"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {renderBlockEditor(block, index)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
