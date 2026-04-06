import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "react-multi-select-component";
import { motion } from "framer-motion";

type FormValues = {
  shopName: string;
  title: string;
  ownerName: string;
  address: string;
  contactPerson: string;
  phone: string;
  email: string;
  communicationMethod: string;
  services: { label: string; value: string }[];
  specializations: { label: string; value: string }[];
  yearsInOperation: string;
  operatingHours: string;
  licenseNumber: string;
  certifications: string;
  bankAccountName: string;
  bankAccountNumber: string;
  ifsc: string;
  gst: string;
  financialHealth?: string;
  declaration: boolean;
};

const serviceOptions = [
  { label: "Retail", value: "Retail" },
  { label: "Grooming", value: "Grooming" },
  { label: "Boarding", value: "Boarding" },
  { label: "Veterinary Consultations", value: "Veterinary" },
  { label: "Pet Food Sales", value: "Food" },
  { label: "Pet Walker", value: "Walker" },
  { label: "Pet Cremation", value: "Cremation" },
  { label: "Others", value: "Others" },
];

const specializationOptions = [
  { label: "Cats", value: "Cats" },
  { label: "Large Breeds", value: "LargeBreeds" },
  { label: "Exotic Pets", value: "Exotic" },
  { label: "Dogs", value: "Dogs" },
  { label: "Others", value: "Others" },
];

export default function CustomerOnboardingForm() {
  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { declaration: false },
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
    alert("Customer Onboarding Form Submitted!");
  };

  const steps = [
    "Business & Contact",
    "Operations & Services",
    "Regulatory",
    "Financial",
    "Declaration",
  ];

  const progress = Math.round((step / steps.length) * 100);

  return (
    <div className="flex justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen">
      <Card className="w-full max-w-3xl shadow-2xl rounded-2xl border-0 bg-white/90 backdrop-blur">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl text-center">
          <h1 className="text-2xl font-bold">Customer Onboarding Form</h1>
          <p className="text-sm opacity-80">
            Step {step} of {steps.length}: {steps[step - 1]}
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`flex-1 text-xs text-center ${
                  step === i + 1
                    ? "text-blue-700 font-semibold"
                    : i + 1 < step
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
            />
            <span className="absolute inset-0 flex justify-center items-center text-[10px] font-semibold text-gray-700">
              {progress}%
            </span>
          </div>
        </div>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-blue-700 border-l-4 border-blue-500 pl-2">
                  Business & Contact Information
                </h2>
                <Input placeholder="Shop Name" {...register("shopName", { required: true })} />
                <Input placeholder="Title" {...register("title")} />
                <Input placeholder="Owner Name" {...register("ownerName", { required: true })} />
                <Textarea placeholder="Complete Address" {...register("address", { required: true })} />
                <Input placeholder="Primary Contact Person" {...register("contactPerson")} />
                <Input placeholder="Phone No." type="tel" {...register("phone", { required: true })} />
                <Input placeholder="Email" type="email" {...register("email", { required: true })} />
                <div>
                  <Label className="font-semibold">Preferred Communication Method</Label>
                  <RadioGroup defaultValue="Phone" className="flex gap-6 mt-2">
                    {["Email", "WhatsApp", "Phone"].map((opt) => (
                      <div key={opt} className="flex items-center space-x-2">
                        <RadioGroupItem value={opt} {...register("communicationMethod")} />
                        <Label>{opt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-purple-700 border-l-4 border-purple-500 pl-2">
                  Business Operations & Services
                </h2>
                <Controller
                  control={control}
                  name="services"
                  render={({ field }) => (
                    <MultiSelect
                      options={serviceOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      labelledBy="Select Services"
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="specializations"
                  render={({ field }) => (
                    <MultiSelect
                      options={specializationOptions}
                      value={field.value || []}
                      onChange={field.onChange}
                      labelledBy="Select Specializations"
                    />
                  )}
                />
                <Input placeholder="Years in Operation" {...register("yearsInOperation")} />
                <Input placeholder="Operating Hours/Days" {...register("operatingHours")} />
              </motion.div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-green-700 border-l-4 border-green-500 pl-2">
                  Regulatory Compliance
                </h2>
                <Input placeholder="License Number" {...register("licenseNumber")} />
                <Input placeholder="Certifications (FSSAI, BIS, etc.)" {...register("certifications")} />
              </motion.div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-orange-700 border-l-4 border-orange-500 pl-2">
                  Financial & Banking Details
                </h2>
                <Input placeholder="Bank Account Name" {...register("bankAccountName")} />
                <Input placeholder="Bank Account Number" {...register("bankAccountNumber")} />
                <Input placeholder="IFSC / Branch" {...register("ifsc")} />
                <Input placeholder="GSTIN" {...register("gst")} />
                <Input placeholder="Financial Health Snapshot (Optional)" {...register("financialHealth")} />
              </motion.div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-4"
              >
                <h2 className="text-lg font-semibold text-red-700 border-l-4 border-red-500 pl-2">
                  Final Declaration
                </h2>
                <div className="flex items-start space-x-2 bg-red-50 p-3 rounded-lg">
                  <Checkbox {...register("declaration", { required: true })} />
                  <Label>
                    I confirm that all information provided is accurate and I agree to the onboarding process.
                  </Label>
                </div>
                {errors.declaration && (
                  <p className="text-red-500 text-sm">You must confirm before submitting.</p>
                )}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  ⬅ Back
                </Button>
              )}
              {step < steps.length ? (
                <Button type="button" onClick={() => setStep(step + 1)}>
                  Next ➡
                </Button>
              ) : (
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  ✅ Submit
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
