import { useState, type FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";

const AddDataForm = () => {
    const { user } = useAuth();

    const [title, setTitle] = useState("");
    const [details, setDetails] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!user) {
            setError("You must be logged in to add data.");
            return;
        }

        const trimmedTitle = title.trim();
        const trimmedDetails = details.trim();

        if (!trimmedTitle || !trimmedDetails) {
            setError("Both title and details are required.");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await addDoc(collection(db, "documents"), {
                title: trimmedTitle,
                details: trimmedDetails,
                userId: user.uid,
                createdAt: serverTimestamp(),
            });
            setTitle("");
            setDetails("");
            setSuccess("Document added to Firestore!");
        } catch (submitError) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "An error occurred while adding the document."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-shell">
            <h2>Add a Firestore Document</h2>

            <form onSubmit={handleSubmit} className="auth-form">
                <input
                  type="text"               
                  placeholder="Title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />

                <textarea
                  placeholder="Details"
                  value={details}
                  onChange={(event) => setDetails(event.target.value)}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save to Firestore"}
                </button>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}
            </form>
        </div>
    );
};

export default AddDataForm;