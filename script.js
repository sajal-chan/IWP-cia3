const form = document.getElementById("internshipForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const confirmCheckbox = document.getElementById("confirm");
  if (!confirmCheckbox.checked) {
    alert("Please confirm that all information is accurate and complete.");
    return;
  }

  // Create FormData object from the form
  const formData = new FormData(form);

  try {
    // Use relative path to avoid CORS issues
    const res = await fetch("/api/submit", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert(data.message); // "Files uploaded successfully"
      form.reset();
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error(err);
    alert(
      "Error connecting to backend. Make sure the server is running at http://localhost:5000/"
    );
  }
});
