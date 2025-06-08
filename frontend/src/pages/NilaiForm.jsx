import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormDynamic from "../components/FormDynamic";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import nilaiService from "../services/nilaiService";
import mahasiswaService from "../services/mahasiswaService";
import mataKuliahService from "../services/mataKuliahService";

const NilaiForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nilai, setNilai] = useState(null);
  const [mahasiswaOptions, setMahasiswaOptions] = useState([]);
  const [mataKuliahOptions, setMataKuliahOptions] = useState([]);
  const [formSchema, setFormSchema] = useState([]);

  const isEditMode = Boolean(id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetchLoading(true);
        
        // Fetch mahasiswa and mata kuliah data for dropdown options
        const [mahasiswaData, mataKuliahData] = await Promise.all([
          mahasiswaService.getAllMahasiswa(),
          mataKuliahService.getAllMataKuliah()
        ]);
        
        // Format options for dropdown selects
        const mOptions = mahasiswaData.map(m => ({
          value: m._id,
          label: `${m.npm} - ${m.name}`
        }));
        
        const mkOptions = mataKuliahData.map(mk => ({
          value: mk._id,
          label: `${mk.kode} - ${mk.nama}`
        }));
          setMahasiswaOptions(mOptions);
        setMataKuliahOptions(mkOptions);
        
        // If editing existing nilai, fetch it
        if (isEditMode) {
          const nilaiData = await nilaiService.getNilai(id);
          
          // Create a copy of the data that we can transform
          const transformedData = { ...nilaiData };
          
          // Transform the data to match the form schema
          // For dropdowns, we need to set the value to the ID, not the full object
          if (transformedData.mahasiswa && typeof transformedData.mahasiswa === 'object') {
            transformedData.mahasiswa = transformedData.mahasiswa._id;
          }
          
          if (transformedData.mataKuliah && typeof transformedData.mataKuliah === 'object') {
            transformedData.mataKuliah = transformedData.mataKuliah._id;
          }
          
          setNilai(transformedData);
        }
        
        // Create form schema
        const schema = [
          {
            key: "mahasiswa",
            label: "Mahasiswa",
            type: "select",
            options: mOptions,
            required: true
          },
          {
            key: "mataKuliah",
            label: "Mata Kuliah",
            type: "select",
            options: mkOptions,
            required: true
          },
          {
            key: "semester",
            label: "Semester",
            type: "text",
            required: true,
            placeholder: "e.g. 2023/2024-1"
          },
          {
            key: "nilai",
            label: "Nilai",
            type: "number",
            min: 0,
            max: 100,
            required: true
          }
        ];
        
        setFormSchema(schema);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load required data. Please try again later.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      if (isEditMode) {
        await nilaiService.updateNilai(id, formData);
      } else {
        await nilaiService.addNilai(formData);
      }
      
      navigate("/grade");
    } catch (err) {
      console.error("Error saving nilai:", err);
      setError("Failed to save nilai. Please try again.");
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return <LoadingIndicator message="Loading data..." />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit Nilai" : "Add New Nilai"}
      </h1>

      {error && <ErrorMessage message={error} />}

      <FormDynamic
        schema={formSchema}
        initialData={nilai}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        title={isEditMode ? "Edit Nilai Details" : "New Nilai Details"}
        submitButtonText={isEditMode ? "Update" : "Create"}
        onCancel={() => navigate("/grade")}
      />
    </div>
  );
};

export default NilaiForm;
