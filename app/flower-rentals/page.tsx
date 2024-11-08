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
            <h1 className="text-3xl font-bold mb-4">Flower Rentals</h1>
            <p className="text-gray-600 mb-8">
                Browse our collection of premium artificial flowers and decorative pieces available for rent.
            </p>

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

            <ProductGrid
                products={products}
                onAddToEnquiry={handleAddToEnquiry}
                selectedProductIds={selectedProducts.map(p => p.id)}
            />
        </div>
    );
}
