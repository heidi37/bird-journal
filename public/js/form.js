const today = new Date().toISOString().split("T")[0]
document.getElementById("date").value = today

const imageUpload = document.getElementById("image")
const imagePreview = document.getElementById("imagePreview")
const aiButton = document.getElementById("aiButton")

imageUpload.addEventListener("change", (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.src = e.target.result // Set preview image
      imagePreview.style.display = "block" // Show preview
      aiButton.style.display = "block" // Show AI button
    }
    reader.readAsDataURL(file)
  }
})

document
  .getElementById("aiButton")
  .addEventListener("click", async (event) => {
    event.preventDefault()

    const file = imageUpload.files[0]
    if (!file) return alert("Please select an image.")

    // Step 1: Upload Image to Cloudinary
    const cloudinaryUrl =
      "https://api.cloudinary.com/v1_1/dlaie1cyx/image/upload"
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "bird_preview") // Replace with your unsigned upload preset

    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: formData,
    }).then((res) => res.json())

    const imageUrl = cloudinaryResponse.secure_url
    console.log("Uploaded Image URL:", imageUrl)
  })
