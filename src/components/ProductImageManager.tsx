/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Upload,
  X,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Copy,
  Trash2,
  Eye
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/supabase';

interface ProductImageManagerProps {
  products: Product[];
  onImageUpdate: () => void;
}

interface ImageUploadState {
  productId: string;
  isUploading: boolean;
  dragActive: boolean;
  previewUrl?: string;
}

export default function ProductImageManager({
  products,
  onImageUpdate
}: ProductImageManagerProps) {
  const [uploadStates, setUploadStates] = useState<Map<string, ImageUploadState>>(new Map());
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getUploadState = (productId: string): ImageUploadState => {
    return uploadStates.get(productId) || {
      productId,
      isUploading: false,
      dragActive: false
    };
  };

  const setUploadState = (productId: string, state: Partial<ImageUploadState>) => {
    setUploadStates(prev => new Map(prev).set(productId, {
      ...getUploadState(productId),
      ...state
    }));
  };

  const handleDrag = (productId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setUploadState(productId, { dragActive: true });
    } else if (e.type === "dragleave") {
      setUploadState(productId, { dragActive: false });
    }
  };

  const handleImageUpload = async (productId: string, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploadState(productId, { isUploading: true, dragActive: false });

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadState(productId, { previewUrl: e.target?.result as string });
      };
      reader.readAsDataURL(file);

      // Upload to cloud
      const url = await api.uploadFile('product-assets', file);
      
      // Update product with new image
      const product = products.find(p => p.id === productId);
      if (product) {
        await api.updateProduct(productId, {
          ...product,
          imageUrl: url
        });

        setSuccessMessage(`✓ ${product.name} image updated!`);
        setTimeout(() => setSuccessMessage(null), 3000);
        
        onImageUpdate();
        setUploadState(productId, { previewUrl: undefined });
      }
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadState(productId, { isUploading: false });
    }
  };

  const handleDrop = (productId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setUploadState(productId, { dragActive: false });
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(productId, file);
    }
  };

  const handleFileChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(productId, file);
    }
  };

  const handleRemoveImage = async (productId: string) => {
    if (confirm('Set product to default placeholder image?')) {
      try {
        const product = products.find(p => p.id === productId);
        if (product) {
          await api.updateProduct(productId, {
            ...product,
            imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600'
          });
          setSuccessMessage(`✓ ${product.name} image reset`);
          setTimeout(() => setSuccessMessage(null), 3000);
          onImageUpdate();
        }
      } catch (err) {
        console.error('Failed to remove image:', err);
      }
    }
  };

  const copyImageUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setSuccessMessage('✓ Image URL copied to clipboard');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold">
          📸 Media Gallery Manager
        </span>
        <p className="text-xs text-gray-400">
          Quickly update product images for your catalog. Upload new images or replace existing ones with a simple drag-and-drop.
        </p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-2 text-green-400 text-xs font-mono">
          <Check className="w-4 h-4" />
          {successMessage}
        </div>
      )}

      {/* Product Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-black/30 rounded-2xl border border-white/5">
            <ImageIcon className="w-8 h-8 text-gray-500 mx-auto mb-2 opacity-50" />
            <p className="text-xs text-gray-500 font-mono">No products yet</p>
          </div>
        ) : (
          products.map((product) => {
            const uploadState = getUploadState(product.id);
            const isSelected = selectedProductId === product.id;

            return (
              <div
                key={product.id}
                onClick={() => setSelectedProductId(isSelected ? null : product.id)}
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#FF4FA3] bg-[#FF4FA3]/5'
                    : 'border-white/10 bg-black/20 hover:border-white/20'
                }`}
              >
                {/* Product Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-mono font-bold text-white truncate">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-gray-500 mt-1">
                      Stock: {product.stock} | ₦{product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPreview(showPreview === product.id ? null : product.id);
                    }}
                    className="ml-2 p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                    title="Preview full image"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Current Image Preview */}
                <div className="mb-4 relative group">
                  <img
                    src={uploadState.previewUrl || product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 rounded-xl object-cover border border-white/10 bg-black"
                  />
                  {uploadState.previewUrl && (
                    <div className="absolute inset-0 bg-green-500/20 rounded-xl border border-green-500/50 flex items-center justify-center">
                      <span className="text-xs font-mono text-green-400 font-bold">PREVIEW</span>
                    </div>
                  )}
                </div>

                {/* Expandable Upload Area */}
                {isSelected && (
                  <div
                    onDragEnter={(e) => handleDrag(product.id, e)}
                    onDragOver={(e) => handleDrag(product.id, e)}
                    onDragLeave={(e) => handleDrag(product.id, e)}
                    onDrop={(e) => handleDrop(product.id, e)}
                    className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all mb-4 ${
                      uploadState.dragActive
                        ? 'border-[#FF4FA3] bg-[#FF4FA3]/10'
                        : 'border-white/10 bg-black/30 hover:border-white/20'
                    }`}
                  >
                    {uploadState.isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="w-5 h-5 text-[#FFD84D] animate-spin" />
                        <span className="text-[10px] font-mono text-gray-400">Uploading...</span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-1 text-gray-400">
                          <Upload className="w-4 h-4" />
                        </div>
                        <label className="text-[10px] font-mono text-[#FF4FA3] hover:underline cursor-pointer font-bold block">
                          Click to upload
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(product.id, e)}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[9px] text-gray-500 block mt-0.5">
                          or drag image here
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                {isSelected && (
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyImageUrl(product.imageUrl);
                      }}
                      className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 text-[10px] font-mono text-gray-300 hover:text-white rounded-lg transition-colors border border-white/10 flex items-center justify-center gap-1.5"
                      title="Copy image URL"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(product.id);
                      }}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-[10px] font-mono text-red-400 hover:text-red-300 rounded-lg transition-colors border border-red-500/20 flex items-center justify-center gap-1.5"
                      title="Reset to default"
                    >
                      <Trash2 className="w-3 h-3" />
                      Reset
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Full Image Preview Modal */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowPreview(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPreview(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={products.find(p => p.id === showPreview)?.imageUrl}
              alt="Full preview"
              className="w-full rounded-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
