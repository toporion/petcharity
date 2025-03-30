import { useForm } from "react-hook-form";

export default function AnimalForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Animal Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {[
              { label: "Name", name: "name", type: "text" },
              { label: "Breed", name: "breed", type: "select", options: ["Labrador", "Bulldog", "Poodle", "Beagle"] },
              { label: "Species", name: "species", type: "select", options: ["Dog", "Cat", "Rabbit"] },
              { label: "Color", name: "color", type: "text" },
              { label: "Age", name: "age", type: "text" },
              { label: "Rehoming Fee", name: "rehomingFee", type: "number" },
            ].map(({ label, name, type, options }) => (
              <div key={name} className="flex flex-col md:flex-row md:items-center">
                <label className="md:w-32 mb-1 md:mb-0">{label}:</label>
                {type === "select" ? (
                  <select {...register(name)} className="border p-2 flex-1 rounded">
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input {...register(name)} type={type} className="border p-2 flex-1 rounded" />
                )}
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {[
              { label: "Sex", name: "sex", type: "select", options: ["Male", "Female"] },
              { label: "Arrived Date", name: "arrivedDate", type: "date" },
              { label: "Arrived From", name: "arrivedFrom", type: "text" },
              { label: "Size", name: "size", type: "select", options: ["Small (<15kg)", "Large (15-30kg)", "Extra Large (>30kg)"] },
              { label: "Location", name: "location", type: "select", options: ["New York", "Los Angeles", "Chicago"] },
              { label: "Adoption Status", name: "adoptionStatus", type: "select", options: ["In Rescue", "Adopted"] },
            ].map(({ label, name, type, options }) => (
              <div key={name} className="flex flex-col md:flex-row md:items-center">
                <label className="md:w-32 mb-1 md:mb-0">{label}:</label>
                {type === "select" ? (
                  <select {...register(name)} className="border p-2 flex-1 rounded">
                    {options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input {...register(name)} type={type} className="border p-2 flex-1 rounded" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
