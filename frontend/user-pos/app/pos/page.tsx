'use client'

import React, { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Modal from '@/components/Modal'
import QRCodeBox from '@/components/QRCodeBox'
import { useStore } from '@/lib/store'
import { Store, CreditCard } from 'lucide-react'

export default function POSPage() {
  // Modal state
  const [isPayOpen, setIsPayOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Subscribe to store updates
  const cartTotal = useStore((state) => state.cartTotal())
  const createOrderFromCart = useStore((state) => state.createOrderFromCart)
  const clearCart = useStore((state) => state.clearCart)

  // Format currency in Thai Baht
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount).replace('THB', '฿')
  }

  // Generate QR payload
  const generateQRPayload = () => {
    return JSON.stringify({
      type: 'payment',
      total: cartTotal,
      ts: new Date().toISOString()
    })
  }

  // Handle payment completion
  const handlePaymentComplete = () => {
    // 1) Create order from cart
    createOrderFromCart('QR')
    
    // 2) Clear cart
    clearCart()
    
    // 3) Close modal
    setIsPayOpen(false)
    
    // 4) Show success message
    setSuccessMessage('ชำระเงินสำเร็จ!')
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage('')
    }, 3000)
  }

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-12">
        
        {/* Store Logo */}
        <div className="flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full shadow-lg">
          <Store size={64} className="text-indigo-600" />
        </div>

        {/* Total Amount Display */}
        <div className="text-center">
          <p className="text-2xl font-medium text-gray-600 mb-2">ยอดรวม</p>
          <p className="text-6xl font-bold text-gray-900 tracking-tight">
            {formatCurrency(cartTotal)}
          </p>
        </div>

        {/* Payment Button */}
        <button
          onClick={() => setIsPayOpen(true)}
          disabled={cartTotal === 0}
          className={`
            flex items-center space-x-3 px-12 py-4 rounded-xl text-xl font-semibold
            transition-all duration-200 transform hover:scale-105 active:scale-95
            ${cartTotal === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl'
            }
          `}
        >
          <CreditCard size={24} />
          <span>ชำระเงิน</span>
        </button>

        {/* Success Message */}
        {successMessage && (
          <div className="fixed top-20 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-30">
            {successMessage}
          </div>
        )}

      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        title="ชำระเงินด้วย QR Code"
      >
        <div className="text-center space-y-6">
          
          {/* Total in Modal */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-lg text-gray-600">ยอดที่ต้องชำระ</p>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(cartTotal)}
            </p>
          </div>

          {/* QR Code */}
          <QRCodeBox data={generateQRPayload()} size={240} />

          {/* Payment Complete Button */}
          <button
            onClick={handlePaymentComplete}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            ชำระเสร็จแล้ว
          </button>
          
          {/* Cancel Button */}
          <button
            onClick={() => setIsPayOpen(false)}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            ยกเลิก
          </button>
          
        </div>
      </Modal>
      
    </Layout>
  )
}