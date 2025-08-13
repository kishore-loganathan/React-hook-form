import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

const Schema = z
  .object({
    name: z.string().min(3, "Name must be more than 3 Characters"),
    email: z.string().email({ message: "Invalid email" }),
    dob: z.coerce.date().refine(
      (date) => {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        const dobmonth = today.getMonth() > date.getMonth();
        return age > 18 || (age === 18 && dobmonth);
      },
      { message: "You must be at least 18 years old" }
    ),
    acctype: z.string(),
    risktollerance: z.string(),
    pan_number: z.string().optional(),
    password: z
      .string()
      .min(8, "Password must have at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).+$/,
        "Password must include upper, lower, number, and special character"
      ),
    confirm_password: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms",
    }),
  })
  .refine(
    (data) => {
      if (data.acctype === "Live") {
        return /^[a-zA-Z0-9]{10}$/.test(data.pan_number || "");
      }
      return true;
    }, 
    {
      message: "PAN number must be exactly 10 alphanumeric characters",
      path: ["pan_number"],
    }
  )
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords must match",
    path: ["confirm_password"],
  });

const App = () => {
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    trigger,
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "onChange",
  });

  const nextStep = async () => {
    let fieldsToValidate: (keyof any)[] = [];
    if (step === 1) fieldsToValidate = ["name", "email", "dob"];
    if (step === 2)
      fieldsToValidate = ["acctype", "risktollerance", "pan_number"];

    const valid = await trigger(fieldsToValidate);
    if (valid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onsubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div >
      <form
        onSubmit={handleSubmit(onsubmit)}
        className="max-w-lg mx-auto p-6 pt-10 bg-white space-y-4"
      >
        {step === 1 && (
          <>
            <div>
              <label className="block font-semibold">Enter your Name</label>
              <input
                type="text"
                {...register("name")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
              {touchedFields.name && errors.name?.message && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">Enter your Email</label>
              <input
                type="email"
                {...register("email")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
              {touchedFields.email && errors.email?.message && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">
                Enter your Date of Birth
              </label>
              <input
                type="date"
                {...register("dob")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
              {touchedFields.dob && errors.dob?.message && (
                <p className="text-red-500 text-sm">{errors.dob.message}</p>
              )}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label className="block font-semibold">
                Enter your Account type
              </label>
              <select
                {...register("acctype")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
                <option value="">Select type</option>
                <option value="Demo">Demo</option>
                <option value="Live">Live</option>
              </select>
              {touchedFields.acctype && errors.acctype?.message && (
                <p className="text-red-500 text-sm">{errors.acctype.message}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold">
                Enter the level of Risk Tolerance
              </label>
              <select
                {...register("risktollerance")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              >
                <option value="">Select risk</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              {touchedFields.risktollerance &&
                errors.risktollerance?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.risktollerance.message}
                  </p>
                )}
            </div>

            <div>
              <label className="block font-semibold">
                Enter Your PAN number
              </label>
              <input
                type="text"
                {...register("pan_number")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
              {touchedFields.pan_number && errors.pan_number?.message && (
                <p className="text-red-500 text-sm">
                  {errors.pan_number.message as string}
                </p>
              )}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div>
              <label className="block font-semibold">Enter Your password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
              {touchedFields.password && errors.password?.message && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-semibold">
                Confirm Your password
              </label>
              <input
                type="password"
                {...register("confirm_password")}
                className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
              />
              {touchedFields.confirm_password &&
                errors.confirm_password?.message && (
                  <p className="text-red-500 text-sm">
                    {errors.confirm_password.message}
                  </p>
                )}
            </div>

            <div>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                Agree to the Terms & Conditions
              </label>
              {errors.terms?.message && (
                <p className="text-red-500 text-sm">{errors.terms.message}</p>
              )}
            </div>
          </>
        )}
        <div className="flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Back
            </button>
          )}
          {step < 3 && (
            <button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default App;
