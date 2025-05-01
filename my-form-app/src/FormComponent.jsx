import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";

function FormComponent() {
  const { getToken } = useAuth(); // Get Clerk auth context
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null); // For error handling
  const [success, setSuccess] = useState(null); // For success message
  const [loading, setLoading] = useState(false); // For loading state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const token = await getToken();

      if (!token) {
        setError("❌ User not authenticated");
        setLoading(false);
        return;
      }

      console.log("🪪 Clerk token:", token); // Log the token for debugging

      const response = await axios.post(
        "http://localhost:5000/api/forms",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in the header
          },
        }
      );

      console.log("✅ Form created:", response.data);
      setSuccess("✅ Form created successfully!");
      setTitle(""); // Optionally reset form values after success
      setDescription("");
    } catch (error) {
      console.error("❌ Error creating form:", error);
      setError(
        "🔥 Error creating form: " + (error?.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
}

export default FormComponent;
