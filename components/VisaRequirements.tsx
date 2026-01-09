'use client'

import { VisaRequirement } from '@/lib/visaData'

interface VisaRequirementsProps {
  requirement: VisaRequirement
  nationality: string
  destination: string
  onSendQuery: () => void
}

export default function VisaRequirements({ requirement, nationality, destination, onSendQuery }: VisaRequirementsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-apple border border-gray-100/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#007aff]/10 to-[#007aff]/5 p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{requirement.flag}</div>
          <div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              Visa Requirements for {nationality} Nationals
            </h2>
            <p className="text-sm text-gray-600 mt-1">Traveling to {requirement.country}</p>
          </div>
        </div>
      </div>

      {/* Visa Types */}
      <div className="p-6 space-y-6">
        {Object.entries(requirement.visaTypes).map(([visaType, details]) => (
          <div key={visaType} className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{visaType}</h3>
              {details.required ? (
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
                  Visa Required
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
                  Visa Not Required
                </span>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-gray-100/50">
                <div className="text-xs text-gray-500 mb-1 font-medium">Duration</div>
                <div className="text-sm font-semibold text-[#1d1d1f]">{details.duration}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100/50">
                <div className="text-xs text-gray-500 mb-1 font-medium">Processing Time</div>
                <div className="text-sm font-semibold text-[#1d1d1f]">{details.processingTime}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100/50">
                <div className="text-xs text-gray-500 mb-1 font-medium">Cost</div>
                <div className="text-sm font-semibold text-[#1d1d1f]">{details.cost}</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-100/50">
                <div className="text-xs text-gray-500 mb-1 font-medium">Validity</div>
                <div className="text-sm font-semibold text-[#1d1d1f]">{details.validity}</div>
              </div>
            </div>

            {/* Required Documents */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-[#1d1d1f] mb-3">Required Documents</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {details.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-gray-100/50">
                    <svg className="w-4 h-4 text-[#007aff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs font-medium text-[#1d1d1f]">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {details.notes && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="text-xs font-semibold text-amber-900 mb-1">Important Note</div>
                    <p className="text-xs text-amber-800">{details.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Action Button */}
        <div className="pt-6 border-t border-gray-200/50">
          <button
            onClick={onSendQuery}
            className="w-full bg-[#007aff] text-white px-6 py-3.5 rounded-xl text-sm font-medium hover:bg-[#0051d5] transition-all shadow-apple-sm active:scale-95 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Send Query / Request More Information
          </button>
        </div>
      </div>
    </div>
  )
}

