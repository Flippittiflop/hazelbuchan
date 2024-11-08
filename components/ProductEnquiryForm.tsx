"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';

interface EnquiryFormData {
  name: string;
  email: string;
  message: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  videoUrl: string;
}

interface ProductEnquiryFormProps {
  selectedProducts: Product[];
  onRemoveProduct: (id: number) => void;
  onSubmit: (data: EnquiryFormData) => void;
}

export default function ProductEnquiryForm({ selectedProducts, onRemoveProduct, onSubmit }: ProductEnquiryFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<EnquiryFormData>();

  return (
    (<div className="bg-white shadow-lg rounded-lg p-6 sticky top-20 z-40 mb-8">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Selected Items for Enquiry</h3>
        <div className="flex flex-wrap gap-2">
          {selectedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2"
            >
              <span className="text-sm">{product.title}</span>
              <button
                onClick={() => onRemoveProduct(product.id)}
                className="text-gray-500 hover:text-gray-700"
                aria-label={`Remove ${product.title} from enquiry`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email"
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            id="message"
            {...register("message", { required: "Message is required" })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Enquire for a Quote
        </button>
      </form>
    </div>)
  );
}