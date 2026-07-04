'use client';

import React, { useState } from 'react';
import { Wallet01Icon, ChevronRightIcon, ArrowLeft02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

export default function PaymentMethodTab() {
  const [view, setView] = useState<'main' | 'edit'>('main');

  if (view === 'edit') {
    return (
      <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-300 w-full max-w-2xl mx-auto mt-2">
        <button 
          onClick={() => setView('main')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-8 group"
        >
          <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">Back to Payment Methods</span>
        </button>

        <h2 className="text-[24px] font-bold text-gray-900 mb-2">Update Payment Method</h2>
        <p className="text-[14px] text-gray-500 mb-8">
          Update your bank card details or add a new one for future cleanings and subscriptions.
        </p>

        <div className="flex flex-col gap-5 w-full">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">Cardholder Name</label>
            <input 
              type="text" 
              placeholder="e.g. Hridoy Hossain"
              className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-gray-700">Card Number</label>
            <div className="relative flex items-center">
              <input 
                type="text" 
                placeholder="**** **** **** 4242"
                className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
              />
              <div className="absolute right-4 w-8 h-5 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-[#1434CB] font-bold text-[8px] italic">VISA</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">Expiration Date</label>
              <input 
                type="text" 
                placeholder="MM/YY"
                className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-700">CVV / CVC</label>
              <input 
                type="password" 
                placeholder="***"
                maxLength={4}
                className="w-full h-[52px] bg-[#FAFAFA] border border-gray-200 rounded-xl px-4 text-[14px] text-gray-900 focus:outline-none focus:border-[#0084FF] focus:bg-white transition-colors"
              />
            </div>
          </div>

          <button className="w-full h-[52px] bg-[#0084FF] hover:bg-[#0073E6] text-white font-medium rounded-xl mt-4 transition-colors shadow-sm shadow-blue-200">
            Save Changes
          </button>

        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col animate-in fade-in zoom-in-95 duration-300 w-full max-w-2xl mx-auto items-center mt-6">
      
      {/* Top Header Section */}
      <div className="flex flex-col items-center mb-12 text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-[#F5F9FF] flex items-center justify-center mb-5">
          <HugeiconsIcon icon={Wallet01Icon} className="w-6 h-6 text-[#0084FF]" />
        </div>
        <p className="text-[13px] text-gray-500 max-w-[340px] leading-relaxed text-center">
          Manage your bank cards and other payment methods save to your account.
        </p>
      </div>

      <div className="w-full flex flex-col gap-8">
        
        {/* Bank Cards Section */}
        <div className="flex flex-col w-full">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">BANK CARDS</h3>
          <div className="flex flex-col gap-2">
            
            {/* Visa */}
            <button 
              onClick={() => setView('edit')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                  <span className="text-[#1434CB] font-bold text-[12px] italic">VISA</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-[14px] text-gray-900 font-medium">Visa **** 4242</span>
                    <span className="px-2 py-0.5 bg-[#E6F2FF] text-[#0084FF] text-[10px] font-medium rounded-full">Default</span>
                  </div>
                  <span className="text-[12px] text-gray-400">Expires 12/26</span>
                </div>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            {/* MasterCard */}
            <button 
              onClick={() => setView('edit')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm relative overflow-hidden">
                  <div className="w-4 h-4 rounded-full bg-[#EB001B] opacity-80 absolute -translate-x-1.5"></div>
                  <div className="w-4 h-4 rounded-full bg-[#F79E1B] opacity-80 absolute translate-x-1.5"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] text-gray-900 font-medium mb-0.5">MasterCard **** 4242</span>
                  <span className="text-[12px] text-gray-400">Expires 12/26</span>
                </div>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            {/* American Express */}
            <button 
              onClick={() => setView('edit')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-[#2671B9] rounded flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-[8px] text-center leading-tight">AMEX</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] text-gray-900 font-medium mb-0.5">American Express **** 4242</span>
                  <span className="text-[12px] text-gray-400">Expires 12/26</span>
                </div>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

          </div>
        </div>

        {/* Other Payment Methods Section */}
        <div className="flex flex-col w-full">
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">OTHER PAYMENT METHODS</h3>
          <div className="flex flex-col gap-2">
            
            {/* Apple Pay */}
            <button 
              onClick={() => setView('edit')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.32 14.86c-1.12 0-2.14-.54-2.82-1.38-.68.84-1.7 1.38-2.82 1.38-2.16 0-3.9-1.74-3.9-3.9s1.74-3.9 3.9-3.9c1.08 0 2.06.46 2.76 1.2.7-.74 1.68-1.2 2.76-1.2 2.16 0 3.9 1.74 3.9 3.9s-1.74 3.9-3.9 3.9z"/>
                    {/* Placeholder Apple Pay SVG path using a generic shape, for actual logo use standard icons. We will just use the text "Pay" to resemble the logo */}
                  </svg>
                  <span className="text-[10px] font-bold ml-1">Pay</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] text-gray-900 font-medium mb-0.5">Visa **** 4242</span>
                  <span className="text-[12px] text-gray-400">Fast and secure payment with Apple Pay</span>
                </div>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

            {/* Google Pay */}
            <button 
              onClick={() => setView('edit')}
              className="w-full bg-[#FAFAFA] border border-transparent hover:border-gray-200 transition-colors rounded-xl p-4 flex items-center justify-between group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-white border border-gray-100 rounded flex items-center justify-center shadow-sm">
                  <span className="text-[11px] font-bold text-gray-600">G Pay</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] text-gray-900 font-medium mb-0.5">MasterCard **** 4242</span>
                  <span className="text-[12px] text-gray-400">Fast and secure payment with Google Pay</span>
                </div>
              </div>
              <HugeiconsIcon icon={ChevronRightIcon} className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
}
