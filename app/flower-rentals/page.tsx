"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductGrid from '@/components/ProductGrid';
import EnquiryModal from '@/components/EnquiryModal';
import EnquiryButton from '@/components/EnquiryButton';
import productsData from '@/data/flower-rentals.json';

// Define the Product type to match the data structure
type Product = {
    id: number;
    title: string;
    price: number;
    mediaType: "video" | "image";
    mediaUrl: string;
};

// Type assertion to ensure the imported data matches our Product type
const products = productsData.items as Product[];

export default function FlowerRentals() {
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showAddedAnimation, setShowAddedAnimation] = useState(false);

    const handleAddToEnquiry = (product: Product) => {
        if (!selectedProducts.find(p => p.id === product.id)) {
            setSelectedProducts([...selectedProducts, product]);
            setShowAddedAnimation(true);
            setTimeout(() => setShowAddedAnimation(false), 1000);
        }
    };

    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const handleSubmitEnquiry = async (formData: { name: string; email: string; message: string }) => {
        const enquiryData = {
            ...formData,
            products: selectedProducts
        };

        console.log('Enquiry submitted:', enquiryData);
        setIsModalOpen(false);
        setSelectedProducts([]);
    };

    return (
        <div className="space-y-8">
            {/* Hero Video Section */}
            <div className="relative w-full h-[70vh] overflow-hidden -mt-8">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover"
                >
                    <source src="/gallery/flower-rentals/night_flowers.mov" type="video/quicktime" />
                    Your browser does not support the video tag.
                </video>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white p-4">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-4 text-center"
                    >
                        Flower Rentals
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-center max-w-2xl"
                    >
                        Transform your space with our premium artificial flowers and decorative pieces
                    </motion.p>
                </div>
            </div>

            <EnquiryButton
                count={selectedProducts.length}
                onClick={() => setIsModalOpen(true)}
            />

            <AnimatePresence>
                {showAddedAnimation && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed top-36 right-4 md:right-8 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg"
                    >
                        Item added to enquiry!
                    </motion.div>
                )}
            </AnimatePresence>

            <EnquiryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedProducts={selectedProducts}
                onRemoveProduct={handleRemoveProduct}
                onSubmit={handleSubmitEnquiry}
            />

            <div className="container mx-auto px-4">
                <ProductGrid
                    products={products}
                    onAddToEnquiry={handleAddToEnquiry}
                    selectedProductIds={selectedProducts.map(p => p.id)}
                />
            </div>
        </div>
    );
}
