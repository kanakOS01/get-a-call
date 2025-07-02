import { useState } from "react";
import { Phone, Heart } from "lucide-react";
import CallScreenGenerator from "@/components/call-screen-generator";

export default function Home() {
  return (
    <div className="bg-gray-50 font-inter min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Phone className="text-white text-lg" size={20} />
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">Get a Call</h1>
            </div>
            <div className="hidden sm:block text-sm text-gray-500">
              Create realistic call banners
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CallScreenGenerator />

        {/* Instructions Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to use</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">Enter Details</p>
                <p className="text-blue-600">Fill in company name and caller name</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">Add Picture</p>
                <p className="text-blue-600">Upload profile picture or use default</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">Generate & Download</p>
                <p className="text-blue-600">Create your call banner and save it</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-500">© 2025 Get a Call. For entertainment purposes only.</p>
            <div className="flex items-center space-x-4 mt-2 sm:mt-0">
              <span className="text-sm text-gray-400">Made with</span>
              <Heart className="text-red-400 fill-current" size={16} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
