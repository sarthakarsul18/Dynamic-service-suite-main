import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "react-multi-select-component"; // install: npm i react-multi-select-component

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
  const { register, handleSubmit, control, watch, formState: { errors } } =
    useForm<FormValues>({
      defaultValues: { declaration: false },
    });

  const onSubmit = (data: FormValues) => {
    console.log("Form Submitted:", data);
    alert("Customer Onboarding Form Submitted!");
  };

  return (
    <div className="flex justify-center p-6">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            Customer Onboarding Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Section 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Business & Contact Information</h2>
                <Input placeholder="Shop Name" {...register("shopName", { required: true })} />
                <Input placeholder="Title" {...register("title")} />
                <Input placeholder="Owner Name" {...register("ownerName", { required: true })} />
                <Textarea placeholder="Complete Address" {...register("address", { required: true })} />
                <Input placeholder="Primary Contact Person" {...register("contactPerson")} />
                <Input placeholder="Phone No." type="tel" {...register("phone", { required: true })} />
                <Input placeholder="Email" type="email" {...register("email", { required: true })} />
                <div>
                  <Label>Preferred Communication Method</Label>
                  <RadioGroup defaultValue="Phone">
                    <div className="flex gap-4">
                      {["Email", "WhatsApp", "Phone"].map((opt) => (
                        <div key={opt} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt} {...register("communicationMethod")} />
                          <Label>{opt}</Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            )}

            {/* Section 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Business Operations & Services</h2>
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
              </div>
            )}

            {/* Section 3 */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Regulatory Compliance</h2>
                <Input placeholder="License Number" {...register("licenseNumber")} />
                <Input placeholder="Certifications (FSSAI, BIS, etc.)" {...register("certifications")} />
              </div>
            )}

            {/* Section 4 */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Financial & Banking Details</h2>
                <Input placeholder="Bank Account Name" {...register("bankAccountName")} />
                <Input placeholder="Bank Account Number" {...register("bankAccountNumber")} />
                <Input placeholder="IFSC / Branch" {...register("ifsc")} />
                <Input placeholder="GSTIN" {...register("gst")} />
                <Input placeholder="Financial Health Snapshot (Optional)" {...register("financialHealth")} />
              </div>
            )}

            {/* Section 5 */}
            {step === 5 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Final Declaration</h2>
                <div className="flex items-center space-x-2">
                  <Checkbox {...register("declaration", { required: true })} />
                  <Label>I confirm that all information provided is accurate and I agree to the onboarding process.</Label>
                </div>
                {errors.declaration && (
                  <p className="text-red-500 text-sm">You must confirm before submitting.</p>
                )}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                  Back
                </Button>
              )}
              {step < 5 ? (
                <Button type="button" onClick={() => setStep(step + 1)}>
                  Next
                </Button>
              ) : (
                <Button type="submit">Submit</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
