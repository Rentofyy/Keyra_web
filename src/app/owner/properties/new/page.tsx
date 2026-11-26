"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/auth-store";
import { apiClient } from "@/lib/api-client";
import { PUNE_WEST_LOCALITIES } from "@/lib/constants";
import { formatBhk } from "@/lib/property-helper";
import { Button } from "@/components/ui/button";
import {
  Building2,
  MapPin,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileText,
  Sparkles,
} from "lucide-react";

export default function NewPropertyWizardPage() {
  const router = useRouter();
  const { isAuthenticated, openAuthModal } = useAuthStore();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdPropertyId, setCreatedPropertyId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [locality, setLocality] = useState<string>(PUNE_WEST_LOCALITIES[0]);
  const [address, setAddress] = useState("");
  const [societyName, setSocietyName] = useState("");
  const [latitude, setLatitude] = useState(18.5590);
  const [longitude, setLongitude] = useState(73.7868);

  const [propertyCategory, setPropertyCategory] = useState("APARTMENT");
  const [bhkType, setBhkType] = useState("2_BHK");
  const [furnishingStatus, setFurnishingStatus] = useState("SEMI_FURNISHED");
  const [buildingStructure, setBuildingStructure] = useState("MID_RISE");
  const [documentType, setDocumentType] = useState("UTILITY_BILL");
  const [carpetAreaSqft, setCarpetAreaSqft] = useState<number | "">(950);
  const [floorNumber, setFloorNumber] = useState<number | "">(4);
  const [totalFloors, setTotalFloors] = useState<number | "">(12);
  const [rentAmount, setRentAmount] = useState<number | "">(28000);
  const [depositAmount, setDepositAmount] = useState<number | "">(60000);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const [hasInverter, setHasInverter] = useState(true);
  const [amenities, setAmenities] = useState<string[]>([
    "Power Backup",
    "Gated Security",
    "Reserved Parking",
    "Lift",
  ]);
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState("Family or working professionals preferred.");

  // Media
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<File | null>(null);

  const toggleAmenity = (name: string) => {
    setAmenities((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedPhotos((prev) => [...prev, ...files].slice(0, 10));
    }
  };

  const handleDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedDoc(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    setSubmissionError(null);
    setIsSubmitting(true);
    try {
      // 1. Create property listing with verified enums
      const formattedBhk = formatBhk(bhkType);
      const payload = {
        title: title || `${formattedBhk} Flat in ${societyName || locality || "Pune West"}`,
        description: description || `Verified spacious home in ${locality}, Pune West. Zero brokerage.`,
        rentAmount: Number(rentAmount),
        depositAmount: Number(depositAmount),
        bhkType,
        address: `${address ? `${address}, ` : ""}${societyName ? `${societyName}, ` : ""}${locality}, Pune`,
        latitude,
        longitude,
        propertyCategory,
        furnishingStatus,
        buildingStructure,
        carpetAreaSqft: Number(carpetAreaSqft) || undefined,
        floorNumber: Number(floorNumber) || undefined,
        totalFloors: Number(totalFloors) || undefined,
        hasInverter,
        rules,
        societyAmenities: amenities.join(", "),
      };

      const res = await apiClient.post<any>("/owner/properties", payload);
      const newId = res.data?.id;
      setCreatedPropertyId(newId);

      // 2. Upload photos if any (browser auto-generates multipart/form-data boundary)
      if (newId && selectedPhotos.length > 0) {
        for (let i = 0; i < selectedPhotos.length; i++) {
          const photoData = new FormData();
          photoData.append("file", selectedPhotos[i]);
          photoData.append("isPrimary", i === 0 ? "true" : "false");
          try {
            await apiClient.post(`/owner/properties/${newId}/photos`, photoData);
          } catch (photoErr: any) {
            console.warn(`Photo upload failed for index ${i}:`, photoErr?.response?.data || photoErr.message);
          }
        }
      }

      // 3. Upload verification document if any (valid DocumentType enum)
      if (newId && selectedDoc) {
        const docData = new FormData();
        docData.append("file", selectedDoc);
        docData.append("documentType", documentType);
        try {
          await apiClient.post(`/owner/properties/${newId}/documents`, docData);
        } catch (docErr: any) {
          console.warn("Document upload failed:", docErr?.response?.data || docErr.message);
        }
      }

      setStep(5); // Success step
    } catch (err: any) {
      console.error("Property creation error:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create property. Please verify all required fields.";
      setSubmissionError(backendMessage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Wizard Header & Stepper */}
      <div className="mb-8">
        <Link
          href="/owner/dashboard"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Owner Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
              List Your Property
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with verified tenants in Pune West. 100% Free listing & Zero Brokerage.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-[#C5A059] border border-[#C5A059]/30">
            <Sparkles className="h-3.5 w-3.5" /> ₹500 Cashback on Rent Out
          </span>
        </div>

        {/* Global Submission Error Banner */}
        {submissionError && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl bg-red-50 p-4 border border-red-200 text-red-800 text-sm">
            <div className="rounded-full bg-red-100 p-1 text-red-600 mt-0.5">
              <span className="font-bold text-xs block px-1">!</span>
            </div>
            <div className="flex-1">
              <strong className="font-bold block">Submission Error</strong>
              <p className="mt-0.5 text-xs text-red-700">{submissionError}</p>
            </div>
            <button
              onClick={() => setSubmissionError(null)}
              className="text-xs text-red-600 font-semibold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step Indicator */}
        {step <= 4 && (
          <div className="mt-6 grid grid-cols-4 gap-2">
            {[
              { num: 1, label: "Location" },
              { num: 2, label: "Config & Rent" },
              { num: 3, label: "Amenities" },
              { num: 4, label: "Photos & Docs" },
            ].map((s) => (
              <div
                key={s.num}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  step === s.num
                    ? "border-[#0F1E36] bg-[#0F1E36] text-white shadow-sm"
                    : step > s.num
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wider">Step {s.num}</div>
                <div className="text-xs font-extrabold mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wizard Step Containers */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card">
        {/* Step 1: Location */}
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="font-heading text-lg font-bold text-[#0F1E36]">
              Step 1: Property Location & Locality
            </h2>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Pune West Locality *
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
              >
                {PUNE_WEST_LOCALITIES.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Society or Building Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Kasturi The Balmoral Riverside"
                value={societyName}
                onChange={(e) => setSocietyName(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Detailed Address / Landmark *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Flat 402, Tower B, Near Orchid School, Balewadi High Street"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Accurate Geotagging:</strong>
                <p className="mt-0.5 text-slate-500">
                  Location coordinates are automatically pinned for {locality} ({latitude.toFixed(4)}, {longitude.toFixed(4)}) to display on the interactive map.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="gold"
                onClick={() => {
                  if (!societyName || !address) {
                    alert("Please provide the society name and address.");
                    return;
                  }
                  setStep(2);
                }}
                className="font-bold shadow-gold px-6"
              >
                Next: Configuration & Pricing <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Configuration & Pricing */}
        {step === 2 && (
          <div className="space-y-5">
            <h2 className="font-heading text-lg font-bold text-[#0F1E36]">
              Step 2: Configuration & Pricing
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Property Category *
                </label>
                <select
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="APARTMENT">Apartment / Flat</option>
                  <option value="VILLA">Independent Villa</option>
                  <option value="INDEPENDENT_HOUSE">Independent / Row House</option>
                  <option value="PG_HOSTEL">PG / Co-living</option>
                  <option value="COMMERCIAL">Commercial Office / Space</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Building Rise / Structure *
                </label>
                <select
                  value={buildingStructure}
                  onChange={(e) => setBuildingStructure(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="LOW_RISE">Low-Rise (1 - 4 Floors)</option>
                  <option value="MID_RISE">Mid-Rise (5 - 15 Floors)</option>
                  <option value="HIGH_RISE">High-Rise (16+ Floors)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  BHK Type *
                </label>
                <select
                  value={bhkType}
                  onChange={(e) => setBhkType(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="1_RK">1 RK</option>
                  <option value="1_BHK">1 BHK</option>
                  <option value="2_BHK">2 BHK</option>
                  <option value="3_BHK">3 BHK</option>
                  <option value="4_BHK">4+ BHK / Penthouse</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Furnishing Status *
                </label>
                <select
                  value={furnishingStatus}
                  onChange={(e) => setFurnishingStatus(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="UNFURNISHED">Unfurnished</option>
                  <option value="SEMI_FURNISHED">Semi-Furnished</option>
                  <option value="FURNISHED">Fully Furnished</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Carpet (sqft)
                </label>
                <input
                  type="number"
                  placeholder="950"
                  value={carpetAreaSqft}
                  onChange={(e) => setCarpetAreaSqft(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Floor No.
                </label>
                <input
                  type="number"
                  placeholder="4"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Total Floors
                </label>
                <input
                  type="number"
                  placeholder="12"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value === "" ? "" : Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Monthly Rent (₹) *
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={rentAmount}
                    onChange={(e) => setRentAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Security Deposit (₹) *
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    placeholder="50000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 pl-8 pr-3.5 py-2.5 text-sm font-bold text-slate-900 focus:border-[#C5A059] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                variant="gold"
                onClick={() => {
                  if (!rentAmount || !depositAmount) {
                    alert("Please enter monthly rent and deposit amount.");
                    return;
                  }
                  setStep(3);
                }}
                className="font-bold shadow-gold px-6"
              >
                Next: Amenities <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Amenities & Preferences */}
        {step === 3 && (
          <div className="space-y-5">
            <h2 className="font-heading text-lg font-bold text-[#0F1E36]">
              Step 3: Amenities & Society Features
            </h2>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                Available Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  "Power Backup",
                  "Gated Security",
                  "Reserved Parking",
                  "Lift",
                  "Clubhouse / Gym",
                  "Swimming Pool",
                  "Piped Gas Pipeline",
                  "Children Play Area",
                  "Water Purifier",
                  "Solar Water Heater",
                  "CCTV Surveillance",
                  "EV Charging Station",
                ].map((amenity) => {
                  const active = amenities.includes(amenity);
                  return (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs font-semibold text-left transition-all ${
                        active
                          ? "border-[#006A61] bg-[#E6F5F3] text-[#006A61]"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <CheckCircle2
                        className={`h-4 w-4 shrink-0 ${active ? "text-[#006A61]" : "text-slate-300"}`}
                      />
                      <span>{amenity}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Tenant Rules / Preferences
              </label>
              <input
                type="text"
                placeholder="e.g. Family or working professionals preferred. Vegetarians preferred."
                value={rules}
                onChange={(e) => setRules(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-900 focus:border-[#C5A059] focus:outline-none"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                variant="gold"
                onClick={() => setStep(4)}
                className="font-bold shadow-gold px-6"
              >
                Next: Photos & Verification <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Photos & Verification */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="font-heading text-lg font-bold text-[#0F1E36]">
              Step 4: Upload Photos & Verification Document
            </h2>

            {/* Photos Dropzone */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">
                Property Photographs (Up to 10 photos)
              </label>
              <div className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-[#C5A059] transition-colors bg-slate-50">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-xs font-bold text-slate-700">
                  Drag and drop property photos, or browse files
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  PNG, JPG up to 10MB each. Clear living room and bedroom photos rent 3x faster.
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="mt-4 text-xs text-slate-500 file:mr-3 file:rounded-xl file:border-0 file:bg-[#0F1E36] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#1A2F50]"
                />
              </div>

              {selectedPhotos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                  {selectedPhotos.map((f, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                    >
                      {f.name} {i === 0 && "(Primary)"}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Verification Document */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Ownership Verification Document
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-800 focus:border-[#C5A059] focus:outline-none"
                >
                  <option value="UTILITY_BILL">Electricity / Water Bill</option>
                  <option value="OWNERSHIP_PROOF">Index II / Sale Deed</option>
                  <option value="TAX_RECEIPT">Property Tax Receipt</option>
                  <option value="GOVERNMENT_ID">Owner Government ID</option>
                </select>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-[#006A61]" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {selectedDoc ? selectedDoc.name : "Select Document (PDF, JPG, PNG up to 15MB)"}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Kept strictly confidential. Used solely for KEYRA physical verification and badge approval.
                    </p>
                  </div>
                </div>
                <label className="cursor-pointer rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100">
                  Browse
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleDocSelect}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Zero Brokerage & Cashback Box */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 space-y-1">
              <strong className="font-extrabold flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#C5A059]" /> ₹500 Direct Account Cashback Guarantee
              </strong>
              <p className="text-slate-600 text-[11px]">
                When a tenant closes this lease through KEYRA, we directly credit ₹500 to your bank account or wallet. Zero commissions, zero hidden platform charges.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="outline" onClick={() => setStep(3)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                variant="gold"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="font-bold shadow-gold px-8 h-11"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Listing...
                  </>
                ) : (
                  "Submit Property For Verification"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Success Confirmation */}
        {step === 5 && (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <h2 className="font-heading text-2xl font-extrabold text-[#0F1E36]">
              Property Listed Successfully!
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your property has been received with status <strong>Pending Verification</strong>.
              A KEYRA Field Executive will conduct a rapid physical audit within 24 hours to attach your <strong>Verified Badge</strong>.
            </p>
            <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/owner/dashboard">
                <Button variant="gold" className="font-bold w-full sm:w-auto">
                  Go to Owner Dashboard
                </Button>
              </Link>
              {createdPropertyId && (
                <Link href={`/properties/${createdPropertyId}`}>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Preview Public Listing
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
