import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const PetsList = () => {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({
    breed: "",
    species: "",
    location: "",
    age: "",
    sex: "",
  });

  useEffect(() => {
    fetchPets();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchPets();
    }, 10000); // 10000 ms = 10 seconds

    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);

  const fetchPets = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/animals");
      setPets(response.data.data);
    } catch (error) {
      console.error("Error fetching pets:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/animals", { params: filters });
      setPets(response.data.data);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Filter Section */}
      <div className="bg-white p-4 shadow-md rounded-lg mb-4 flex flex-wrap gap-4">
        <select name="breed" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select Breed</option>
          <option value="Labrador">Labrador</option>
          <option value="Bulldog">Bulldog</option>
          <option value="Poodle">Poodle</option>
          <option value="Beagle">Beagle</option>
        </select>
        <select name="species" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select Species</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Rabbit">Rabbit</option>
        </select>
        <select name="location" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select Location</option>
          <option value="New York">New York</option>
          <option value="Los Angeles">Los Angeles</option>
          <option value="Chicago">Chicago</option>
        </select>
        <select name="age" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select Age</option>
          <option value="Puppy">Puppy</option>
          <option value="Young">Young</option>
          <option value="Adult">Adult</option>
        </select>
        <select name="sex" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Select Sex</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <button onClick={applyFilters} className="px-4 py-2 bg-blue-500 text-white rounded">
          Apply Filters
        </button>
      </div>

      {/* Pets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.length > 0 ? (
          pets.map((pet) => (
            <div key={pet._id} className="bg-white p-4 shadow-md rounded-lg border relative">
              {/* Availability Badge */}
              {pet.adoptionStatus !== "Adopted" && (
                <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 text-xs font-bold rounded">
                  Available
                </span>
              )}
              <img src={pet.profileImage || "/default-image.jpg"} alt={pet.name} className="w-full h-48 object-cover rounded" />
              <h2 className="text-xl font-bold mt-2">{pet.name}</h2>

              {/* Two rows of information below name */}
              <div className="mt-2 grid grid-cols-2 gap-2 text-gray-600">
                <p>Breed: {pet.breed}</p>
                <p>Species: {pet.species}</p>
                <p>Location: {pet.location}</p>
                <p>Age: {pet.age}</p>
                <p>Sex: {pet.sex}</p>
                <p>Fee: ${pet.rehomingFee}</p>
              </div>

              {/* Conditional "Adopt" button */}
              {pet.adoptionStatus !== "Adopted" && (
                <Link to={`/adopt/${pet._id}`}><button className="absolute bottom-4 right-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
                  Adopt
                </button></Link>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No pets found</p>
        )}
      </div>
    </div>
  );
};

export default PetsList;
