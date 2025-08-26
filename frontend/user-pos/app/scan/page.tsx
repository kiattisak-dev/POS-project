'use client'

import React, { useState } from 'react'
import Layout from '@/components/Layout'
import { useStore } from '@/lib/store'
import { Scan, Plus } from 'lucide-react'

// Mock products for testing
const mockProducts = [
  { id: '001', name: 'กาแฟร้อน', price: 45 },
  { id: '002', name: 'ชาเย็น', price: 35 },
  { id: '003', name: 'น้ำส้มสด', price: 40 },
  { id: '004', name: 'ขนมปัง', price: 25 },
  { id: '005', name: 'บิสกิต', price: 30 }
]

export default function ScanPage() {
  const [scannedCode, setScannedCode] = useState('')
  const addToCart = useStore((state) => state.addToCart)
  const cart = useStore((state) => state.cart)
  const cartTotal = useStore((state) => state.cartTotal())

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0
    }).format(amount).replace('THB', '฿')
  }

  // Handle scan/add product
  const handleScanProduct = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (product) {
      addToCart(product.id, product.name, product.price)
      setScannedCode('')
    }
  }

  return (
    <Layout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">สแกนสินค้า</h1>
          <p className="text-gray-600">เลือกสินค้าเพื่อเพิ่มลงตะกร้า (จำลอง)</p>
        </div>

        {/* Manual Input */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="ใส่รหัสสินค้า..."
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => handleScanProduct(scannedCode)}
              disabled={!scannedCode}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Scan size={20} />
              <span>เพิ่ม</span>
            </button>
          </div>
        </div>

        {/* Mock Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">รหัส: {product.id}</p>
                </div>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(product.price)}
                </p>
              </div>
              <button
                onClick={() => handleScanProduct(product.id)}
                className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>เพิ่มลงตะกร้า</span>
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ตะกร้าสินค้า</h2>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">จำนวน: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="pt-3 border-t-2 border-gray-200">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>ยอดรวม:</span>
                  <span className="text-green-600">{formatCurrency(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  )
}