import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormDynamic from "../components/FormDynamic";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import mataKuliahService from "../services/mataKuliahService";

const MataKuliahForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(id ? true : false);
  const [error, setError] = useState(null);
  const [mataKuliah, setMataKuliah] = useState(null);
  const [formSchema, setFormSchema] = useState([]);

  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchMataKuliah = async () => {
      if (!isEditMode) {
        // For new mata kuliah, create empty schema
        setFormSchema([
          { key: "kode", label: "Kode", type: "text", required: true },
          { key: "nama", label: "Nama", type: "text", required: true },
          { key: "sks", label: "SKS", type: "number", required: true, min: 1, max: 6 },
          { key: "jurusan", label: "Jurusan", type: "text", required: true }
        ]);
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        const data = await mataKuliahService.getMataKuliah(id);
        setMataKuliah(data);
        
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
            
            const field = {
              key,
              label: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize first letter
              type,
              required: true // Assuming all fields are required
            };
            
            // Add min/max for SKS field
            if (key === 'sks') {
              field.min = 1;
              field.max = 6;
            }
            
            return field;
          });
        
        setFormSchema(schema);
      } catch (err) {
        console.error("Error fetching mata kuliah:", err);
        setError("Failed to load mata kuliah data. Please try again later.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchMataKuliah();
  }, [id, isEditMode]);
  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      if (isEditMode) {
        await mataKuliahService.updateMataKuliah(id, formData);
        navigate("/class", { 
          state: { successMessage: `${formData.nama} was successfully updated.` } 
        });
      } else {
        await mataKuliahService.addMataKuliah(formData);
        navigate("/class", {
          state: { successMessage: `${formData.nama} was successfully added.` }
        });
      }
    } catch (err) {
      console.error("Error saving mata kuliah:", err);
      setError(`Failed to save mata kuliah: ${err.message || 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return <LoadingIndicator message="Loading mata kuliah data..." />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit Mata Kuliah" : "Add New Mata Kuliah"}
      </h1>

      {error && <ErrorMessage message={error} />}

      <FormDynamic
        schema={formSchema}
        initialData={mataKuliah}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title={isEditMode ? "Edit Mata Kuliah Details" : "New Mata Kuliah Details"}
        submitButtonText={isEditMode ? "Update" : "Create"}
        onCancel={() => navigate("/class")}
      />
    </div>
  );
};

export default MataKuliahForm;
