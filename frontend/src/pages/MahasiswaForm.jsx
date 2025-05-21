import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormDynamic from "../components/FormDynamic";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import mahasiswaService from "../services/mahasiswaService";

const MahasiswaForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [mahasiswa, setMahasiswa] = useState(null);
  const [formSchema, setFormSchema] = useState([]);

  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchMahasiswa = async () => {
      if (!isEditMode) {
        // For new mahasiswa, create empty schema
        setFormSchema([
          { key: "name", label: "Name", type: "text", required: true },
          { key: "npm", label: "NPM", type: "text", required: true },
          { key: "jurusan", label: "Jurusan", type: "text", required: true }
        ]);
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        const data = await mahasiswaService.getMahasiswa(id);
        setMahasiswa(data);
        
        // Dynamically create form schema based on the object structure
        // Excluding MongoDB specific fields
        const excludedFields = ['_id', '__v', 'createdAt', 'updatedAt'];
        const schema = Object.entries(data)
          .filter(([key]) => !excludedFields.includes(key))
          .map(([key, value]) => {
            // Determine the input type based on the value type
            let type = "text";
            if (typeof value === "number") {
              type = "number";
            } else if (typeof value === "boolean") {
              type = "checkbox";
            }
            
            return {
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
              type,
              required: true // Assuming all fields are required
            };
          });
        
        setFormSchema(schema);
      } catch (err) {
        console.error("Error fetching mahasiswa:", err);
        setError("Failed to load mahasiswa data. Please try again later.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchMahasiswa();
  }, [id, isEditMode]);
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      if (isEditMode) {
        await mahasiswaService.updateMahasiswa(id, formData);
        navigate("/mahasiswa", { 
          state: { successMessage: `${formData.name} was successfully updated.` } 
        });
      } else {
        await mahasiswaService.addMahasiswa(formData);
        navigate("/mahasiswa", {
          state: { successMessage: `${formData.name} was successfully added.` }
        });
      }
    } catch (err) {
      console.error("Error saving mahasiswa:", err);
      setError(`Failed to save mahasiswa: ${err.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return <LoadingIndicator message="Loading mahasiswa data..." />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit Mahasiswa" : "Add New Mahasiswa"}
      </h1>

      {error && <ErrorMessage message={error} />}

      <FormDynamic
        schema={formSchema}
        initialData={mahasiswa}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title={isEditMode ? "Edit Mahasiswa Details" : "New Mahasiswa Details"}
        submitButtonText={isEditMode ? "Update" : "Create"}
        onCancel={() => navigate("/mahasiswa")}
      />
    </div>
  );
};

export default MahasiswaForm;
