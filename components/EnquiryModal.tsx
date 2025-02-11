"use client"

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import Script from 'next/script';

interface EnquiryFormData {
  name: string;
  email: string;
  message: string;
  'g-recaptcha-response': string;
  products: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  mediaType: "video" | "image";
  src: string;
}

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProducts: Product[];
  onRemoveProduct: (id: number) => void;
  onSubmit: (data: EnquiryFormData) => void;
}

declare global {
  interface Window {
    grecaptcha: any;
    onloadCallback: () => void;
  }
}

export default function EnquiryModal({
  isOpen,
  onClose,
  selectedProducts,
  onRemoveProduct
}: EnquiryModalProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<EnquiryFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!isOpen) return;
    
    window.onloadCallback = () => {
      window.grecaptcha.render('recaptcha', {
        sitekey: '6LcoK3YqAAAAACVceEv38qC3jOufSheeno1V9p_R',
        callback: (response: string) => {
          setValue('g-recaptcha-response', response);
        }
      });
    };

    const el = document.getElementById('g-recaptcha-response');
    if (el) {
      el.setAttribute('required', 'required');
    }
  }, [isOpen, setValue]);

  const onSubmit = async (data: EnquiryFormData) => {
    setIsSubmitting(true);
    try {
      // Add selected products to form data
      const productsInfo = selectedProducts.map(p => `${p.title} (R${p.price})`).join(', ');
      data.products = productsInfo;

      const response = await fetch('https://formspree.io/f/xanyoypr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    (<AnimatePresence>
      {isOpen && (
        <>
          <Script
            src="https://www.google.com/recaptcha/api.js?onload=onloadCallback&render=explicit"
            async
            defer
          />
          <style jsx global>{`
            #g-recaptcha-response {
              display: block !important;
              position: absolute;
              margin: -50px 0 0 0 !important;
              z-index: -999999;
              opacity: 0;
            }
          `}</style>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-screen px-4 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
              />

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className="relative inline-block w-full max-w-2xl p-8 md:p-10 my-8 text-left align-middle bg-white rounded-lg shadow-xl transform transition-all"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold">Your Enquiry</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="Close modal"
                  >
                    <X size={24} />
                  </button>
                </div>

                {status === 'success' ? (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    <strong className="font-bold">Thank you!</strong>
                    <span className="block sm:inline"> Your enquiry has been sent. We'll get back to you soon.</span>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">Selected Items</h3>
                      <div className="flex flex-wrap gap-2">
                        <AnimatePresence>
                          {selectedProducts.map((product) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="bg-gray-100 rounded-full px-3 py-1 flex items-center gap-2"
                            >
                              <span className="text-sm">{product.title} - R{product.price}</span>
                              <button
                                onClick={() => onRemoveProduct(product.id)}
                                className="text-gray-500 hover:text-gray-700"
                                aria-label={`Remove ${product.title} from enquiry`}
                              >
                                <X size={14} />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                      {status === 'error' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                          <strong className="font-bold">Error!</strong>
                          <span className="block sm:inline"> Something went wrong. Please try again later.</span>
                        </div>
                      )}

                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          id="name"
                          {...register("name", { required: "Name is required" })}
                          className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
                          disabled={isSubmitting}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
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
                          className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 h-12 px-4"
                          disabled={isSubmitting}
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                        <textarea
                          id="message"
                          {...register("message", { required: "Message is required" })}
                          rows={6}
                          className="mt-1 block w-full rounded-lg bg-gray-50 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[150px] resize-y p-4"
                          disabled={isSubmitting}
                        />
                        {errors.message && (
                          <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                        )}
                      </div>

                      <div id="recaptcha" className="mb-4"></div>
                      {errors['g-recaptcha-response'] && (
                        <p className="mt-2 text-sm text-red-600">Please complete the reCAPTCHA</p>
                      )}

                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Submit Enquiry'}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>)
  );
}
